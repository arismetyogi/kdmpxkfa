<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render('orders/page', []);
    }

    public function cart()
    {
        return Inertia::render('orders/cart', []);
    }

    public function po()
    {
        return Inertia::render('orders/po', []);
    }

    public function history()
    {
        return Inertia::render('orders/history', []);
    }
}
