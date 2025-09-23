<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProfile extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'tenant_id',
        'source_app',
        'province_code',
        'city_code',
        'district_code',
        'village_code',
        'address',
        'latitude',
        'longitude',
        'nik',
        'pic_name',
        'pic_phone',
        'nib_number',
        'bank_account',
        'npwp',
        'sk_number',
        'nib_file',
        'ktp_file',
        'npwp_file',
        'sia_number',
    ];

    protected $casts = [
        'bank_account' => 'array',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
