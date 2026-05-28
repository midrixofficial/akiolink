<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->with('category');

        if (Schema::hasColumn('products', 'merchant_id')) {
            $merchantId = $this->getMerchantId($request);
            if ($merchantId) {
                $query->where('merchant_id', $merchantId);
            }
        }

        return $query->orderByDesc('id')->get();
    }

    public function store(Request $request)
    {
        $validated = $this->validatePayload($request);

        if (Schema::hasColumn('products', 'merchant_id')) {
            $validated['merchant_id'] = $this->getMerchantId($request);
        }

        if (isset($validated['category_id'])) {
            $category = \App\Models\Category::find($validated['category_id']);
            if ($category && Schema::hasColumn('categories', 'merchant_id')) {
                $merchantId = $this->getMerchantId($request);
                if ($category->merchant_id !== $merchantId) {
                    abort(403, 'Invalid category for this merchant.');
                }
            }
        }

        $prepared = $this->preparePayload($request, $validated);

        return Product::create($prepared);
    }

    public function show(Request $request, Product $product)
    {
        if (Schema::hasColumn('products', 'merchant_id')) {
            $merchantId = $this->getMerchantId($request);
            if ($product->merchant_id !== $merchantId) {
                abort(403, 'Unauthorized action.');
            }
        }
        return $product->load('category');
    }

    public function update(Request $request, Product $product)
    {
        if (Schema::hasColumn('products', 'merchant_id')) {
            $merchantId = $this->getMerchantId($request);
            if ($product->merchant_id !== $merchantId) {
                abort(403, 'Unauthorized action.');
            }
        }

        $validated = $this->validatePayload($request);

        if (Schema::hasColumn('products', 'merchant_id')) {
            $validated['merchant_id'] = $this->getMerchantId($request);
        }

        if (isset($validated['category_id'])) {
            $category = \App\Models\Category::find($validated['category_id']);
            if ($category && Schema::hasColumn('categories', 'merchant_id')) {
                $merchantId = $this->getMerchantId($request);
                if ($category->merchant_id !== $merchantId) {
                    abort(403, 'Invalid category for this merchant.');
                }
            }
        }

        $prepared = $this->preparePayload($request, $validated, $product);

        $product->update($prepared);

        return $product->fresh()->load('category');
    }

    public function destroy(Request $request, Product $product)
    {
        if (Schema::hasColumn('products', 'merchant_id')) {
            $merchantId = $this->getMerchantId($request);
            if ($product->merchant_id !== $merchantId) {
                abort(403, 'Unauthorized action.');
            }
        }

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        if (is_array($product->gallery)) {
            foreach ($product->gallery as $file) {
                Storage::disk('public')->delete($file);
            }
        }

        $product->delete();

        return response()->noContent();
    }

    private function validatePayload(Request $request): array
    {
        return $request->validate([
            'merchant_id' => 'nullable|integer|min:1',
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string|max:500',
            'sku' => 'nullable|string|max:120',
            'type' => 'required|string|max:120',
            'unit' => 'required|string|max:120',
            'weight' => 'nullable|numeric|min:0',
            'quantity_value' => 'nullable|numeric|min:0',
            'quantity_unit' => 'nullable|string|max:50',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'min_stock_alert' => 'nullable|integer|min:0',
            'track_stock' => 'nullable|boolean',
            'is_available' => 'nullable|boolean',
            'is_featured' => 'nullable|boolean',
            'image' => 'nullable|image|max:2048',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|max:2048',
            'tags' => 'nullable|string',
        ]);
    }

    private function preparePayload(Request $request, array $validated, ?Product $product = null): array
    {
        $columns = Schema::getColumnListing('products');
        $prepared = [];

        foreach ($validated as $key => $value) {
            if (in_array($key, $columns, true)) {
                $prepared[$key] = $value;
            }
        }

        $prepared['track_stock'] = $request->boolean('track_stock', true);
        $prepared['is_available'] = $request->boolean('is_available', true);
        $prepared['is_featured'] = $request->boolean('is_featured', false);

        if (!in_array('merchant_id', $columns, true)) {
            unset($prepared['merchant_id']);
        }

        if ($request->hasFile('image') && in_array('image', $columns, true)) {
            if ($product?->image) {
                Storage::disk('public')->delete($product->image);
            }
            $prepared['image'] = $request->file('image')->store('products', 'public');
        }

        if ($request->hasFile('gallery') && in_array('gallery', $columns, true)) {
            if (is_array($product?->gallery)) {
                foreach ($product->gallery as $oldGallery) {
                    Storage::disk('public')->delete($oldGallery);
                }
            }

            $galleryPaths = [];
            foreach ((array) $request->file('gallery') as $file) {
                $galleryPaths[] = $file->store('products/gallery', 'public');
            }
            $prepared['gallery'] = $galleryPaths;
        }

        if (in_array('stock', $columns, true) && isset($prepared['stock_quantity'])) {
            $prepared['stock'] = $prepared['stock_quantity'];
        }

        return $prepared;
    }

    private function getMerchantId(Request $request): ?int
    {
        $user = $request->user();
        if (!$user) {
            return null;
        }

        $merchant = $user->merchant;
        if (!$merchant) {
            $merchant = \App\Models\Merchant::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'business_name' => $user->name . "'s Store",
                'business_email' => $user->email,
                'business_mobile' => $user->mobile,
            ]);
        }

        return $merchant->id;
    }

    /**
     * Display a listing of public products eager loaded with their category details.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function publicIndex(Request $request)
    {
        $query = Product::query()->with('category');

        // Filter by availability (default to true, showing only active products)
        if ($request->has('is_available')) {
            $query->where('is_available', $request->boolean('is_available'));
        } else {
            $query->where('is_available', true);
        }

        // Filter by merchant_id if provided
        if ($request->has('merchant_id')) {
            $query->where('merchant_id', $request->integer('merchant_id'));
        }

        // Filter by category_id if provided
        if ($request->has('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }

        // Filter by product type (e.g. Veg, Non-Veg)
        if ($request->has('type')) {
            $query->where('type', $request->string('type'));
        }

        // Filter by featured status
        if ($request->has('is_featured')) {
            $query->where('is_featured', $request->boolean('is_featured'));
        }

        // Fuzzy search on name, description, short_description or SKU
        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        // Sort configuration
        $sortBy = $request->string('sort_by', 'id');
        $sortOrder = $request->string('sort_order', 'desc');

        $allowedSorts = ['id', 'price', 'name', 'created_at'];
        if (!in_array($sortBy, $allowedSorts, true)) {
            $sortBy = 'id';
        }

        $sortOrder = strtolower($sortOrder) === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortOrder);

        // Pagination control
        $limit = min($request->integer('limit', 15), 100); // Caps limit at 100
        if ($request->boolean('paginate', true)) {
            return $query->paginate($limit);
        }

        return $query->get();
    }

    /**
     * Display the specified product with its category details.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function publicShow($id)
    {
        $product = Product::with('category')->find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found.'
            ], 404);
        }

        // Usually, private/inactive products should return 404 to the public.
        if (!$product->is_available) {
            return response()->json([
                'message' => 'Product is currently unavailable.'
            ], 404);
        }

        return response()->json($product);
    }
}
