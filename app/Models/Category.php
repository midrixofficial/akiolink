<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Category extends Model
{
    protected $fillable = ['merchant_id', 'name', 'description', 'image', 'order_by'];
    protected $appends = ['image_url'];
    protected $casts = [
        'merchant_id' => 'integer',
        'order_by' => 'integer',
    ];

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? Storage::url($this->image) : null;
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
