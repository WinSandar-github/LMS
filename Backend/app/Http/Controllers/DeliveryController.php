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
        return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
      }catch (\Exception $e){
        return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
     }
   }
  public function getDelivery(Request $request)
  {
    $delivery = tbl_delivery::with(['users','companyDelivery'])
                            ->where('company_id','=',$request->input("companyId"))
                            ->where('status','=','0')
                            ->get();
    if(sizeof($delivery)){
        return response()->json($delivery,200, config('common.header'),JSON_UNESCAPED_UNICODE);
    }
    else{
        return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
      }
  }
  public function saveDeliverDetail(Request $request)
  {
    try{
      $data = json_decode($request->getContent(), true);
      for($i=0;$i<count($data);$i++)
        {
          $deliverDetails=new tbl_delivery_details();
          $date=new DateTime();
          $deliverDetails->receiver_name=$data[$i]["receiverName"];
          $deliverDetails->product_name=$data[$i]["productName"];
          $deliverDetails->total_quantity=$data[$i]["totalQuantity"];
          $deliverDetails->quantity=$data[$i]["quantity"];
          $deliverDetails->weight=$data[$i]["weight"];
          $deliverDetails->to_city_name=$data[$i]["toCityName"];
          $deliverDetails->remark=$data[$i]["remark"];
          $deliverDetails->out_date=$date;
          $deliverDetails->user_id=$data[$i]["userId"];
          $deliverDetails->company_id=$data[$i]["companyId"];
          $deliverDetails->delivery_id=$data[$i]["deliveryId"];
          $deliverDetails->good_receipt_id=$data[$i]["goodReceiptId"];
          $deliverDetails->good_receipt_detail_id=$data[$i]["goodReceiptDetailId"];
          $deliverDetails->save();
        }
        return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
      }catch (\Exception $e){
        return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
     }
  }
  public function getDeliverDetailsByDeliveryId(Request $request)
  {
    $deliverDetails =tbl_delivery_details::where('delivery_id','=',$request->input('deliveryId'))
                                          ->get();
    if(sizeof($deliverDetails)){
        return response()->json($deliverDetails, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
    }
    else{
        return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
    }
  }

  public function getDeliveryByStatus(Request $request)
  {
    $delivery = tbl_delivery::with(['users','companyDelivery'])
                            ->where('company_id','=',$request->input("companyId"))
                            ->where('status','=','1')
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
    $delivery = tbl_delivery::find($request->input("deliveryId"));
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
                              ->where('id','=',$request->input("deliveryId"))
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
    $invoicedetails =tbl_good_receipt::with(['goodReceiptCity','goodReceiptOrder'])
                                      ->where('tbl_good_receipt.id','=',$request->input("goodReceiptId"))
                                      ->get();
    if(sizeof($invoicedetails)){
      return response()->json($invoicedetails,200, config('common.header'),JSON_UNESCAPED_UNICODE);
    }
    else{
      return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
    }
  }
  public function getInvoiceDetailsByorderId(Request $request)
  {
    $invoiceorder=tbl_order_details::where('order_id','=',$request->input("orderId"))
                                    ->get();
    if(sizeof($invoiceorder)){
      return response()->json($invoiceorder,200, config('common.header'),JSON_UNESCAPED_UNICODE);
    }
    else{
      return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
    }
  }
  public function getCompanyDetailBydeliveryId(Request $request)
  {
    $invoices =DB::table('tbl_delivery')
                  ->join('tbl_company','company_id','tbl_company.id')
                  ->join('tbl_delivery_details','tbl_delivery.id','tbl_delivery_details.delivery_id')
                  ->join('tbl_good_receipt', 'tbl_delivery_details.good_receipt_id','tbl_good_receipt.id')
                  ->join('tbl_city_lists', 'tbl_city_lists.id','=','tbl_good_receipt.city_id')
                  ->where('tbl_delivery.id','=',$request->input("deliveryId"))
                  ->where('tbl_delivery_details.delivery_id','=',$request->input("deliveryId"))
                  ->select('tbl_company.*','tbl_delivery.*','tbl_delivery_details.out_date','tbl_good_receipt.*','tbl_city_lists.city_name')
                  ->get();
    if(sizeof($invoices)){
      return response()->json($invoices,200, config('common.header'),JSON_UNESCAPED_UNICODE);
    }
    else{
      return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
    }
  }
  public function getInvoiceDetailsByorderNo(Request $request)
  {
    $invoices =DB::table('tbl_order')
                  ->join('tbl_order_details', 'tbl_order.id','=','tbl_order_details.order_id')
                  ->where('tbl_order.order_no','=',$request->input("orderNo"))
                  ->select('tbl_order.*','tbl_order_details.*')
                  ->get();
    if(sizeof($invoices)){
        return response()->json($invoices,200, config('common.header'),JSON_UNESCAPED_UNICODE);
      }
    else{
        return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
      }
  }
  public function getOrderNoBycompanyId(Request $request)
  {
    $order=tbl_order::where('company_id','=',$request->input("companyId"))
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
    $goodReceipt=tbl_good_receipt::with(['goodReceiptBygoodreceiptDetails','goodReceiptCity','goodReceiptOrder'])
                                  ->where('tbl_good_receipt.order_no','=',$request->input("orderNo"))
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
        $order= tbl_order::find($request->input("orderId"));
        $order->delivery_status=$request->input("deliveryStatus");
        $order->save();
        return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
    }catch (\Exception $e) {
        return response()->json(config('common.message.error'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
    }
  }
  public function getOrderDetailsByorderNo(Request $request)
  {
    $order=tbl_order_details::with('unitByorderDetail')
                    ->where('order_id','=',$request->input("orderId"))
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
        $order=tbl_order::find($data[0]["orderId"]);
        $order->order_date=date("Y-m-d");
        $order->order_total=$data[0]["orderTotal"];
        $order->total=$data[0]["total"];
        $order->labour=$data[0]["labour"];
        $order->land=$data[0]["land"];
        $order->save();
        for($i=1;$i<count($data);$i++)
        {
          $orderdetail=tbl_order_details::find($data[$i]["orderdetailId"]);
          $orderdetail->product_name=$data[$i]["productName"];
          $orderdetail->quantity=$data[$i]["quantity"];
          $orderdetail->unit=$data[$i]["unit"];
          $orderdetail->product_price=$data[$i]["productPrice"];
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
