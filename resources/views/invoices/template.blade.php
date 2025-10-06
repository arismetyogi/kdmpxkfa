<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Invoice #{{ $invoice->invoice_number }}</title>
    <style>
        h1, h2, h3 {
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            margin: 30px;
        }

        /* ===== HEADER ===== */
        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .header h1 {
            font-size: 24px;
            font-weight: bold;
        }

        .header p {
            font-size: 12px;
            line-height: 1.4;
        }

        /* ===== SECTION TITLE ===== */
        .section-title {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 6px;
            margin-top: 20px;
        }

        /* ===== TABLES ===== */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        table, th, td {
            border: 1px solid #888;
        }

        th, td {
            padding: 6px 8px;
            vertical-align: top;
        }

        th {
            background: #f2f2f2;
            text-align: left;
        }

        .text-right {
            text-align: right;
        }

        .text-center {
            text-align: center;
        }

        /* ===== INFO SECTION ===== */
        .info-table td {
            border: none;
            padding: 3px 5px;
        }

        .info-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 40px;
            margin-bottom: 20px;
        }

        .column {
            width: 48%;
        }

        /* ===== TOTALS TABLE (Pojok Kanan) ===== */
        .totals {
            width: 45%; /* Lebar tabel total */
            margin-left: auto; /* Mendorong tabel ke kanan */
            margin-right: 0;
            margin-top: 10px; /* Jarak dari tabel produk di atasnya */
            border-collapse: collapse;
            text-align: left;
        }

        .totals td {
            border: none;
            padding: 4px 8px;
        }

        .totals .label {
            text-align: left;
            font-weight: bold;
        }

        .totals .value {
            text-align: right;
        }
        
        /* ===== TERBILANG ===== */
        .terbilang-section {
            margin-top: 20px;
            font-size: 12px;
            line-height: 1.5;
        }


        /* ===== SIGNATURES ===== */
        .signature-container {
            margin-top: 40px; /* Jarak dari elemen di atasnya */
            display: flex;
            justify-content: space-between;
            text-align: center;
        }

        .signature {
            width: 48%;
        }

        .signature p {
            margin-bottom: 60px; /* ruang untuk tanda tangan */
        }

        .signature-name {
            font-weight: bold;
            text-decoration: underline;
        }

        .signature-role {
            font-style: italic;
            font-size: 12px;
        }

        /* ===== UTILITY ===== */
        .clear {
            clear: both;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>PT. Kimia Farma Apotek</h1>
        <p>Jl. Budi Utomo No.1 Jakarta Pusat - Indonesia<br>
        Telepon: (021) 3857-245 | Email: sekretariat@kimiafarmaapotek.co.id</p>
    </div>

    <h2>Invoice #{{ $invoice->invoice_number }}</h2>
    <p><strong>Tanggal Invoice:</strong> {{ \Carbon\Carbon::parse($invoice->invoice_date)->format('d/m/Y') }}</p>

    <div class="info-section">
        <div class="column">
            <div class="section-title">Informasi Pengirim</div>
            <table class="info-table">
                <tr>
                    <td><strong>Nama:</strong></td>
                    <td>{{ $invoice->order->user->name }}</td>
                </tr>
                <tr>
                    <td><strong>Email:</strong></td>
                    <td>{{ $invoice->order->user->email }}</td>
                </tr>
                <tr>
                    <td><strong>Apotek:</strong></td>
                    <td>{{ $invoice->order->user->apotek->name ?? '-' }}</td>
                </tr>
            </table>
        </div>

        <div class="column">
            <div class="section-title">Informasi Order</div>
            <table class="info-table">
                <tr>
                    <td><strong>No. Transaksi:</strong></td>
                    <td>{{ $invoice->order->transaction_number }}</td>
                </tr>
                <tr>
                    <td><strong>Tanggal Order:</strong></td>
                    <td>{{ \Carbon\Carbon::parse($invoice->order->created_at)->format('d/m/Y H:i') }}</td>
                </tr>
                <tr>
                    <td><strong>Status:</strong></td>
                    <td>{{ ucfirst($invoice->order->status) }}</td>
                </tr>
            </table>
        </div>
    </div>

    <div class="section-title">Informasi Pengiriman</div>
    <table class="info-table" style="width: 100%;">
        <tr>
            <td><strong>Penerima:</strong></td>
            <td>{{ $invoice->order->shipping_name ?? $invoice->order->billing_name }}</td>
            <td><strong>Alamat:</strong></td>
            <td>{{ $invoice->order->shipping_address ?? $invoice->order->billing_address }}</td>
        </tr>
        <tr>
            <td><strong>Kota:</strong></td>
            <td>{{ $invoice->order->shipping_city ?? $invoice->order->billing_city }}</td>
            <td><strong>Provinsi / Kode Pos:</strong></td>
            <td>{{ $invoice->order->shipping_state ?? $invoice->order->billing_state }},
                {{ $invoice->order->shipping_zip ?? $invoice->order->billing_zip }}</td>
        </tr>
    </table>

    <div class="section-title">Daftar Produk</div>
    <table>
        <thead>
            <tr>
                <th>Produk</th>
                <th class="text-center">Qty Dikirim</th>
                <th class="text-right">Harga Satuan</th>
                <th class="text-right">Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->order->orderItems as $item)
                @php
                    $qty = $item->qty_delivered ?? $item->quantity;
                    $subtotalItem = $item->unit_price * $item->content * $qty;
                @endphp
                <tr>
                    <td>{{ $item->product_name }}</td>
                    <td class="text-center">{{ $qty }} {{ $item->product->order_unit }}</td>
                    <td class="text-right">Rp {{ number_format($item->unit_price * $item->content, 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($subtotalItem, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    @php
        use App\Helpers\TerbilangHelper;
        $subtotal = $invoice->order->orderItems->sum(fn($i) => $i->unit_price * $i->content * ($i->qty_delivered ?? $i->quantity));
        $tax = round($subtotal * 0.11);
        $total = $subtotal + $tax;
        $terbilang = ucwords(TerbilangHelper::terbilang($total)) . ' Rupiah';
    @endphp

    <div class="terbilang-section">
        <strong>Terbilang:</strong> <em>*{{ $terbilang }}*</em>
    </div>

    <table class="totals">
        <tr>
            <td class="label">Subtotal:</td>
            <td class="value">Rp {{ number_format($subtotal, 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td class="label">Pajak (11%):</td>
            <td class="value">Rp {{ number_format($tax, 0, ',', '.') }}</td>
        </tr>
        <tr>
            <td class="label">Total:</td>
            <td class="value"><strong>Rp {{ number_format($total, 0, ',', '.') }}</strong></td>
        </tr>
    </table>

    <div class="clear"></div>
    
    

    <!-- Tanda tangan -->
    <div class="signature-container">
        <div class="signature">
            <p>Dibuat oleh,</p>
            <div class="signature-name">{{ $invoice->created_by ?? '____________________' }}</div>
            <div class="signature-role">Apoteker</div>
        </div>
        
    </div>

</body>
</html>