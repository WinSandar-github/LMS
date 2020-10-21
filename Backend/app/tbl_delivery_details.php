<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class tbl_delivery_details extends Model
{
  protected $table = 'tbl_delivery_details';
  public function delivery()
  {
      return $this->belongsTo('App\tbl_delivery','delivery_id');
  }
  public function goodReceiptBydetail()
  {
      return $this->belongsTo('App\tbl_good_receipt','good_receipt_id');
  }
  public function goodReceiptDetailBydetail()
  {
      return $this->belongsTo('App\tbl_good_receipt_details','good_receipt_detail_id');
  }

}
