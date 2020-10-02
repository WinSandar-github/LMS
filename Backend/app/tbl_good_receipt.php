<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Eloquent;

class tbl_good_receipt extends Eloquent
{
     protected $table = 'tbl_good_receipt';
     public function goodReceiptDetail()
    {
        return $this->hasMany('App\tbl_good_receipt_details','good_receipt_id');
    }
    public function users()
    {
        return $this->belongsTo('App\User','user_id');
    }
     public function cityList()
    {
        return $this->belongsTo('App\tbl_city_list','city_id');
    }
     public function goodReceiptCity()
     {
         return $this->belongsTo('App\tbl_city_list','city_id');
     }
     public function goodReceiptOrder()
     {
         return $this->hasMany('App\tbl_order','id');
     }
}
