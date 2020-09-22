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
  protected $header = array ('Content-Type' => 'application/json; charset=UTF-8','charset' => 'utf-8');
  protected $successMessage=array('message'=>'success.');
  protected $errorMessage=array('message'=>'there is error occur.');
  protected $dataMessage=array('message'=>'there is no data.');
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
      return response()->json($this->successMessage, 200, $this->header, JSON_UNESCAPED_UNICODE);
      }catch (\Exception $e){
       return response()->json($this->errorMessage, 500, $this->header, JSON_UNESCAPED_UNICODE);
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
                ->select('users.full_name', 'tbl_delivery.*','tbl_company.name')
                ->get();
        if(sizeof($delivery)){
            return response()->json($delivery, 200, $this->header, JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json($this->dataMessage, 404, $this->header, JSON_UNESCAPED_UNICODE);
        }
    }catch (\Exception $e) {
        return response()->json($this->errorMessage, 500, $this->header, JSON_UNESCAPED_UNICODE);
    }

  }
  public function saveDeliverDetail(Request $request)
  {
    try{

      $delivery_details=new tbl_delivery_details();
      $delivery_details->receiver_name=$request->input("receiverName");
      $delivery_details->product_name=$request->input("productName");
      $delivery_details->total_quantity=$request->input("totalQuantity");
      $delivery_details->quantity=$request->input("quantity");
      $delivery_details->weight=$request->input("weight");
      $delivery_details->to_city_name=$request->input("toCityName");
      $delivery_details->remark=$request->input("remark");
      $delivery_details->user_id=$request->input("userId");
      $delivery_details->company_id=$request->input("companyId");
      $delivery_details->delivery_id=$request->input("deliveryId");
      $delivery_details->good_receipt_id=$request->input("goodReceiptId");
      $delivery_details->good_receipt_detail_id=$request->input("goodReceiptDetailId");
      $delivery_details->order_details_id=$request->input("orderDetailsId");
      $delivery_details->save();
      return response()->json($this->successMessage, 200, $this->header, JSON_UNESCAPED_UNICODE);
      }catch (\Exception $e){
       return response()->json($this->errorMessage, 500, $this->header, JSON_UNESCAPED_UNICODE);
     }

  }
  public function getDeliverDetailsByDeliveryId(Request $request)
  {
    try{
      $delivery_details =tbl_delivery_details::where('delivery_id','=',$request->input('deliveryId'))
                        ->get();
        if(sizeof($delivery_details)){
            return response()->json($delivery_details, 200, $this->header, JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json($this->dataMessage, 404, $this->header, JSON_UNESCAPED_UNICODE);
        }
    }catch (\Exception $e) {
        return response()->json($this->errorMessage, 500, $this->header, JSON_UNESCAPED_UNICODE);
    }

  }
}
 ?>
