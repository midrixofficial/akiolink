<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    protected $fillable = [
        'merchant_id',
        'category_id',
        'name',
        'description',
        'short_description',
        'sku',
        'type',
        'unit',
        'weight',
        'quantity_value',
        'quantity_unit',
        'price',
        'discount_price',
        'cost_price',
        'stock_quantity',
        'min_stock_alert',
        'track_stock',
        'is_available',
        'is_featured',
        'image',
        'gallery',
        'tags',
    ];
    protected $casts = [
        'merchant_id' => 'integer',
        'category_id' => 'integer',
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'weight' => 'decimal:3',
        'quantity_value' => 'decimal:3',
        'stock_quantity' => 'integer',
        'min_stock_alert' => 'integer',
        'track_stock' => 'boolean',
        'is_available' => 'boolean',
        'is_featured' => 'boolean',
        'gallery' => 'array',
    ];
    protected $appends = ['image_url', 'gallery_urls'];

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? Storage::url($this->image) : null;
    }

    public function getGalleryUrlsAttribute(): array
    {
        if (!is_array($this->gallery)) {
            return [];
        }

        return array_values(array_filter(array_map(
            fn ($item) => $item ? Storage::url($item) : null,
            $this->gallery
        )));
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
