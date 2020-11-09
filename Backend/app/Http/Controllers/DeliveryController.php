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
        $data=json_decode($request->getContent(), true);
        $delivery=new tbl_delivery();
        $delivery->car_no=$data["car_no"];
        $delivery->driver_name=$data["driver_name"];
        $delivery->driver_phone=$data["driver_phone"];
        $delivery->from_city_id=$data["from_city_id"];
        $delivery->to_city_id=$data["to_city_id"];
        $delivery->start_dt=$data["start_dt"];
        $delivery->end_dt=$data["end_dt"];
        $delivery->arrived=$data["arrived"];
        $delivery->remark=$data["remark"];
        $delivery->company_id=$data["company_id"];
        $delivery->status=$data["status"];
        $delivery->user_id=$data["user_id"];
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
          if($data[$i]["order_status"]=='1' ||$data[$i]["order_status"]==' '){
            $deliverDetails=new tbl_delivery_details();
            $deliverDetails->receiver_name=$data[$i]["receiver_name"];
            $deliverDetails->product_name=$data[$i]["product_name"];
            $deliverDetails->total_quantity=$data[$i]["total_quantity"];
            $deliverDetails->quantity=$data[$i]["quantity"];
            $deliverDetails->weight=$data[$i]["weight"];
            $deliverDetails->to_city_name=$data[$i]["to_city_name"];
            $deliverDetails->remark=$data[$i]["remark"];
            $deliverDetails->out_date=date("Y-m-d");
            $deliverDetails->user_id=$data[$i]["user_id"];
            $deliverDetails->company_id=$data[$i]["company_id"];
            $deliverDetails->delivery_id=$data[$i]["delivery_id"];
            $deliverDetails->good_receipt_id=$data[$i]["good_receipt_id"];
            $deliverDetails->good_receipt_detail_id=$data[$i]["good_receipt_detail_id"];
            $deliverDetails->order_id=$data[$i]["order_id"];
            $deliverDetails->save();
          }else{
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
          }
        }
            return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
      }catch (\Exception $e){
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
     }
  }
  public function getDeliverDetailsByDeliveryId(Request $request)
  {
    $deliverDetails =tbl_delivery_details::where('delivery_id','=',$request->input('delivery_id'))
                                          ->get();
    if(sizeof($deliverDetails)){
        return response()->json($deliverDetails, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
    }
    else{
        return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
    }
  }

  public function getDeliveryByStatus(Request $request,$status)
  {
    $statusDelivery = tbl_delivery::with(['user','companyDelivery','fromCity','toCity'])
                            ->where('company_id','=',$request->input("company_id"))
                            ->where('status','=',$status)
                            ->get();
    if(sizeof($statusDelivery)){
        return response()->json($statusDelivery, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
    }
    else{
      return response()->json(config('common.message.data'),404,config('common.header'),JSON_UNESCAPED_UNICODE);
      }
  }
  public function getDeliveryById(Request $request)
  {
    if($request->input("id")){
      $delivery = tbl_delivery::find($request->input("id"));
      if(empty($delivery)){
         return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
      }
      else{
        return response()->json($delivery, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
      }
    }else{
      $delivery =tbl_delivery::with(['companyDelivery','deliveryDetails'])
                                ->where('id','=',$request->input("delivery_id"))
                                ->get();
     if(sizeof($delivery)){
        return response()->json($delivery,200, config('common.header'),JSON_UNESCAPED_UNICODE);
      }
      else{
        return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
      }
    }
  }
  public function updateDelivery(Request $request)
  {
    try{
        $delivery = tbl_delivery::find($request->input("delivery_id"));
        $delivery->car_no=$request->input("car_no");
        $delivery->driver_name=$request->input("driver_name");
        $delivery->driver_phone=$request->input("driver_phone");
        $delivery->from_city_id=$request->input("from_city_id");
        $delivery->to_city_id=$request->input("to_city_id");
        $delivery->start_dt=$request->input("start_dt");
        $delivery->end_dt=$request->input("end_dt");
        $delivery->arrived=$request->input("different_arrived");
        $delivery->remark=$request->input("remark");
        $delivery->status=$request->input("status");
        $delivery->save();
        return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
    }catch (\Exception $e) {
        return response()->json(config('common.message.error'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
    }
  }
  public function getOrderNoBycompanyId(Request $request)
  {
    $order=tbl_good_receipt::where('company_id','=',$request->input("company_id"))
                            ->where('good_receipt_delivery','!=','1')
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
    if($request->input("order_no")){
        $goodReceipt=tbl_good_receipt::with(['goodReceiptDetailByGoodReceipt','cityList','orderByGoodReceipts'])
                                      ->where('tbl_good_receipt.order_no','=',$request->input("order_no"))
                                      ->get();
        if(sizeof($goodReceipt)){
            return response()->json($goodReceipt,200, config('common.header'),JSON_UNESCAPED_UNICODE);
          }
        else{
            return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
          }
      }else {
        $goodReceipt =tbl_good_receipt::with(['cityList','orderByGoodReceipts'])
                                          ->where('tbl_good_receipt.id','=',$request->input('good_receipt_id'))
                                          ->get();
        if(sizeof($goodReceipt)){
          return response()->json($goodReceipt,200, config('common.header'),JSON_UNESCAPED_UNICODE);
        }
        else{
          return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
  }
  public function getOrderDetailsByorderId(Request $request)
  {
    $orderDetail=tbl_order_details::with('unitByorderDetail','orderByOrderdetails')
                    ->where('order_id','=',$request->input("order_id"))
                    ->get();
    if(sizeof($orderDetail)){
        return response()->json($orderDetail,200, config('common.header'),JSON_UNESCAPED_UNICODE);
      }
    else{
        return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
      }
  }
  public function updateOrderByorderId(Request $request)
  {
        try{
            $data = json_decode($request->getContent(), true);
            for($i=0;$i<count($data);$i++){
              if($data[$i]['remaine_qty']=='0'){
                $deliveryStatusOrder= tbl_order::find($data[$i]["order_id"]);
                $deliveryStatusOrder->delivery_status='1';
                $deliveryStatusOrder->save();
                $order_details=tbl_order_details::find($data[$i]["order_detail_id"]);
                $order_details->product_qty=$data[$i]["total_quantity"];
                $order_details->product_weight=$data[$i]["weight"];
                $order_details->save();
                $good_receipt=tbl_good_receipt::find($data[$i]["good_receipt_id"]);
                $good_receipt->good_receipt_delivery='1';
                $good_receipt->save();
              }else{
                $order_details=tbl_order_details::find($data[$i]["order_detail_id"]);
                $order_details->product_qty=$data[$i]["quantity"];
                $order_details->product_weight=$data[$i]["weight"];
                $order_details->save();
              }
            }
            return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
          }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
          }
    }
    public function updateOrderBygoodReceiptId(Request $request)
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
                $orderDetail=tbl_order_details::find($data[$i]["orderdetail_id"]);
                $orderDetail->product_name=$data[$i]["product_name"];
                $orderDetail->quantity=$data[$i]["quantity"];
                $orderDetail->unit=$data[$i]["unit"];
                $orderDetail->product_price=$data[$i]["product_price"];
                $orderDetail->weight=$data[$i]["weight"];
                $orderDetail->total=$data[$i]["total"];
                $orderDetail->save();
              }
              return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
          }catch (\Exception $e) {
              return response()->json(config('common.message.error'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
          }

    }
  }
 ?>
