<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    /**
     * Preview invoice di browser (React Inertia).
     */
    public function show(Invoice $invoice)
    {
        $invoice->load([
            'order.user',
            'order.orderItems.product.category',
        ]);

        return Inertia::render('invoices/show', [
            'invoice' => $invoice
        ]);
    }

    
    public function download(Invoice $invoice)
    {
        $invoice->load([
            'order.user',
            'order.orderItems.product.category',
        ]);

        // Pastikan file ini ada: resources/views/invoices/template.blade.php
        $pdf = Pdf::loadView('invoices.template', compact('invoice'))
            ->setPaper('A4', 'landscape');

        $filename = $invoice->invoice_number . '.pdf';

       return $pdf->download($filename);

    }
}
