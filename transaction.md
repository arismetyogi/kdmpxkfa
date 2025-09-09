# Input Transaction

1. Deskripsi: Endpoint ini digunakan untuk penginputan transaksi yang dilakukan diluar
   platform Digikoperasi tujuannya api akan otomatis memproses setiap item
   produk dan memperbarui stok jika produk sudah ada, atau membuat produk
   baru jika belum terdaftar.
2. Notes:

_______________________

| Merchant ID | Merchant    |
|-------------|-------------|
| MCH-KF-007  | Kimia Farma |

_________________________

3. Request Method: POST
4. API Endpoint: api/v2/koperasi/transactions
5. Authorization: Bearer Token
6. Request Body:

| Key                              | Type      | M/O | Description                                                                                               | Example Value                    |   
|----------------------------------|-----------|-----|-----------------------------------------------------------------------------------------------------------|----------------------------------|
| id_transaksi                     | string    | M   | ID Transaksi                                                                                              | TRX-123123123-030                |
| id_koperasi                      | string    | M   | Nomor Induk Koperasi                                                                                      | 686b8574cee4f1ce8f4dc909         | 
| status                           | string    | M   | Status Transaksi                                                                                          | diproses                         |
| merchant_id                      | string    | M   | ID Merchant                                                                                               | MCH-KF-007                       |
| merchant_name                    | string    | M   | Nama Merchant                                                                                             | Kimia Farma                      |
| total_nominal                    | float     | M   | Total Nominal Transaksi                                                                                   | 1500000                          |
| is_for_sale                      | boolean   | O   | Penanda apakah produk dijual kembali di Digikops atau tidak                                               | true/false                       |
| source_of_fund                   | string    | M   | Pinjaman : Sumber dana dari Plafon Belanja Operasional, Pribadi : Sumber dana dari Rekening Pribadi KDKMP | 1. pinjaman, 2. pribadi          |
| account_no                       | string    | O   | KDKMP-Nomor Rekening Bank Belanja Operasional                                                             | 1234567890                       |
| account_bank                     | string    | O   | KDKMP - Nama Rekening Bank                                                                                | Bank Mandiri                     |
| payment_type                     | string    | M   | Merchant - Tipe Pembayaran. cad (cash after delivery)                                                     | cad                              |
| payment_method                   | string    | M   | Merchant - Nama Bank untuk pembayaran                                                                     | BRI, Mandiri, BTN, BSI, BNI, BCA |
| va_number                        | string    | M   | Merchant - Nomor Virtual Account/Nomor Rekening Tujuan                                                    | 880010012345678                  |
| timestamp                        | timestamp | M   | Waktu transaksi dibuat                                                                                    | 2024-08-01T15:30:00Z             |
| product_detail[].nama_produk     | string    | M   | Nama Produk                                                                                               | Beras Premium 5kg                |
| product_detail[].sku             | string    | M   | SKU Produk                                                                                                | 8991045101246                    |
| product_detail[].kategori        | string    | M   | Kategori Produk                                                                                           | Sembako                          |
| product_detail[].quantity        | integer   | M   | Quantity Produk                                                                                           | 2                                |
| product_detail[].harga_per_unit  | integer   | M   | Harga Per Unit                                                                                            | 70000                            |
| product_detail[].satuan          | string    | O   | Satuan Produk(pcs)                                                                                        | PCS                              |
| product_detail[].berat           | integer   | O   | Berat Produk(Gram)                                                                                        | 10                               |
| product_detail[].dimensi.panjang | integer   | O   | Panjang Produk (cm)                                                                                       | 2                                |
| product_detail[].dimensi.lebar   | integer   | O   | Lebar Produk(cm)                                                                                          | 4                                |
| product_detail[].dimensi.tinggi  | integer   | O   | Tinggi Produk(cm)                                                                                         | 6                                |
| product_detail[].total           | integer   | M   | Total Harga                                                                                               | 140000                           |

Notes:
   M = Mandatory
   O = Optional
