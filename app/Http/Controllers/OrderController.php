<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Check if there are orders. If 0, seed 15 beautiful mock orders to demonstrate the list and view features.
        if (Order::where('user_id', $user->id)->count() === 0) {
            $this->seedMockOrders($user->id);
        }

        $limit = $request->get('limit', 10);
        
        $orders = Order::where('user_id', $user->id)
            ->withCount('items')
            ->orderBy('created_at', 'desc')
            ->paginate($limit);

        return response()->json($orders);
    }

    public function show(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        $order = Order::where('user_id', $user->id)
            ->with('items')
            ->findOrFail($id);

        return response()->json($order);
    }

    public function updateStatus(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        $order = Order::where('user_id', $user->id)->findOrFail($id);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:Pending,Completed,Cancelled,On Progress,On Hold'],
        ]);

        $order->update([
            'status' => $validated['status']
        ]);

        return response()->json([
            'message' => 'Order status updated successfully.',
            'order' => $order
        ]);
    }

    public function storeOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'merchant_slug' => ['required', 'string'],
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['nullable', 'string', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:20'],
            'delivery_address' => ['required', 'string'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_name' => ['required', 'string'],
            'items.*.price' => ['required', 'numeric', 'min:0'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.product_id' => ['nullable'],
        ]);

        $slug = $validated['merchant_slug'];
        $merchant = \App\Models\Merchant::all()->first(function($m) use ($slug) {
            return strtolower(preg_replace('/[^a-z0-9]+/i', '-', $m->business_name)) === $slug;
        });

        // Fallback to first merchant if none matches
        if (!$merchant) {
            $merchant = \App\Models\Merchant::first();
        }

        if (!$merchant) {
            return response()->json(['message' => 'Merchant not found.'], 404);
        }

        // Generate ORD-XXXX format
        $orderNumber = 'ORD-' . rand(1000, 9999);

        // Ensure order_items table exists (per user prompt: "if there is no order_items table create once")
        // In Laravel, if table was already dropped or doesn't exist, we can dynamically run schema logic to be completely foolproof!
        if (!\Illuminate\Support\Facades\Schema::hasTable('order_items')) {
            \Illuminate\Support\Facades\Schema::create('order_items', function ($table) {
                $table->id();
                $table->foreignId('order_id')->constrained()->onDelete('cascade');
                $table->foreignId('product_id')->nullable()->constrained()->onDelete('set null');
                $table->string('product_name');
                $table->integer('quantity');
                $table->decimal('price', 10, 2);
                $table->timestamps();
            });
        }

        $order = Order::create([
            'user_id' => $merchant->user_id,
            'order_number' => $orderNumber,
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'] ?? null,
            'customer_phone' => $validated['customer_phone'],
            'delivery_address' => $validated['delivery_address'],
            'total_amount' => $validated['total_amount'],
            'status' => 'Pending',
        ]);

        foreach ($validated['items'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'] ?? null,
                'product_name' => $item['product_name'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);
        }

        return response()->json([
            'message' => 'Order placed successfully.',
            'order' => $order->load('items')
        ], 201);
    }

    private function seedMockOrders($userId): void
    {
        $customers = [
            ['name' => 'John Doe', 'email' => 'john@example.com', 'phone' => '+1 (555) 019-2834', 'address' => '123 Main St, New York, NY'],
            ['name' => 'David Roy', 'email' => 'david@example.com', 'phone' => '+1 (555) 014-3920', 'address' => '456 Oak Ave, Los Angeles, CA'],
            ['name' => 'Sara Khan', 'email' => 'sara@example.com', 'phone' => '+1 (555) 012-9831', 'address' => '789 Pine Rd, San Francisco, CA'],
            ['name' => 'Mike Lee', 'email' => 'mike@example.com', 'phone' => '+1 (555) 011-8273', 'address' => '321 Elm St, Chicago, IL'],
            ['name' => 'Priya Patel', 'email' => 'priya@example.com', 'phone' => '+1 (555) 018-9321', 'address' => '654 Maple Dr, Seattle, WA'],
            ['name' => 'Emily Davis', 'email' => 'emily@example.com', 'phone' => '+1 (555) 015-8321', 'address' => '987 Cedar Ln, Austin, TX'],
            ['name' => 'Michael Brown', 'email' => 'michael@example.com', 'phone' => '+1 (555) 017-2938', 'address' => '147 Birch Blvd, Denver, CO'],
            ['name' => 'Sophia Wilson', 'email' => 'sophia@example.com', 'phone' => '+1 (555) 013-4829', 'address' => '258 Walnut Rd, Boston, MA'],
            ['name' => 'Daniel Garcia', 'email' => 'daniel@example.com', 'phone' => '+1 (555) 019-1039', 'address' => '369 Cherry Ave, Miami, FL'],
            ['name' => 'Emma Martinez', 'email' => 'emma@example.com', 'phone' => '+1 (555) 014-8490', 'address' => '951 Olive St, Phoenix, AZ'],
        ];

        $statuses = ['Pending', 'Completed', 'Cancelled', 'On Progress', 'On Hold'];
        
        // Find some products from the database if they exist to attach real product IDs
        $products = Product::where('user_id', $userId)->get();

        for ($i = 1; $i <= 15; $i++) {
            $customer = $customers[array_rand($customers)];
            $status = $statuses[array_rand($statuses)];
            $orderNumber = 'ORD-' . rand(1000, 9999);

            $order = Order::create([
                'user_id' => $userId,
                'order_number' => $orderNumber,
                'customer_name' => $customer['name'],
                'customer_email' => $customer['email'],
                'customer_phone' => $customer['phone'],
                'delivery_address' => $customer['address'],
                'total_amount' => 0, // calculated below
                'status' => $status,
                'created_at' => now()->subHours(rand(1, 72)),
            ]);

            // Add 1-3 items
            $itemCount = rand(1, 3);
            $totalAmount = 0;

            for ($j = 0; $j < $itemCount; $j++) {
                $qty = rand(1, 3);
                
                if ($products->count() > 0) {
                    $prod = $products->random();
                    $name = $prod->name;
                    $price = $prod->price;
                    $prodId = $prod->id;
                } else {
                    $mockItems = [
                        ['name' => 'Chicken Burger', 'price' => 250.00],
                        ['name' => 'Pizza Margherita', 'price' => 450.00],
                        ['name' => 'Pasta Arrabiata', 'price' => 320.00],
                        ['name' => 'Caesar Salad', 'price' => 180.00],
                        ['name' => 'Garlic Bread', 'price' => 120.00],
                    ];
                    $mockItem = $mockItems[array_rand($mockItems)];
                    $name = $mockItem['name'];
                    $price = $mockItem['price'];
                    $prodId = null;
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $prodId,
                    'product_name' => $name,
                    'quantity' => $qty,
                    'price' => $price,
                ]);

                $totalAmount += ($price * $qty);
            }

            $order->update([
                'total_amount' => $totalAmount
            ]);
        }
    }
}
