<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Enums\OrderStatusEnum;
use App\Services\Admin\OrderService;
use App\Services\DigikopTransactionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;


class OrderController extends Controller
{
    protected $orderService;

    protected $digikopTransactionService;

    public function __construct(OrderService $orderService, DigikopTransactionService $digikopTransactionService)
    {
        $this->orderService = $orderService;
        $this->digikopTransactionService = $digikopTransactionService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        // Get orders based on user role
        $ordersQuery = Order::with(['user', 'user.apotek']);

        // If user is admin apotek, only show orders from users with the same apotek_id
        if ($user->hasRole('admin-apotek') && $user->apotek_id) {
            $ordersQuery->whereHas('user', function ($query) use ($user) {
                $query->where('apotek_id', $user->apotek_id);
            });
        }
        // Super admin can view all orders (no additional filtering needed)

        $orders = $ordersQuery->latest()->get();

        // Calculate statistics
        $totalOrders = $orders->count();
        $newOrders = $orders->where('status', 'new')->count();
        $deliveringOrders = $orders->where('status', 'delivering')->count();
        $completedOrders = $orders->where('status', 'received')->count();

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'totalOrders' => $totalOrders,
            'newOrders' => $newOrders,
            'deliveringOrders' => $deliveringOrders,
            'completedOrders' => $completedOrders,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::with(['user', 'user.apotek', 'orderItems.product.category'])->findOrFail($id);

        $user = Auth::user();

        // Check if user has permission to view this order
        if ($user->hasRole('admin apotek') && $user->apotek_id) {
            if ($order->user->apotek_id !== $user->apotek_id) {
                abort(403, 'Unauthorized access to this order.');
            }
        }

        return Inertia::render('admin/orders/show', [
            'order' => $order,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
   public function update(Request $request, string $id)
{
    $order = Order::with('orderItems')->findOrFail($id);

    // Validasi input
    $request->validate([
        'order_items' => 'required|array',
        'order_items.*.id' => 'required|exists:order_items,id',
        'order_items.*.qty_delivered' => 'required|integer|min:0',
    ]);

    // Update qty_delivered di masing-masing order item
    foreach ($request->order_items as $itemData) {
        $orderItem = $order->orderItems->where('id', $itemData['id'])->first();
        if ($orderItem) {
            $orderItem->qty_delivered = $itemData['qty_delivered'];
            $orderItem->save();
        }
    }

    // Update status pesanan jadi "delivering"
    $order->status = 'delivering';
    $order->shipped_at = now();
    $order->save();

    // Siapkan data transaksi utk Digikoperasi
    $transactionData = $this->prepareTransactionData($order);

    // Kirim ke Digikoperasi
    $response = $this->digikopTransactionService->sendTransaction($transactionData);

    if (! $response['success']) {
        \Log::error('Failed to send transaction to Digikoperasi', [
            'order_id' => $order->id,
            'error' => $response['message'],
        ]);
    }

    return redirect()->back()->with('success', 'Order updated successfully.');
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Prepare transaction data according to Digikoperasi API documentation
     */
    private function prepareTransactionData(Order $order): array
    {
        // Format product details - only include items with qty_delivered > 0
        $productDetails = [];
        foreach ($order->orderItems as $item) {
            // Only include items with qty_delivered > 0
            if (! isset($item->qty_delivered) || $item->qty_delivered <= 0) {
                continue;
            }

            // Get category name
            $categoryName = 'Obat';
            if ($item->product && $item->product->category) {
                $categoryName = $item->product->category->subcategory2 ? $item->product->category->subcategory1 : 'Obat';
            }

            $hargaSatuan = (int) $item->unit_price;
            $hargaSatuanPpn = (int) ($hargaSatuan * 1.11);
            $baseQtyDelivered = $item->qty_delivered * $item->content;

            $productDetails[] = [
                'nama_produk' => $item->product_name,
                'sku' => $item->product_sku ?? ($item->product ? $item->product->sku : ''),
                'kategori' => $categoryName,
                'quantity' => $baseQtyDelivered,
                'harga_per_unit' => $hargaSatuanPpn,
                'total' => (int) ($hargaSatuanPpn * $baseQtyDelivered),
                'satuan' => $item->product->base_uom ?? 'PCS',
                'berat' => $item->product->weight ?? 0,
                'dimensi' => [
                    'panjang' => $item->product->length ?? 0,
                    'lebar' => $item->product->width ?? 0,
                    'tinggi' => $item->product->height ?? 0,
                ],
            ];
        }

        // Calculate total nominal
        $totalNominal = array_sum(array_column($productDetails, 'total'));

        return [
            'id_transaksi' => $order->transaction_number,
            'id_koperasi' => $order->user->tenant_id ?? '', // Assuming tenant_id exists on User model
            'status' => OrderStatusEnum::PROCESS, // diproses untuk create transaksi, update status: dalam-pengiriman, diterima, dibatalkan, selesai
            'merchant_id' => 'MCH-KF-007', // From documentation
            'merchant_name' => 'Kimia Farma', // From documentation
            'total_nominal' => $totalNominal,
            'is_for_sale' => true, // Optional field
            'source_of_fund' => $order->source_of_fund ?? 'pinjaman',
            'account_no' => $order->account_no ?? '', // Optional field
            'account_bank' => $order->account_bank ?? '', // Optional field
            'payment_type' => $order->payment_type ?? 'cad',
            'payment_method' => 'Mandiri', // Default to Mandiri
            'va_number' => '00112233445566', // No Rek KFA
            'timestamp' => $order->shipped_at ? $order->shipped_at->toIso8601String() : now()->toIso8601String(), // Use shipped_at timestamp or current time
            'product_detail' => $productDetails,
        ];
    }
}
