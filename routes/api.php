<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MerchantController;
use App\Http\Controllers\SupportController;
use App\Http\Controllers\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/signup', [AuthController::class, 'signup']);
    Route::post('/signin', [AuthController::class, 'signin']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/signout', [AuthController::class, 'signout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/profile/update', [AuthController::class, 'updateProfile']);
        Route::post('/profile/password', [AuthController::class, 'updatePassword']);
    });
});

Route::prefix('open')->group(function () {
    Route::get('/products', [ProductController::class, 'publicIndex']);
    Route::get('/products/{id}', [ProductController::class, 'publicShow']);
    Route::post('/orders', [OrderController::class, 'storeOrder']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/categories/reorder', [CategoryController::class, 'reorder']);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('products', ProductController::class);

    Route::get('/merchant', [MerchantController::class, 'show']);
    Route::post('/merchant/update', [MerchantController::class, 'update']);
    Route::get('/support/tickets', [SupportController::class, 'index']);
    Route::post('/support/tickets', [SupportController::class, 'store']);
    Route::post('/support/tickets/{id}/reply', [SupportController::class, 'reply']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders/{id}/status', [OrderController::class, 'updateStatus']);
});
