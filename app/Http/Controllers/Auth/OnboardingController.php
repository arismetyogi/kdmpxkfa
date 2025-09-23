<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    /**
     * Show onboarding form with prefilled data
     */
    public function create(Request $request)
    {
        $user = User::whereId(Auth::id())->first();
        $user->load('userProfile');

        $prefilled = [
            'email' => $user->email ?? $request['email'],
            'name' => $user->name ?? $request['name'],
            'phone' => $user->phone ?? $request['phone'] ?? null,
            'tenant_id' => $user->tenant_id ?? $request['tenant_id'] ?? null,
            'tenant_name' => $user->tenant_name ?? $request['tenant_name'] ?? null,
            'province_code' => $user->userProfile->province_code ?? $request['province_code'] ?? null,
            'city_code' => $user->userProfile->city_code ?? $request['city_code'] ?? null,
            'district_code' => $user->userProfile->district_code ?? $request['district_code'] ?? null,
            'village_code' => $user->userProfile->village_code ?? $request['village_code'] ?? null,
            'address' => $user->userProfile->address ?? $request['address'] ?? null,
            'zipcode' => $user->userProfile->zipcode ?? $request['zipcode'] ?? null,
            'sia_number' => $user->userProfile->sia_number ?? $request['sia_number'] ?? null,
        ];

        return Inertia::render('auth/onboarding', [
            'prefilled_data' => $prefilled,
        ]);
    }

    /**
     * Handle onboarding form submission
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'tenant_id' => ['required', 'string', 'max:255'],
            'tenant_name' => ['nullable', 'string', 'max:255'],
            'province_code' => ['required', 'string', 'max:255'],
            'city_code' => ['required', 'string', 'max:255'],
            'district_code' => ['required', 'string', 'max:255'],
            'village_code' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:500'],
            'zipcode' => ['nullable', 'string', 'max:5'],
            'sia_number' => ['required', 'string', 'max:255'],
            'sia_document' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'], // 2MB max
        ]);

        $user = $request->user();

        // Update user's profile
        $user->userProfile()->update([
            'name' => $validated['name'],
            'tenant_name' => $validated['tenant_name'],
            'province_code' => $validated['province_code'],
            'city_code' => $validated['city_code'],
            'district_code' => $validated['district_code'],
            'village_code' => $validated['village_code'],
            'address' => $validated['address'],
            'zipcode' => $validated['zipcode'],
            'sia_number' => $validated['sia_number'],
        ]);

        // update onboarding status and display name
        $user->update([
            'name' => $validated['name'],
            'onboarding_completed' => true,
        ]);

        // Handle SIA document upload
        if ($request->hasFile('sia_document')) {
            $user->addMediaFromRequest('sia_document')
                ->toMediaCollection('sia_documents');
        }

        return redirect()->intended(route('dashboard'))->with('success', 'Onboarding completed successfully!');
    }
}
