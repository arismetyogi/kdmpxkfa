<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements HasMedia
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, HasRoles, HasUuid, InteractsWithMedia, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'is_active',
        'avatar',
        'onboarding_completed',
        'phone',
        'sia_number',
        'tenant_name',
        'external_id',
        'tenant_id',
        'apotek_id',
        'status',       
        'approved_by',   
        'approved_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function apotek(): BelongsTo
    {
        return $this->belongsTo(Apotek::class);
    }

    public function scopeAdmin($query)
    {
        return $query->whereDoesntHave('roles', function ($q) {
            $q->where('name', 'user');
        });
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function approvedBy()
{
    return $this->belongsTo(User::class, 'approved_by');
}

// app/Models/User.php

public function getMenusAttribute()
{
    $roles = $this->roles->pluck('name')->toArray();

    if (in_array('super-admin', $roles)) {
        return [
            ['title' => 'Users', 'href' => route('admin.users.index')],
            ['title' => 'Roles', 'href' => route('admin.roles.index')],
            ['title' => 'Permissions', 'href' => route('admin.permissions.index')],
        ];
    }

    if (in_array('admin-apotek', $roles)) {
        return [
            ['title' => 'Orders', 'href' => route('admin.orders.index')],
            ['title' => 'Products', 'href' => route('admin.products.index')],
        ];
    }

    if (in_array('busdev', $roles)) {
        return [
            ['title' => 'Mapping', 'href' => route('admin.mapping.index')],
            ['title' => 'Accounts', 'href' => route('admin.accounts.index')],
        ];
    }

    return [];
}

    
}
