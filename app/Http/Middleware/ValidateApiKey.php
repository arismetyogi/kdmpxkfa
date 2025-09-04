<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateApiKey
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $apiKey = $request->header('X-API-Key');

        if (! $apiKey) {
            return response()->json([
                'success' => false,
                'message' => 'API key required',
            ], 401);
        }

        // Validate API key against allowed origins
        $allowedKeys = collect(config('sso.allowed_origins'))->pluck('api_key');

        if (! $allowedKeys->contains($apiKey)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid API key',
            ], 401);
        }

        return $next($request);
    }
}
