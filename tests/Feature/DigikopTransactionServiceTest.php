<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Services\DigikopAuthService;
use App\Services\DigikopTransactionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class DigikopTransactionServiceTest extends TestCase
{
    use RefreshDatabase;

    protected DigikopTransactionService $transactionService;
    protected DigikopAuthService $authService;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a partial mock of the auth service
        $this->authService = $this->getMockBuilder(DigikopAuthService::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['getAccessToken', 'refreshToken'])
            ->getMock();
            
        $this->authService->method('getAccessToken')->willReturn('test-token');
        // refreshToken returns void, so we don't set a return value

        $this->transactionService = new DigikopTransactionService($this->authService);
    }

    /** @test */
    public function it_validates_credit_limit_successfully()
    {
        // Mock the HTTP response for credit limit validation
        Http::fake([
            '*/remaining-credit/*' => Http::response([
                'data' => [
                    'remaining_credit' => 1000.00
                ]
            ], 200),
        ]);

        $result = $this->transactionService->validateCreditLimit('tenant-123', 500.00);

        $this->assertTrue($result['valid']);
        $this->assertEquals(1000.00, $result['remaining_credit']);
        $this->assertEquals('Credit limit validation successful.', $result['message']);
    }

    /** @test */
    public function it_fails_validation_when_insufficient_credit()
    {
        // Mock the HTTP response for credit limit validation
        Http::fake([
            '*/remaining-credit/*' => Http::response([
                'data' => [
                    'remaining_credit' => 300.00
                ]
            ], 200),
        ]);

        $result = $this->transactionService->validateCreditLimit('tenant-123', 500.00);

        $this->assertFalse($result['valid']);
        $this->assertEquals(300.00, $result['remaining_credit']);
        $this->assertStringContainsString('Insufficient credit limit', $result['message']);
    }

    /** @test */
    public function it_sends_transaction_after_credit_validation()
    {
        // Mock the HTTP responses
        Http::fake([
            // Credit limit validation
            '*/remaining-credit/*' => Http::response([
                'data' => [
                    'remaining_credit' => 1000.00
                ]
            ], 200),
            // Transaction sending
            '*/transactions' => Http::sequence()
                ->push([
                    'status' => 'success',
                    'data' => ['transaction_id' => 'txn-123']
                ], 200)
                ->push([
                    'status' => 'success',
                    'message' => 'Transaction updated'
                ], 200)
        ]);

        $transactionData = [
            'id_transaksi' => 'txn-123',
            'tenant_id' => 'tenant-123',
            'total_amount' => 500.00,
            'items' => []
        ];

        $result = $this->transactionService->sendTransaction($transactionData);

        $this->assertTrue($result['success']);
        $this->assertEquals('Transaction sent successfully.', $result['message']);
        
        // Assert that both HTTP calls were made
        Http::assertSentCount(3); // 1 for credit validation, 2 for transaction (send and update)
    }

    /** @test */
    public function it_does_not_send_transaction_when_credit_validation_fails()
    {
        // Mock the HTTP responses
        Http::fake([
            // Credit limit validation - insufficient credit
            '*/remaining-credit/*' => Http::response([
                'data' => [
                    'remaining_credit' => 300.00
                ]
            ], 200),
            // Transaction sending - should not be called
            '*/transactions' => Http::response([], 200),
        ]);

        $transactionData = [
            'id_transaksi' => 'txn-123',
            'tenant_id' => 'tenant-123',
            'total_amount' => 500.00,
            'items' => []
        ];

        $result = $this->transactionService->sendTransaction($transactionData);

        $this->assertFalse($result['success']);
        $this->assertStringContainsString('Insufficient credit limit', $result['message']);
        
        // Assert that only one HTTP call was made (credit validation)
        Http::assertSentCount(1);
    }

    /** @test */
    public function it_fails_when_missing_required_data()
    {
        $transactionData = [
            'id_transaksi' => 'txn-123',
            // Missing tenant_id and total_amount
            'items' => []
        ];

        $result = $this->transactionService->sendTransaction($transactionData);

        $this->assertFalse($result['success']);
        $this->assertEquals('Missing required data for transaction processing.', $result['message']);
    }
}