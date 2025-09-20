<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountManageController extends Controller
{
    public function index(Request $request)
    {
        $users = User::with('apotek', 'roles')
            ->whereDoesntHave('roles', function ($q) {
                $q->whereIn('name', ['super-admin', 'admin']);
            })
            ->latest()
            ->get();

        return Inertia::render('admin/account/index', [
            'users' => $users,
        ]);
    }

    public function approve(Request $request, User $user)
    {
        if ($user->status !== 'Pending') {
            return back()->with('error', 'User sudah diproses sebelumnya.');
        }

        $user->update([
            'status' => 'Approved',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        return back()->with('success', 'User berhasil di-approve.');
    }

    public function reject(Request $request, User $user)
    {
        if ($user->status !== 'Pending') {
            return back()->with('error', 'User sudah diproses sebelumnya.');
        }

        $user->update([
            'status' => 'Rejected',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        return back()->with('success', 'User berhasil ditolak.');
    }
}
