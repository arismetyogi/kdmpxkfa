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
            'phone' => $request['phone'] ?? null,
            'tenant_id' => $request['tenant_id'] ?? null,
            'tenant_name' => $request['tenant_name'] ?? null,
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
            'email' => 'required|string|email|max:255',
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'tenant_id' => ['required', 'string', 'max:255'],
            'tenant_name' => ['nullable', 'string', 'max:255'],
            'sia_number' => ['nullable', 'string', 'max:255'],
            'sia_document' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'], // 2MB max
        ]);

        $user = $request->user();

        // Update user profile
        $user->update([
            'email' => $validated['email'],
            'name' => $validated['name'],
            'onboarding_completed' => true,
            'phone' => $validated['phone'],
            'sia_number' => $validated['sia_number'],
            'tenant_id' => $validated['tenant_id'],
            'tenant_name' => $validated['tenant_name'],
        ]);

        // Handle SIA document upload
        if ($request->hasFile('sia_document')) {
            $user->addMediaFromRequest('sia_document')
                ->toMediaCollection('sia_documents');
        }

        return redirect()->intended(route('orders.products'))->with('success', 'Onboarding completed successfully!');
    }
}
