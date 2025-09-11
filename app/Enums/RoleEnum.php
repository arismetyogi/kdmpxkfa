<?php

namespace App\Enums;

enum RoleEnum: string
{
    case SUPER_ADMIN = 'super-admin';
    case ADMIN_APOTEK = 'admin-apotek';
    case USER = 'user';

    public function label(): string
    {
        return match ($this) {
            self::SUPER_ADMIN => 'Super Admin',
            self::ADMIN_APOTEK => 'Admin Apotek',
            self::USER => 'User',
        };
    }

    public static function labels(): array
    {
        $labels = [];
        foreach (self::cases() as $case) {
            $labels[$case->value] = $case->label();
        }
        return $labels;
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public function isOneOf(self ...$roles): bool
    {
        return in_array($this, $roles, true);
    }
}
