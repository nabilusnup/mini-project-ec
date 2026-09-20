<?php

namespace App\Http\Middleware;

use App\Services\ElasticsearchService;
use Closure;
use Elastic\Elasticsearch\Exception\ClientResponseException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateElasticsearchToken
{
    public function __construct(
        protected ElasticsearchService $elasticsearch
    ) {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $tokenId = hash('sha256', $token);

        try {
            $response = $this->elasticsearch->client()->get([
                'index' => 'auth_tokens',
                'id' => $tokenId,
            ])->asArray();
        } catch (ClientResponseException $exception) {
            if ($exception->getCode() === 404) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }

            throw $exception;
        }

        if (now()->greaterThanOrEqualTo($response['_source']['expires_at'])) {
            $this->elasticsearch->client()->delete([
                'index' => 'auth_tokens',
                'id' => $tokenId,
            ]);

            return response()->json(['message' => 'Your login session has expired.'], 401);
        }

        $request->attributes->set('auth_user', $response['_source']);
        $request->attributes->set('auth_token_id', $tokenId);

        return $next($request);
    }
}
