<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class tbl_order extends Model
{
  protected $table = 'tbl_order';
  public function orderGoodReceipt()
  {
      return $this->belongsTo('App\tbl_good_receipt','order_id');
  }

}
