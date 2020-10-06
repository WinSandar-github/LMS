<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Eloquent;

class tbl_good_receipt_details extends Eloquent
{
    protected $table = 'tbl_good_receipt_details';
    public function goodReceiptByDetail()
    {
       return $this->belongsTo('App\tbl_good_receipt','good_receipt_id');
    }
     public function goodReceipt()
    {
       return $this->belongsTo('App\tbl_good_receipt','id');
    }
    public function unitByDetail()
    {
       return $this->belongsTo('App\tbl_unit','unit');
    }
}
