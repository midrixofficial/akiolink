<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->unsignedBigInteger('merchant_id')->nullable()->after('id')->index();
            $table->string('short_description')->nullable()->after('description');
            $table->string('sku')->nullable()->after('short_description');
            $table->string('type')->nullable()->after('sku');
            $table->string('unit')->nullable()->after('type');
            $table->decimal('weight', 10, 3)->nullable()->after('unit');
            $table->decimal('quantity_value', 10, 3)->nullable()->after('weight');
            $table->string('quantity_unit')->nullable()->after('quantity_value');
            $table->decimal('discount_price', 10, 2)->nullable()->after('price');
            $table->decimal('cost_price', 10, 2)->nullable()->after('discount_price');
            $table->integer('stock_quantity')->default(0)->after('cost_price');
            $table->integer('min_stock_alert')->default(0)->after('stock_quantity');
            $table->boolean('track_stock')->default(true)->after('min_stock_alert');
            $table->boolean('is_available')->default(true)->after('track_stock');
            $table->boolean('is_featured')->default(false)->after('is_available');
            $table->json('gallery')->nullable()->after('image');
            $table->string('tags')->nullable()->after('gallery');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'merchant_id',
                'short_description',
                'sku',
                'type',
                'unit',
                'weight',
                'quantity_value',
                'quantity_unit',
                'discount_price',
                'cost_price',
                'stock_quantity',
                'min_stock_alert',
                'track_stock',
                'is_available',
                'is_featured',
                'gallery',
                'tags',
            ]);
        });
    }
};
