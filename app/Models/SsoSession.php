<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SsoSession extends Model
{
    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'metadata' => 'array',
        ];
    }

    /**
     * Get the user that owns the SSO session.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if the SSO session is expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Check if the SSO session is active.
     */
    public function isActive(): bool
    {
        return ! $this->isExpired();
    }

    /**
     * Scope to get active sessions only.
     */
    public function scopeActive($query)
    {
        return $query->where('expires_at', '>', now());
    }

    /**
     * Scope to get expired sessions only.
     */
    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<=', now());
    }

    /**
     * Scope to get sessions by origin app.
     */
    public function scopeByOriginApp($query, string $originApp)
    {
        return $query->where('origin_app', $originApp);
    }
}
