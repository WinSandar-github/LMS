<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class tbl_city_list extends Model
{
     protected $table = 'tbl_city_list';
     public function cityGoodReceipt()
     {
         return $this->hasMany('App\tbl_good_receipt','id');
     }
}
