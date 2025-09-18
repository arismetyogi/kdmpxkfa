<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AccountManageController extends Controller
{
    public function index()
{
    return inertia('admin/account/index');
}

}
