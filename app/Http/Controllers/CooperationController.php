<?php

namespace App\Http\Controllers;

use App\Models\Cooperation;
use Illuminate\Http\Request;

class CooperationController extends Controller
{
    /**
     * Get provinces from koperasi master table
     */
    public function provinces()
    {
        $provinces = Cooperation::select('province')
            ->distinct()
            ->orderBy('province')
            ->pluck('province');

        return response()->json($provinces);
    }

    /**
     * Get cities by province from koperasi master table
     */
    public function cities($province)
    {
        $cities = Cooperation::select('city')
            ->where('province', $province)
            ->distinct()
            ->orderBy('city')
            ->pluck('city');

        return response()->json($cities);
    }

    /**
     * Get districts by city from koperasi master table
     */
    public function districts($province, $city)
    {
        $districts = Cooperation::select('district')
            ->where('province', $province)
            ->where('city', $city)
            ->distinct()
            ->orderBy('district')
            ->pluck('district');

        return response()->json($districts);
    }

    /**
     * Get villages by district from koperasi master table
     */
    public function villages($province, $city, $district)
    {
        $villages = Cooperation::select('village')
            ->where('province', $province)
            ->where('city', $city)
            ->where('district', $district)
            ->distinct()
            ->orderBy('village')
            ->pluck('village');

        return response()->json($villages);
    }

    /**
     * Get names by village from koperasi master table
     */
    public function namesByVillage($province, $city, $district, $village)
    {
        $names = Cooperation::select('name')
            ->where('province', $province)
            ->where('city', $city)
            ->where('district', $district)
            ->orderBy('name')
            ->pluck('name');

        return response()->json($names);
    }

    /**
     * Store a new cooperation request
     */
    public function store(Request $request)
    {
        $validated = $request->validate(
            [
                'provinsi' => 'required|string',
                'kabupatenKota' => 'required|string',
                'kecamatan' => 'required|string',
                'kelurahanDesa' => 'required|string',
                'namaKoperasi' => 'required|string',
                'gmapsLink' => 'required|url',
                'suratPeminatan' => 'required|file|mimes:pdf,doc,docx,png,jpg,jpeg|max:10240',
                'selfAssessment' => 'required|file|mimes:pdf,doc,docx,xlsx,xls|max:10240',
                'fotoDalam' => 'required|file|mimes:png,jpg,jpeg|max:10240',
                'fotoLuar' => 'required|file|mimes:png,jpg,jpeg|max:10240',
                'suratPernyataanApoteker' => 'required|file|mimes:pdf,doc,docx,png,jpg,jpeg|max:10240',
                'video360' => 'required|file|mimes:mp4,mov,avi|max:51200',
            ],
            [
                '*.required' => ':attribute tidak boleh kosong',
                '*.url' => ':attribute bukan url yang valid',
                '*.mimes' => ':attribute Format file tidak valid',
            ],
            [
                'provinsi' => 'Provinsi',
                'kabupatenKota' => 'Kabupaten/Kota',
                'kecamatan' => 'Kecamatan',
                'kelurahanDesa' => 'Kelurahan/Desa',
                'namaKoperasi' => 'Nama Koperasi',
                'gmapsLink' => 'Link Google Maps',
                'suratPeminatan' => 'Surat Peminatan',
                'selfAssessment' => 'Self Assessment',
                'fotoDalam' => 'Foto Dalam',
                'fotoLuar' => 'Foto Luar',
                'suratPernyataanApoteker' => 'Surat Pernyataan Apoteker',
                'video360' => 'Video 360',
            ]);

        // Inertia expects a JSON response, not a redirect
        return back()->withSuccess('Data berhasil ditambahkan');
    }
}
