<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class tbl_good_receipt extends Model
{
     protected $table = 'tbl_good_receipt';

     public function goodReceiptCity()
     {
         return $this->belongsTo('App\tbl_city_list','city_id');
     }
     public function goodReceiptOrder()
     {
         return $this->hasMany('App\tbl_order','id');
     }
}
