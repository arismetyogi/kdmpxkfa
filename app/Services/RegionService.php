<?php

namespace App\Services;

use App\Models\Region;

class RegionService
{
    /**
     * Get all provinces
     */
    public function getProvinces()
    {
        return Region::getProvinces();
    }

    /**
     * Get cities by province code
     */
    public function getCitiesByProvince(string $provinceCode)
    {
        return Region::getCitiesByProvince($provinceCode);
    }

    /**
     * Get districts by city code
     */
    public function getDistrictsByCity(string $cityCode)
    {
        return Region::getDistrictsByCity($cityCode);
    }

    /**
     * Get villages by district code
     */
    public function getVillagesByDistrict(string $districtCode)
    {
        return Region::getVillagesByDistrict($districtCode);
    }
}
