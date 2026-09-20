<?php

namespace App\Services;

use Elastic\Elasticsearch\Exception\ClientResponseException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class AuthService
{
    public function __construct(protected ElasticsearchService $elasticsearch)
    {
    }

    public function verifyRecaptcha(string $token, ?string $ip): array
    {
        $request = Http::asForm()->timeout(10);
        if (app()->environment('local')) {
            $request = $request->withoutVerifying();
        }

        $response = $request->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => config('services.recaptcha.secret_key'),
            'response' => $token,
            'remoteip' => $ip,
        ]);

        return [
            'valid' => $response->successful() && (bool) $response->json('success'),
            'errors' => $response->json('error-codes', []),
        ];
    }

    public function login(string $email, string $password): ?array
    {
        $result = $this->elasticsearch->client()->search([
            'index' => 'employees',
            'body' => ['size' => 1, 'query' => ['term' => ['email' => $email]]],
        ])->asArray();

        $employee = $result['hits']['hits'][0]['_source'] ?? null;
        if (!$employee || !Hash::check($password, $employee['password'] ?? '')) {
            return null;
        }

        $token = Str::random(80);
        $expiresAt = now()->addDay();
        $user = [
            'employee_id' => $employee['employee_id'],
            'name' => $employee['name'],
            'email' => $employee['email'],
        ];

        $this->elasticsearch->client()->index([
            'index' => 'auth_tokens',
            'id' => hash('sha256', $token),
            'body' => [...$user, 'created_at' => now()->toIso8601String(), 'expires_at' => $expiresAt->toIso8601String()],
            'refresh' => 'wait_for',
        ]);

        return ['token' => $token, 'expires_at' => $expiresAt->toIso8601String(), 'user' => $user];
    }

    public function logout(string $tokenId): void
    {
        $this->elasticsearch->client()->delete([
            'index' => 'auth_tokens', 'id' => $tokenId, 'refresh' => 'wait_for',
        ]);
    }

    public function profile(string $employeeId): ?array
    {
        try {
            $employee = $this->elasticsearch->client()->get([
                'index' => 'employees',
                'id' => $employeeId,
            ])->asArray()['_source'];
        } catch (ClientResponseException $exception) {
            if ($exception->getCode() === 404) {
                return null;
            }

            throw $exception;
        }

        unset($employee['password']);

        return $employee;
    }
}
