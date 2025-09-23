<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    /**
     * Show onboarding form with prefilled data
     */
    public function create(Request $request)
    {
        $prefilled = session('prefilled_data') ?? [
            'email' => $request->user()->email ?? $request['email'],
            'name' => $request->user()->name ?? $request['name'],
            'phone' => $request->user()->phone ?? $request['phone'] ?? null,
            'tenant_id' => $request->user()->tenant_id ?? $request['tenant_id'] ?? null,
            'tenant_name' => $request->user()->tenant_name ?? $request['tenant_name'] ?? null,
            'address' => $request->user()->userProfile()->address ?? $request['address'] ?? null,
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
            'address' => ['required', 'string', 'max:500'],
            'zipcode' => ['nullable', 'string', 'max:5'],
            'sia_number' => ['required', 'string', 'max:255'],
            'sia_document' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'], // 2MB max
        ]);

        $user = auth()->user();

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

        // Handle SIA document upload
        if ($request->hasFile('sia_document')) {
            $user->addMediaFromRequest('sia_document')
                ->toMediaCollection('sia_documents');
        }

        return redirect()->intended(route('dashboard'))->with('success', 'Onboarding completed successfully!');
    }
}
