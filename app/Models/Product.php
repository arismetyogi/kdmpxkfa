<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Product extends Model implements HasMedia
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'sku',
        'name',
        'slug',
        'category_id',
        'weight',
        'length',
        'width',
        'height',
        'brand',
        'description',
        'dosage',
        'pharmacology',
        'base_uom',
        'order_unit',
        'content',
        'price',
        'image_alt',
        'is_active',
    ];

    protected $casts = [
        'dosage' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function carts(): HasMany
    {
        return $this->hasMany(Cart::class);
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')->width(100);
        $this->addMediaConversion('small')->width(480);
        $this->addMediaConversion('large')->width(1200);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function getFirstImageUrl($collectionName = 'images', $conversion = 'small'): string
    {
        return $this->getFirstMediaUrl($collectionName, $conversion);
    }

    public function getImages(): \Spatie\MediaLibrary\MediaCollections\Models\Collections\MediaCollection
    {
        return $this->getMedia('images');
    }
}
