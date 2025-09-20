<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $fillable = [
        'id_transaksi',
        'merchant_name',
        'total_qty',
        'total_nominal',
        'status',
    ];
}
