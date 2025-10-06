<?php

namespace App\Helpers;

class TerbilangHelper
{
    public static function terbilang($angka)
    {
        $angka = abs($angka);
        $baca = [
            "", "Satu", "Dua", "Tiga", "Empat", "Lima",
            "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"
        ];
        $hasil = "";

        if ($angka < 12) {
            $hasil = " " . $baca[$angka];
        } elseif ($angka < 20) {
            $hasil = self::terbilang($angka - 10) . " Belas";
        } elseif ($angka < 100) {
            $hasil = self::terbilang(intval($angka / 10)) . " Puluh " . self::terbilang($angka % 10);
        } elseif ($angka < 200) {
            $hasil = " Seratus " . self::terbilang($angka - 100);
        } elseif ($angka < 1000) {
            $hasil = self::terbilang(intval($angka / 100)) . " Ratus " . self::terbilang($angka % 100);
        } elseif ($angka < 2000) {
            $hasil = " Seribu " . self::terbilang($angka - 1000);
        } elseif ($angka < 1000000) {
            $hasil = self::terbilang(intval($angka / 1000)) . " Ribu " . self::terbilang($angka % 1000);
        } elseif ($angka < 1000000000) {
            $hasil = self::terbilang(intval($angka / 1000000)) . " Juta " . self::terbilang($angka % 1000000);
        } elseif ($angka < 1000000000000) {
            $hasil = self::terbilang(intval($angka / 1000000000)) . " Miliar " . self::terbilang($angka % 1000000000);
        } elseif ($angka < 1000000000000000) {
            $hasil = self::terbilang(intval($angka / 1000000000000)) . " Triliun " . self::terbilang($angka % 1000000000000);
        }

        // Rapikan spasi ganda
        return trim(preg_replace('/\s+/', ' ', $hasil));
    }
}
