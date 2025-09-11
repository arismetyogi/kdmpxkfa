<?php

namespace App\Enums;

enum RoleEnum: string
{
    case SUPER_ADMIN = 'super-admin';
    case ADMIN_APOTEK = 'admin-apotek';
    case USER = 'user';

    public static function labels(): array
    {
        return [
            'super-admin' => 'Super Admin',
            'admin-apotek' => 'Admin Apotek',
            'user' => 'User',
        ];
    }

    public function label(): string
    {
        return self::labels()[$this->value];
    }

}
