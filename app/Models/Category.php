<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'main_category',
        'subcategory1',
        'subcategory2',
    ];

    public function getFullCategoryNameAttribute(): string
    {
        return collect([
            $this->main_category,
            $this->subcategory1,
            $this->subcategory2,
        ])
            ->filter() // remove null/empty values
            ->implode(' > ');
    }
}
