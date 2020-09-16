<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        'saveTblCompany',
        'loginValidate',
        'save_tbl_city',
        'get_tbl_city',
        'get_tbl_city_by_id',
        'update_tbl_city',
        'delete_tbl_city'
    ];
}
