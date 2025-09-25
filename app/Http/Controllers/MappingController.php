<?php

namespace App\Http\Controllers;

use App\Enums\RoleEnum;
use App\Http\Resources\PaginatedResourceResponse;
use App\Http\Resources\UserResource;
use App\Models\Apotek;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class MappingController extends Controller
{
    public function index(Request $request)
    {
        if (! $request->user()->can('view users')) {
            abort(403, 'Unauthorized action.');
        }

        $users = User::query()
            ->with('apotek', 'roles', 'permissions')
            ->where('status', 'approved') // hanya user yang sudah di-approve
            ->whereHas('roles', function ($q) {
                $q->whereIn('name', [RoleEnum::USER]);
            })
            ->latest()
            ->paginate(15);

        return Inertia::render('admin/mapping/index', [
            'users' => PaginatedResourceResponse::make($users, UserResource::class),
            'allUsers' => User::count(),
            'activeUsers' => User::active()->count(),
            'apoteks' => Apotek::active()->get(),
        ]);
    }

    /**
     * Map a user to an apotek.
     */
    public function mapUser(Request $request, ?User $user)
    {
        if (! $user) {
            Log::error('User not found during mapUser', [
                'userId' => null,
                'url' => $request->fullUrl(),
                'payload' => $request->all(),
            ]);

            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        if (! $request->user()->can('update users')) {
            abort(403, 'Unauthorized action.');
        }

        if ($user->status !== 'approved') {
            return back()->with('error', 'User belum di-approve. Tidak bisa di-mapping.');
        }

        $validated = $request->validate([
            'apotek_id' => ['required', 'exists:apoteks,id'],
        ]);

        $user->update([
            'apotek_id' => $validated['apotek_id'],
            'is_active' => true,
        ]);

        return back()->with('success', 'User mapped successfully.');
    }
}
