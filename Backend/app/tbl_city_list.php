<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Eloquent;

class tbl_city_list extends Eloquent
{
     protected $table = 'tbl_city_list';
      public function goodReceiptByDetail()
    {
        return $this->hasMany('App\tbl_good_receipt','id');
    }
}
