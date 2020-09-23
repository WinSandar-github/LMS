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
      'saveCompany',
      'loginValidate',
      'updateCompany',
      'saveDelivery',
      'getDelivery',
      'getDeliverDetailsByDeliveryId',
      'updateDeliveryByStatus',
      'getDeliveryByStatus',
      'getDeliveryById',
      'updateDelivery',
      'deleteDelivery',
      'saveDeliverDetail',
      'updateDeliverDetail',
      'deleteDeliverDetail',
      'createCity',
      'getCity',
      'getCityInfo',
      'updateCity',
      'deleteCity',
      'createUnit',
      'getUnit',
      'showUnitInfo',
      'updateUnit',
      'deleteUnit',
      'createGoodRecipt',
      'getGoodReceipt/*',
      'showGoodReceiptInfo',
      'updateGoodReceipt',
      'deleteGoodReceipt'

    ];
}
