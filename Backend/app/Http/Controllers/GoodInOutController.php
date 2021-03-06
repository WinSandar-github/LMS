<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Auth\Authenticatable;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\tbl_good_receipt;
use App\tbl_good_receipt_details;
use App\tbl_delivery;
use App\tbl_delivery_details;

class GoodInOutController extends Controller
{
  public function getGoodInOutByCompanyId(Request $request)
  {
      $start_date=date("Y-m-d", strtotime($request->input("start_date")));
      $end_date=date("Y-m-d", strtotime($request->input("end_date")));
      if($start_date==$end_date){
        $goodinout =tbl_delivery_details::with(['delivery','goodReceiptBydetail'])
                                          ->where('company_id','=',$request->input("company_id"))
                                          ->get();
      }
      else{
        $goodinout =tbl_delivery_details::with(['delivery','goodReceiptBydetail'])
                                          ->where('company_id','=',$request->input("company_id"))
                                          ->whereBetween('out_date',[$start_date, $end_date])
                                          ->get();
      }
      if(sizeof($goodinout)){
           return response()->json($goodinout, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
      }
      else{
           return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
      }
  }
}
 ?>
