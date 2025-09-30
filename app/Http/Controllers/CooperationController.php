<?php

namespace App\Http\Controllers;

use App\Models\Cooperation;
use App\Models\CooperationSubmission;
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
        $names = Cooperation::select('id', 'name')
            ->where('province', $province)
            ->where('city', $city)
            ->where('district', $district)
            ->where('village', $village)
            ->orderBy('name')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name
                ];
            });

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
                'koperasiId' => 'required|integer|exists:koperasi_master,id',
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
                '*.exists' => ':attribute tidak ditemukan dalam database',
            ],
            [
                'provinsi' => 'Provinsi',
                'kabupatenKota' => 'Kabupaten/Kota',
                'kecamatan' => 'Kecamatan',
                'kelurahanDesa' => 'Kelurahan/Desa',
                'koperasiId' => 'Koperasi',
                'gmapsLink' => 'Link Google Maps',
                'suratPeminatan' => 'Surat Peminatan',
                'selfAssessment' => 'Self Assessment',
                'fotoDalam' => 'Foto Dalam',
                'fotoLuar' => 'Foto Luar',
                'suratPernyataanApoteker' => 'Surat Pernyataan Apoteker',
                'video360' => 'Video 360',
            ]);

        // Get the cooperation by ID to get the name for folder path
        $cooperation = Cooperation::findOrFail($validated['koperasiId']);

        // Create folder structure: submissions/province_name/city_name/district_name/village_name/koperasi_name/
        $folderPath = "submissions/" .
                     str_replace(' ', '_', $validated['provinsi']) . "/" .
                     str_replace(' ', '_', $validated['kabupatenKota']) . "/" .
                     str_replace(' ', '_', $validated['kecamatan']) . "/" .
                     str_replace(' ', '_', $validated['kelurahanDesa']) . "/" .
                     str_replace(' ', '_', $cooperation->name);

        // Create the directory if it doesn't exist
        if (!file_exists(storage_path("app/public/{$folderPath}"))) {
            mkdir(storage_path("app/public/{$folderPath}"), 0755, true);
        }

        // Define file mapping between request fields and database columns
        $fileMappings = [
            'suratPeminatan' => 'proposal_letter',
            'selfAssessment' => 'self_assessment',
            'fotoDalam' => 'indoor_photo',
            'fotoLuar' => 'outdoor_photo',
            'suratPernyataanApoteker' => 'pharmacist_statement_letter',
            'video360' => 'video_360'
        ];

        // Store files with the requested naming convention
        $filePaths = [];
        foreach ($fileMappings as $requestField => $dbColumn) {
            if ($request->hasFile($requestField)) {
                $file = $request->file($requestField);
                $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $extension = $file->getClientOriginalExtension();

                // Create filename: fieldname-koperasi_name.extension
                $fileName = $requestField . '-' . str_replace(' ', '_', $cooperation->name) . '.' . $extension;

                // Store file in the specific folder
                $filePath = $file->storeAs($folderPath, $fileName, 'public');
                $filePaths[$dbColumn] = $filePath;
            }
        }

        // Generate submission number
        $submissionNumber = CooperationSubmission::generateSubmissionNumber();

        // Create the cooperation submission record
        $submission = CooperationSubmission::create([
            'submission_number' => $submissionNumber,
            'koperasi_id' => $validated['koperasiId'], // Now properly set the koperasi_id
            'name' => $cooperation->name, // Use name from the koperasi record
            'province' => $validated['provinsi'],
            'city' => $validated['kabupatenKota'],
            'district' => $validated['kecamatan'],
            'village' => $validated['kelurahanDesa'],
            'gmap_url' => $validated['gmapsLink'],
            'status' => 'submitted', // default status
            // Add file paths to the record
            'proposal_letter' => $filePaths['proposal_letter'] ?? null,
            'self_assessment' => $filePaths['self_assessment'] ?? null,
            'indoor_photo' => $filePaths['indoor_photo'] ?? null,
            'outdoor_photo' => $filePaths['outdoor_photo'] ?? null,
            'pharmacist_statement_letter' => $filePaths['pharmacist_statement_letter'] ?? null,
            'video_360' => $filePaths['video_360'] ?? null,
        ]);

        return back()->withSuccess('Permohonan berhasil dikirim!');
    }
}
