<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    public function index()
    {
        $orders = Purchase::latest()->get();

        return Inertia::render('admin/purchase/index', [
            'orders' => $orders
        ]);
    }

    public function show(Purchase $purchase)
    {
        return Inertia::render('admin/purchase/show', [
            'purchase' => $purchase
        ]);
    }

    public function accept(Purchase $purchase)
    {
        $purchase->update(['status' => 'Accepted']);
        return redirect()->back()->with('success', 'Purchase accepted.');
    }

    public function reject(Purchase $purchase)
    {
        $purchase->update(['status' => 'Rejected']);
        return redirect()->back()->with('success', 'Purchase rejected.');
    }
}
