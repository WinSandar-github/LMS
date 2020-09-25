<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Auth\Authenticatable;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Arr;
use File;
use Hash;
use DateTime;
use Session;
use DB;
use App\tbl_delivery;
use App\tbl_delivery_details;
class DeliveryController extends Controller
{
  public function saveDelivery(Request $request)
  {
    try{
      $delivery=new tbl_delivery();
      $delivery->car_no=$request->input("carNumber");
      $delivery->driver_name=$request->input("driverName");
      $delivery->driver_phone=$request->input("driverPhone");
      $delivery->depart_from=$request->input("fromCityName");
      $delivery->depart_to=$request->input("toCityName");
      $delivery->start_dt=$request->input("startedDate");
      $delivery->end_dt=$request->input("arrivedDate");
      $delivery->arrived=$request->input("differentArrived");
      $delivery->remark=$request->input("remark");
      $delivery->company_id=$request->input("companyId");
      $delivery->status=$request->input("status");
      $delivery->user_id=$request->input("userId");
      $delivery->save();
      return response()->json(config('common.successMessage'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
      }catch (\Exception $e){
       return response()->json(config('common.errorMessage'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
     }
   }
  public function getDelivery(Request $request)
  {
    try{
    $delivery = DB::table('tbl_delivery')
              ->join('tbl_company','company_id','tbl_company.id')
              ->join('users', 'user_id', '=', 'users.id')
              ->where('users.company_id','=',$request->input("companyId"))
              ->where('tbl_company.id','=',$request->input("companyId"))
              ->where('tbl_delivery.company_id','=',$request->input("companyId"))
              ->where('tbl_delivery.status','=','0')
              ->select('users.full_name', 'tbl_delivery.*','tbl_company.name')
              ->get();
      if(sizeof($delivery)){
        return response()->json($delivery,200, config('common.header'),JSON_UNESCAPED_UNICODE);
      }
      else{
          return response()->json(config('common.dataMessage'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
      }
  }catch (\Exception $e) {
      return response()->json(config('common.errorMessage'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
  }
}
  public function saveDeliverDetail(Request $request)
  {
      try{
        $deliverDetails=new tbl_delivery_details();
        $deliverDetails->receiver_name=$request->input("receiverName");
        $deliverDetails->product_name=$request->input("productName");
        $deliverDetails->total_quantity=$request->input("totalQuantity");
        $deliverDetails->quantity=$request->input("quantity");
        $deliverDetails->weight=$request->input("weight");
        $deliverDetails->to_city_name=$request->input("toCityName");
        $deliverDetails->remark=$request->input("remark");
        $deliverDetails->user_id=$request->input("userId");
        $deliverDetails->company_id=$request->input("companyId");
        $deliverDetails->delivery_id=$request->input("deliveryId");
        $deliverDetails->good_receipt_id=$request->input("goodReceiptId");
        $deliverDetails->good_receipt_detail_id=$request->input("goodReceiptDetailId");
        $deliverDetails->order_details_id=$request->input("orderDetailsId");
        $deliverDetails->save();
        return response()->json(config('common.successMessage'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e){
         return response()->json(config('common.errorMessage'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
       }
  }
  public function getDeliverDetailsByDeliveryId(Request $request)
  {
      try{
        $deliverDetails =tbl_delivery_details::where('delivery_id','=',$request->input('deliveryId'))
                          ->get();
          if(sizeof($deliverDetails)){
              return response()->json($deliverDetails, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
          }
          else{
              return response()->json(config('common.dataMessage'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
          }
      }catch (\Exception $e) {
          return response()->json(config('common.errorMessage'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
      }
  }
  public function updateDeliveryByStatus(Request $request)
  {
    try{
        $delivery = tbl_delivery::find($request->input("deliveryId"));
        $delivery->status = $request->input("status");
        $delivery->save();
        return response()->json(config('common.successMessage'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
    }catch (\Exception $e) {
        return response()->json(config('common.errorMessage'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
    }
  }
  public function getDeliveryByStatus(Request $request)
  {
    try{
      $delivery = DB::table('tbl_delivery')
                ->join('tbl_company','company_id','tbl_company.id')
                ->join('users', 'user_id', '=', 'users.id')
                ->where('users.company_id','=',$request->input("companyId"))
                ->where('tbl_company.id','=',$request->input("companyId"))
                ->where('tbl_delivery.company_id','=',$request->input("companyId"))
                ->where('tbl_delivery.status','=','1')
                ->select('users.full_name', 'tbl_delivery.*','tbl_company.name')
                ->get();
        if(sizeof($delivery)){
            return response()->json($delivery, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.dataMessage'), 404,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }catch (\Exception $e) {
        return response()->json(config('common.errorMessage'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
    }
  }
  public function getDeliveryById(Request $request)
  {
    try{
        $delivery = tbl_delivery::find($request->input("deliveryId"));
        if(empty($delivery)){
           return response()->json(config('common.dataMessage'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
           return response()->json($delivery, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }catch (\Exception $e) {
        return response()->json(config('common.errorMessage'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
    }
  }
  public function updateDelivery(Request $request)
  {
    try{
        $delivery = tbl_delivery::find($request->input("deliveryId"));
        $delivery->car_no=$request->input("carNumber");
        $delivery->driver_name=$request->input("driverName");
        $delivery->driver_phone=$request->input("driverPhone");
        $delivery->depart_from=$request->input("fromCityName");
        $delivery->depart_to=$request->input("toCityName");
        $delivery->start_dt=$request->input("startedDate");
        $delivery->end_dt=$request->input("arrivedDate");
        $delivery->arrived=$request->input("differentArrived");
        $delivery->remark=$request->input("remark");
        $delivery->save();
        return response()->json(config('common.successMessage'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
    }catch (\Exception $e) {
        return response()->json(config('common.errorMessage'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
    }
  }
}
 ?>
