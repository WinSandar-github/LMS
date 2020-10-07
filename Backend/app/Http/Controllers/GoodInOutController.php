<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Auth\Authenticatable;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use DB;
use App\tbl_good_receipt;
use App\tbl_good_receipt_details;
use App\tbl_delivery;
use App\tbl_delivery_details;

class GoodInOutController extends Controller
{
  public function getGoodInOutByCompanyId(Request $request)
  {
        $goodinout =DB::table('tbl_delivery')
              ->join('tbl_delivery_details','tbl_delivery.id','tbl_delivery_details.delivery_id')
              ->join('tbl_good_receipt', 'tbl_delivery.company_id','=','tbl_good_receipt.company_id')
              ->join('tbl_good_receipt_details', 'tbl_delivery.company_id','=','tbl_good_receipt_details.company_id')
              ->join('tbl_city_lists', 'tbl_city_lists.id','=','tbl_good_receipt.city_id')
              ->where('tbl_delivery.company_id','=',$request->input("companyId"))
              ->where('tbl_delivery_details.company_id','=',$request->input("companyId"))
              ->where('tbl_good_receipt.company_id','=',$request->input("companyId"))
              ->where('tbl_good_receipt_details.company_id','=',$request->input("companyId"))
              ->where('tbl_city_lists.company_id','=',$request->input("companyId"))
              ->select('tbl_delivery.car_no','tbl_city_lists.city_name','tbl_delivery_details.quantity','tbl_delivery_details.out_date','tbl_good_receipt.*','tbl_good_receipt_details.*')
              ->get();
          if(sizeof($goodinout)){
            return response()->json($goodinout,200, config('common.header'),JSON_UNESCAPED_UNICODE);
          }
          else{
              return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
          }

  }
}
 ?>
