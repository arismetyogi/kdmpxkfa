<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MappingController extends Controller
{
    public function Index()
  { 
    return inertia('admin/mapping/index');
  }
}
