<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class tbl_good_receipt_details extends Model
{
  protected $table = 'tbl_good_receipt_details';
  public function goodreceiptDetailsBygoodReceipt()
  {
      return $this->belongsTo('App\tbl_good_receipt','good_receipt_id');
  }

}
