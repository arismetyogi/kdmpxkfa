<?php

namespace App\Enums;

enum OrderStatusEnum: string
{
    case CREATED = 'new';
    case PROCESS = 'diproses';
<<<<<<< HEAD
    case DELIVERY = 'dalam pengiriman';
=======
    case DELIVERY = 'dalam-pengiriman';
>>>>>>> KDMP/master
    case RECEIVED = 'diterima';
    case CANCELED = 'dibatalkan';

    public function label(): string
    {
<<<<<<< HEAD
        return match($this){
            self::CREATED => 'Dibuat',
            self::PROCESS => 'Diproses',
            self::DELIVERY => 'Dalam pengiriman',
=======
        return match ($this) {
            self::CREATED => 'Dibuat',
            self::PROCESS => 'Diproses',
            self::DELIVERY => 'Dalam Pengiriman',
>>>>>>> KDMP/master
            self::RECEIVED => 'Diterima',
            self::CANCELED => 'Dibatalkan',
        };
    }

    public function color(): string
    {
<<<<<<< HEAD
        return match($this){
=======
        return match ($this) {
>>>>>>> KDMP/master
            self::CREATED => 'text-blue-600 bg-blue-100 dark:text-blue-200 dark:bg-blue-900/40',
            self::PROCESS => 'text-amber-600 bg-amber-100 dark:text-amber-200 dark:bg-amber-900/40',
            self::DELIVERY => 'text-sky-600 bg-sky-100 dark:text-sky-200 dark:bg-sky-900/40',
            self::RECEIVED => 'text-emerald-600 bg-emerald-100 dark:text-emerald-200 dark:bg-emerald-900/40',
            self::CANCELED => 'text-rose-600 bg-rose-100 dark:text-rose-200 dark:bg-rose-900/40',
        };
    }

    public static function colors(): array
    {
<<<<<<< HEAD
         return [
            self::CREATED->value => 'text-cyan-600 bg-cyan-100 dark:text-cyan-200 dark:bg-cyan-900/40',
            self::PROCESS->value => 'text-amber-600 bg-amber-100 dark:text-amber-200 dark:bg-amber-900/40',
            self::DELIVERY->value => 'text-sky-600 bg-sky-100 dark:text-sky-200 dark:bg-sky-900/40',
            self::RECEIVED->value => 'text-emerald-600 bg-emerald-100 dark:text-emerald-200 dark:bg-emerald-900/40',
            self::CANCELED->value => 'text-rose-600 bg-rose-100 dark:text-rose-200 dark:bg-rose-900/40',         ];
=======
        return [
            self::CREATED->value => 'text-blue-600 bg-blue-100 dark:text-blue-200 dark:bg-blue-900/40',
            self::PROCESS->value => 'text-amber-600 bg-amber-100 dark:text-amber-200 dark:bg-amber-900/40',
            self::DELIVERY->value => 'text-sky-600 bg-sky-100 dark:text-sky-200 dark:bg-sky-900/40',
            self::RECEIVED->value => 'text-emerald-600 bg-emerald-100 dark:text-emerald-200 dark:bg-emerald-900/40',
            self::CANCELED->value => 'text-rose-600 bg-rose-100 dark:text-rose-200 dark:bg-rose-900/40', ];
>>>>>>> KDMP/master
    }

    public static function toArray(): array
    {
        $array = [];
        foreach (self::cases() as $case) {
            $array[$case->value] = $case->label();
        }
<<<<<<< HEAD
        return $array;
    }


}


=======

        return $array;
    }
}
>>>>>>> KDMP/master
