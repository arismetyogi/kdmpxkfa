<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BankAccount extends Model
{
    public function apoteks(): HasMany
    {
        return $this->hasMany(Apotek::class, 'branch_code', 'branch_code');
    }
}
