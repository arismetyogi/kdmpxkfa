<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    protected $fillable = ['code', 'name'];

    /**
     * Get provinces (top-level regions)
     */
    public static function getProvinces()
    {
        return self::whereRaw("CHAR_LENGTH(code) - CHAR_LENGTH(REPLACE(code, '.', '')) = 0")
            ->orderBy('name')
            ->get(['code', 'name']);
    }

    /**
     * Get cities by province code
     */
    public static function getCitiesByProvince($provinceCode)
    {
        return self::where('code', 'LIKE', $provinceCode . '.%')
            ->whereRaw("CHAR_LENGTH(code) - CHAR_LENGTH(REPLACE(code, '.', '')) = 1")
            ->orderBy('name')
            ->get(['code', 'name']);
    }

    /**
     * Get districts by city code
     */
    public static function getDistrictsByCity($cityCode)
    {
        return self::where('code', 'LIKE', $cityCode . '.%')
            ->whereRaw("CHAR_LENGTH(code) - CHAR_LENGTH(REPLACE(code, '.', '')) = 2")
            ->orderBy('name')
            ->get(['code', 'name']);
    }

    /**
     * Get villages by district code
     */
    public static function getVillagesByDistrict($districtCode)
    {
        return self::where('code', 'LIKE', $districtCode . '.%')
            ->whereRaw("CHAR_LENGTH(code) - CHAR_LENGTH(REPLACE(code, '.', '')) = 3")
            ->orderBy('name')
            ->get(['code', 'name']);
    }
}
