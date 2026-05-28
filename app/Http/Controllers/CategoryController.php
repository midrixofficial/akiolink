<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::query();

        if (Schema::hasColumn('categories', 'merchant_id')) {
            $merchantId = $this->getMerchantId($request);
            if ($merchantId) {
                $query->where('merchant_id', $merchantId);
            }
        }

        if (Schema::hasColumn('categories', 'order_by')) {
            $query->orderBy('order_by');
        }

        return $query->orderBy('id')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        if (Schema::hasColumn('categories', 'merchant_id')) {
            $validated['merchant_id'] = $this->getMerchantId($request);
        }

        if (Schema::hasColumn('categories', 'order_by')) {
            $merchantId = $validated['merchant_id'] ?? null;
            if ($merchantId) {
                $validated['order_by'] = (Category::where('merchant_id', $merchantId)->max('order_by') ?? 0) + 1;
            } else {
                $validated['order_by'] = (Category::max('order_by') ?? 0) + 1;
            }
        }

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        return Category::create($validated);
    }

    public function show(Request $request, Category $category)
    {
        if (Schema::hasColumn('categories', 'merchant_id')) {
            $merchantId = $this->getMerchantId($request);
            if ($category->merchant_id !== $merchantId) {
                abort(403, 'Unauthorized action.');
            }
        }
        return $category;
    }

    public function update(Request $request, Category $category)
    {
        if (Schema::hasColumn('categories', 'merchant_id')) {
            $merchantId = $this->getMerchantId($request);
            if ($category->merchant_id !== $merchantId) {
                abort(403, 'Unauthorized action.');
            }
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        if (Schema::hasColumn('categories', 'merchant_id')) {
            $validated['merchant_id'] = $this->getMerchantId($request);
        }

        if ($request->hasFile('image')) {
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }
            $validated['image'] = $request->file('image')->store('categories', 'public');
        }

        $category->update($validated);

        return $category;
    }

    public function destroy(Request $request, Category $category)
    {
        if (Schema::hasColumn('categories', 'merchant_id')) {
            $merchantId = $this->getMerchantId($request);
            if ($category->merchant_id !== $merchantId) {
                abort(403, 'Unauthorized action.');
            }
        }

        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }
        $category->delete();

        return response()->noContent();
    }

    public function reorder(Request $request)
    {
        if (!Schema::hasColumn('categories', 'order_by')) {
            return response()->json([
                'message' => 'order_by column missing. Please run migrations first.',
            ], 422);
        }

        $validated = $request->validate([
            'categories' => 'required|array|min:1',
            'categories.*.id' => 'required|exists:categories,id',
            'categories.*.order_by' => 'required|integer|min:1',
        ]);

        $merchantId = Schema::hasColumn('categories', 'merchant_id') ? $this->getMerchantId($request) : null;

        DB::transaction(function () use ($validated, $merchantId) {
            foreach ($validated['categories'] as $item) {
                $query = Category::where('id', $item['id']);
                if ($merchantId) {
                    $query->where('merchant_id', $merchantId);
                }
                $query->update(['order_by' => $item['order_by']]);
            }
        });

        return response()->json(['message' => 'Category order updated successfully.']);
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
}
