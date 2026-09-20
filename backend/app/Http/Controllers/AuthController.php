<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(protected AuthService $authService) {}

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
            'recaptcha_token' => 'required|string',
        ]);

        try {
            $captcha = $this->authService->verifyRecaptcha(
                $validated['recaptcha_token'],
                $request->ip()
            );
        } catch (\Exception) {
            return response()->json([
                'success' => false,
                'message' => 'The CAPTCHA service is currently unavailable',
            ], 503);
        }

        if (!$captcha['valid']) {
            return response()->json([
                'success' => false,
                'message' => 'Captcha verification failed',
                'errors' => ['recaptcha_token' => ['Captcha verification failed']],
            ], 422);
        }

        $result = $this->authService->login($validated['email'], $validated['password']);

        if (!$result) {
            return response()->json([
                'success' => false,
                'message' => 'Incorrect email or password',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            ...$result,
        ]);
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request->attributes->get('auth_token_id'));

        return response()->json([
            'success' => true,
            'message' => 'Logout successful',
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->attributes->get('auth_user');

        return response()->json([
            'success' => true,
            'data' => [
                'employee_id' => $user['employee_id'],
                'name' => $user['name'],
                'email' => $user['email'],
            ],
        ]);
    }

    public function profile(Request $request)
    {
        $user = $request->attributes->get('auth_user');
        $profile = $this->authService->profile($user['employee_id']);

        if (!$profile) {
            return response()->json([
                'success' => false,
                'message' => 'Employee profile not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $profile,
        ]);
    }
}
