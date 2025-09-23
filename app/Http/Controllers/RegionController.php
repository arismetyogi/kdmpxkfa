<?php

namespace App\Http\Controllers;

use App\Services\RegionService;
use Illuminate\Http\Request;

class RegionController extends Controller
{
    protected $regionService;

    public function __construct(RegionService $regionService)
    {
        $this->regionService = $regionService;
    }

    /**
     * Get provinces
     */
    public function provinces()
    {
        $provinces = $this->regionService->getProvinces();
        return response()->json($provinces);
    }

    /**
     * Get cities by province code
     */
    public function cities($provinceCode)
    {
        $cities = $this->regionService->getCitiesByProvince($provinceCode);
        return response()->json($cities);
    }

    /**
     * Get districts by city code
     */
    public function districts($cityCode)
    {
        $districts = $this->regionService->getDistrictsByCity($cityCode);
        return response()->json($districts);
    }

    /**
     * Get villages by district code
     */
    public function villages($districtCode)
    {
        $villages = $this->regionService->getVillagesByDistrict($districtCode);
        return response()->json($villages);
    }
}