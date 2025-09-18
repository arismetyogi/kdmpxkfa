<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AccountManageController extends Controller
{
    public function index()
    {
       
        $users = User::with(['apotek', 'roles'])
            ->latest()
            ->get();

        return inertia('admin/account/index', [
            'users' => $users,
        ]);
    }
}
