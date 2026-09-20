<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\TerbilangController;
use App\Http\Controllers\StarController;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth.es')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/profile', [AuthController::class, 'profile']);

    Route::prefix('employees')->group(function () {
        Route::get('/', [EmployeeController::class, 'index']);
        Route::post('/', [EmployeeController::class, 'store']);
        Route::get('/{employeeId}', [EmployeeController::class, 'show']);
        Route::put('/{employeeId}', [EmployeeController::class, 'update']);
        Route::delete('/{employeeId}', [EmployeeController::class, 'destroy']);
    });

    Route::prefix('terbilang')->group(function () {
        Route::get('/', [TerbilangController::class, 'index']);
        Route::post('/', [TerbilangController::class, 'store']);
        Route::delete('/{id}', [TerbilangController::class, 'destroy']);
    });

    Route::prefix('stars')->group(function () {
        Route::get('/', [StarController::class, 'index']);
        Route::post('/', [StarController::class, 'store']);
        Route::delete('/{id}', [StarController::class, 'destroy']);
    });
});
