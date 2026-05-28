<?php

namespace App\Http\Controllers;

use App\Models\Merchant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MerchantController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $merchant = $user->merchant;

        if (!$merchant) {
            $merchant = Merchant::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'business_email' => $user->email,
                'business_mobile' => $user->mobile,
            ]);
        }

        return response()->json([
            'merchant' => $merchant
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        $merchant = $user->merchant;

        if (!$merchant) {
            $merchant = new Merchant(['user_id' => $user->id]);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'business_name' => ['required', 'string', 'max:255'],
            'business_mobile' => ['nullable', 'string', 'max:20'],
            'business_email' => ['nullable', 'email', 'max:255'],
            'business_address' => ['nullable', 'string'],
            'store_status' => ['nullable', 'string', 'in:open,closed'],
            'auto_accept' => ['nullable', 'boolean'],
            'prep_time' => ['nullable', 'integer', 'min:1'],
            'currency' => ['nullable', 'string', 'max:10'],
            'tax_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'min_order_value' => ['nullable', 'numeric', 'min:0'],
            'delivery_charge' => ['nullable', 'numeric', 'min:0'],
            'timezone' => ['nullable', 'string', 'max:100'],
        ]);

        $merchant->fill($validated);
        $merchant->save();

        return response()->json([
            'message' => 'Merchant details updated successfully.',
            'merchant' => $merchant
        ]);
    }
}
