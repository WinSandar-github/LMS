<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Eloquent;

class tbl_unit extends Eloquent
{
     protected $table = 'tbl_unit';
      public function goodReceiptDetailByUnit()
    {
        return $this->hasMany('App\tbl_good_receipt_details');
    }
}
