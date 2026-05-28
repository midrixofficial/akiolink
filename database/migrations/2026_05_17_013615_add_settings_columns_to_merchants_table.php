<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('merchants', function (Blueprint $table) {
            $table->string('store_status')->default('open')->after('business_address');
            $table->boolean('auto_accept')->default(true)->after('store_status');
            $table->integer('prep_time')->default(30)->after('auto_accept');
            $table->string('currency')->default('INR')->after('prep_time');
            $table->decimal('tax_rate', 5, 2)->default(0.00)->after('currency');
            $table->decimal('min_order_value', 10, 2)->default(0.00)->after('tax_rate');
            $table->decimal('delivery_charge', 10, 2)->default(0.00)->after('min_order_value');
            $table->string('timezone')->default('Asia/Kolkata')->after('delivery_charge');
        });
    }

    public function down(): void
    {
        Schema::table('merchants', function (Blueprint $table) {
            $table->dropColumn([
                'store_status',
                'auto_accept',
                'prep_time',
                'currency',
                'tax_rate',
                'min_order_value',
                'delivery_charge',
                'timezone',
            ]);
        });
    }
};
