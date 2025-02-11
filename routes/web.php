<?php

use App\Http\Controllers\Auth\WebAuthController;
use App\Http\Controllers\Web\BookController;
use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');

require __DIR__ . '/auth.php';
