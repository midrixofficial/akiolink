<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Merchant extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'business_name',
        'business_mobile',
        'business_email',
        'business_address',
        'store_status',
        'auto_accept',
        'prep_time',
        'currency',
        'tax_rate',
        'min_order_value',
        'delivery_charge',
        'timezone',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
