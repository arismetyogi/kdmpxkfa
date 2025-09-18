<?php

namespace App\Http\Controllers;

use App\Models\Purchase; // Sesuaikan dengan nama model Anda, misalnya PurchaseOrder
use App\Models\Order; // Tambahkan model Order jika Anda menggunakannya
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB; // 
use Illuminate\Support\Facades\Auth;

class PurchaseController extends Controller
{

    public function index()
    {
        // Gunakan pagination untuk data yang lebih efisien
        $orders = Purchase::latest()->paginate(10); // Menampilkan 10 data per halaman

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

    // Ubah logic agar lebih robust
    public function accept(Purchase $purchase)
    {
        // Mulai transaksi database
        DB::beginTransaction();

        try {
            // 1. Perbarui status Purchase menjadi 'Accepted'
            $purchase->update(['status' => 'Accepted']);

            // 2. Buat entri baru di tabel 'orders'
            // Asumsikan data yang dibutuhkan sama, sesuaikan jika berbeda
            $order = Order::create([
                'transaction_number' => $purchase->id_transaksi, // Contoh
                'user_id' => $purchase->user_id, // Contoh
                'total_price' => $purchase->total_price, // Contoh
                'status' => 'new', // Status awal di tabel orders
            ]);

            // 3. Tambahkan logic untuk item pesanan jika ada
            // if ($purchase->items) {
            //     foreach ($purchase->items as $item) {
            //         // Salin data item ke order_items
            //     }
            // }

            // Commit transaksi jika semua berhasil
            DB::commit();

            return redirect()->back()->with('success', 'Purchase berhasil disetujui dan pesanan telah dibuat.');
        } catch (\Exception $e) {
            // Rollback jika terjadi error
            DB::rollBack();

            return redirect()->back()->with('error', 'Gagal menyetujui purchase: ' . $e->getMessage());
        }
    }

    public function reject(Purchase $purchase)
    {
        // Tidak perlu transaksi jika hanya update 1 tabel
        $purchase->update(['status' => 'Rejected']);
        
        return redirect()->back()->with('success', 'Purchase berhasil ditolak.');
    }
}