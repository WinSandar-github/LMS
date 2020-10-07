<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Auth\Authenticatable;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
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
      $goodinout =tbl_delivery_details::with(['delivery','goodReceiptBydetails','goodReceiptDetailBydetails'])
                                        ->where('company_id','=',$request->input("companyId"))
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
