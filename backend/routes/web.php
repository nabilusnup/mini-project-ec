<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'Mini Project API',
        'status' => 'ok',
    ]);
});
