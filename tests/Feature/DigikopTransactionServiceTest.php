<?php

use App\Services\DigikopAuthService;
use App\Services\DigikopTransactionService;
use Illuminate\Support\Facades\Http;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    // Create a partial mock of the auth service
    $this->authService = $this->getMockBuilder(DigikopAuthService::class)
        ->disableOriginalConstructor()
        ->onlyMethods(['getAccessToken', 'refreshToken'])
        ->getMock();

    $this->authService->method('getAccessToken')->willReturn('test-token');
    // refreshToken returns void, so we don't set a return value

    $this->transactionService = new DigikopTransactionService($this->authService);
});

test('it validates credit limit successfully', function () {
    // Mock the HTTP response for credit limit validation
    Http::fake([
        '*/remaining-credit/*' => Http::response([
            'data' => [
                'remaining_credit' => 1000.00,
            ],
        ], 200),
    ]);

    $result = $this->transactionService->validateCreditLimit('tenant-123', 500.00);

    expect($result['valid'])->toBeTrue();
    expect($result['remaining_credit'])->toBe(1000.00);
    expect($result['message'])->toBe('Credit limit validation successful.');
});

test('it fails validation when insufficient credit', function () {
    // Mock the HTTP response for credit limit validation
    Http::fake([
        '*/remaining-credit/*' => Http::response([
            'data' => [
                'remaining_credit' => 300.00,
            ],
        ], 200),
    ]);

    $result = $this->transactionService->validateCreditLimit('tenant-123', 500.00);

    expect($result['valid'])->toBeFalse();
    expect($result['remaining_credit'])->toBe(300.00);
    expect($result['message'])->toContain('Insufficient credit limit');
});

test('it sends transaction after credit validation', function () {
    // Mock the HTTP responses
    Http::fake([
        // Credit limit validation
        '*/remaining-credit/*' => Http::response([
            'data' => [
                'remaining_credit' => 1000.00,
            ],
        ], 200),
        // Transaction sending
        '*/transactions' => Http::sequence()
            ->push([
                'status' => 'success',
                'data' => ['transaction_id' => 'txn-123'],
            ], 200)
            ->push([
                'status' => 'success',
                'message' => 'Transaction updated',
            ], 200),
    ]);

    $transactionData = [
        'id_transaksi' => 'txn-123',
        'tenant_id' => 'tenant-123',
        'total_amount' => 500.00,
        'items' => [],
    ];

    $result = $this->transactionService->sendTransaction($transactionData);

    expect($result['success'])->toBeTrue();
    expect($result['message'])->toBe('Transaction sent successfully.');

    // Assert that both HTTP calls were made
    Http::assertSentCount(3); // 1 for credit validation, 2 for transaction (send and update)
});

test('it does not send transaction when credit validation fails', function () {
    // Mock the HTTP responses
    Http::fake([
        // Credit limit validation - insufficient credit
        '*/remaining-credit/*' => Http::response([
            'data' => [
                'remaining_credit' => 300.00,
            ],
        ], 200),
        // Transaction sending - should not be called
        '*/transactions' => Http::response([], 200),
    ]);

    $transactionData = [
        'id_transaksi' => 'txn-123',
        'tenant_id' => 'tenant-123',
        'total_amount' => 500.00,
        'items' => [],
    ];

    $result = $this->transactionService->sendTransaction($transactionData);

    expect($result['success'])->toBeFalse();
    expect($result['message'])->toContain('Insufficient credit limit');

    // Assert that only one HTTP call was made (credit validation)
    Http::assertSentCount(1);
});

test('it fails when missing required data', function () {
    $transactionData = [
        'id_transaksi' => 'txn-123',
        // Missing tenant_id and total_amount
        'items' => [],
    ];

    $result = $this->transactionService->sendTransaction($transactionData);

    expect($result['success'])->toBeFalse();
    expect($result['message'])->toBe('Missing required data for transaction processing.');
});
