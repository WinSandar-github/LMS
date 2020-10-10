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
use App\tbl_good_receipt;
use App\tbl_company;
use App\tbl_order;
use App\tbl_order_details;
use App\tbl_good_receipt_details;
use App\tbl_unit;
class DeliveryController extends Controller
{
  public function saveDelivery(Request $request)
  {
    try{
        $delivery=new tbl_delivery();
        $delivery->car_no=$request->input("car_number");
        $delivery->driver_name=$request->input("driver_name");
        $delivery->driver_phone=$request->input("driver_phone");
        $delivery->depart_from=$request->input("from_city_name");
        $delivery->depart_to=$request->input("to_city_name");
        $delivery->start_dt=$request->input("started_date");
        $delivery->end_dt=$request->input("arrived_date");
        $delivery->arrived=$request->input("different_arrived");
        $delivery->remark=$request->input("remark");
        $delivery->company_id=$request->input("company_id");
        $delivery->status=$request->input("status");
        $delivery->user_id=$request->input("user_id");
        $delivery->save();
        return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
      }catch (\Exception $e){
        return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
     }
   }
  public function saveDeliverDetail(Request $request)
  {
    try{
      $data = json_decode($request->getContent(), true);
      for($i=0;$i<count($data);$i++)
        {
          $deliver_details=new tbl_delivery_details();
          $deliver_details->receiver_name=$data[$i]["receiver_name"];
          $deliver_details->product_name=$data[$i]["product_name"];
          $deliver_details->total_quantity=$data[$i]["total_quantity"];
          $deliver_details->quantity=$data[$i]["quantity"];
          $deliver_details->weight=$data[$i]["weight"];
          $deliver_details->to_city_name=$data[$i]["to_city_name"];
          $deliver_details->remark=$data[$i]["remark"];
          $deliver_details->out_date=date("Y-m-d");
          $deliver_details->user_id=$data[$i]["user_id"];
          $deliver_details->company_id=$data[$i]["company_id"];
          $deliver_details->delivery_id=$data[$i]["delivery_id"];
          $deliver_details->good_receipt_id=$data[$i]["good_receipt_id"];
          $deliver_details->good_receipt_detail_id=$data[$i]["good_receipt_detail_id"];
          $deliver_details->save();
        }
        return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
      }catch (\Exception $e){
        return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
     }
  }
  public function getDeliverDetailsByDeliveryId(Request $request)
  {
    $deliver_details =tbl_delivery_details::where('delivery_id','=',$request->input('delivery_id'))
                                          ->get();
    if(sizeof($deliver_details)){
        return response()->json($deliver_details, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
    }
    else{
        return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
    }
  }

  public function getDeliveryByStatus(Request $request,$status)
  {
    $delivery = tbl_delivery::with(['users','companyDelivery'])
                            ->where('company_id','=',$request->input("company_id"))
                            ->where('status','=',$status)
                            ->get();
    if(sizeof($delivery)){
        return response()->json($delivery, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
    }
    else{
      return response()->json(config('common.message.data'),404,config('common.header'),JSON_UNESCAPED_UNICODE);
      }
  }
  public function getDeliveryById(Request $request)
  {
    $delivery = tbl_delivery::find($request->input("delivery_id"));
    if(empty($delivery)){
       return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
    }
    else{
      return response()->json($delivery, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
    }
  }
  public function updateDelivery(Request $request)
  {
    try{
        $delivery = tbl_delivery::find($request->input("delivery_id"));
        $delivery->car_no=$request->input("car_number");
        $delivery->driver_name=$request->input("driver_name");
        $delivery->driver_phone=$request->input("driver_phone");
        $delivery->depart_from=$request->input("from_city_name");
        $delivery->depart_to=$request->input("to_city_name");
        $delivery->start_dt=$request->input("started_date");
        $delivery->end_dt=$request->input("arrived_date");
        $delivery->arrived=$request->input("different_arrived");
        $delivery->remark=$request->input("remark");
        $delivery->status=$request->input("status");
        $delivery->save();
        return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
    }catch (\Exception $e) {
        return response()->json(config('common.message.error'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
    }
  }
  public function getCompanyInfoBydeliveryId(Request $request)
  {
    $infodetails =tbl_delivery::with(['companyDelivery','deliveryDetails'])
                              ->where('id','=',$request->input("delivery_id"))
                              ->get();
   if(sizeof($infodetails)){
      return response()->json($infodetails,200, config('common.header'),JSON_UNESCAPED_UNICODE);
    }
    else{
      return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
    }

  }
  public function getInvoiceDetailsBydeliveryId(Request $request)
  {
    $invoicedetails =tbl_good_receipt::with(['cityList','orderByGoodReceipt'])
                                      ->where('tbl_good_receipt.id','=',$request->input('good_receipt_id'))
                                      ->get();

    if(sizeof($invoicedetails)){
      return response()->json($invoicedetails,200, config('common.header'),JSON_UNESCAPED_UNICODE);
    }
    else{
      return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
    }

  }
  public function getOrderNoBycompanyId(Request $request)
  {
    $order=tbl_order::where('company_id','=',$request->input("company_id"))
                    ->where('delivery_status','=','0')
                    ->get();
    if(sizeof($order)){
        return response()->json($order,200, config('common.header'),JSON_UNESCAPED_UNICODE);
      }
    else{
        return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
      }
  }
  public function getGoodReceiptByorderNo(Request $request)
  {
    $goodReceipt=tbl_good_receipt::with(['goodReceiptDetailByGoodReceipt','cityList','orderByGoodReceipt'])
                                  ->where('tbl_good_receipt.order_no','=',$request->input("order_no"))
                                  ->get();
    if(sizeof($goodReceipt)){
        return response()->json($goodReceipt,200, config('common.header'),JSON_UNESCAPED_UNICODE);
      }
    else{
        return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
      }
  }
  public function updateOrderStatusByorderId(Request $request)
  {
    try{
        $order= tbl_order::find($request->input("order_id"));
        $order->delivery_status=$request->input("delivery_status");
        $order->save();
        return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
    }catch (\Exception $e) {
        return response()->json(config('common.message.error'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
    }
  }
  public function getOrderDetailsByorderId(Request $request)
  {
    $order=tbl_order_details::with('unitByorderDetail')
                    ->where('order_id','=',$request->input("order_id"))
                    ->get();
    if(sizeof($order)){
        return response()->json($order,200, config('common.header'),JSON_UNESCAPED_UNICODE);
      }
    else{
        return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
      }
  }
  public function updateOrderByorderId(Request $request)
  {
    try{
        $data = json_decode($request->getContent(), true);
        $order=tbl_order::find($data[0]["order_id"]);
        $order->order_date=date("Y-m-d");
        $order->order_total=$data[0]["order_total"];
        $order->total=$data[0]["total"];
        $order->labour=$data[0]["labour"];
        $order->land=$data[0]["land"];
        $order->save();
        for($i=1;$i<count($data);$i++)
        {
          $orderdetail=tbl_order_details::find($data[$i]["orderdetail_id"]);
          $orderdetail->product_name=$data[$i]["product_name"];
          $orderdetail->quantity=$data[$i]["quantity"];
          $orderdetail->unit=$data[$i]["unit"];
          $orderdetail->product_price=$data[$i]["product_price"];
          $orderdetail->weight=$data[$i]["weight"];
          $orderdetail->total=$data[$i]["total"];
          $orderdetail->save();
        }
        return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
    }catch (\Exception $e) {
      return $e->getMessage();
        return response()->json(config('common.message.error'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
    }
  }
}
 ?>
