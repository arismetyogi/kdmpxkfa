<?php

namespace App\Http\Controllers;

use App\Services\DigikopTransactionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TransactionController extends Controller
{
    public function __construct(private readonly DigikopTransactionService $transactionService) {}

    /**
     * Fetch user's credit limit
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function creditLimit(Request $request)
    {
        // Check if user is authenticated
        if (! Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated',
            ], 401);
        }

        $user = Auth::user();

        // Check if user has tenant_id (SSO users)
        if (! $user->tenant_id) {
            return response()->json([
                'success' => false,
                'message' => 'User is not an SSO user',
            ], 400);
        }

        try {
            $result = $this->transactionService->validateCreditLimit($user->tenant_id, 0);

            if ($result['valid']) {
                return response()->json([
                    'success' => true,
                    'remaining_credit' => $result['remaining_credit'],
                    'formatted_credit' => 'Rp'.number_format($result['remaining_credit'], 0, ',', '.'),
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => $result['message'],
                ], 400);
            }
        } catch (\Exception $e) {
            Log::error('Credit limit fetch error', [
                'exception' => $e->getMessage(),
                'user_id' => $user->id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching credit limit',
            ], 500);
        }
    }
}
