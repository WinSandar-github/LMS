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
        return response()->json(config('common.successMessage'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
      }catch (\Exception $e){
        return response()->json(config('common.errorMessage'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
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
        return response()->json(config('common.dataMessage'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
      }
  }
  public function saveDeliverDetail(Request $request)
  {
      try{
          $deliverDetails=new tbl_delivery_details();
          $date=new DateTime();
          $deliverDetails->receiver_name=$request->input("receiverName");
          $deliverDetails->product_name=$request->input("productName");
          $deliverDetails->total_quantity=$request->input("totalQuantity");
          $deliverDetails->quantity=$request->input("quantity");
          $deliverDetails->weight=$request->input("weight");
          $deliverDetails->to_city_name=$request->input("toCityName");
          $deliverDetails->remark=$request->input("remark");
          $deliverDetails->out_date=$date;
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
    $deliverDetails =tbl_delivery_details::where('delivery_id','=',$request->input('deliveryId'))
                                          ->get();
    if(sizeof($deliverDetails)){
        return response()->json($deliverDetails, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
    }
    else{
        return response()->json(config('common.dataMessage'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
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
        return response()->json(config('common.dataMessage'), 404,config('common.header'), JSON_UNESCAPED_UNICODE);
    }
  }
  public function getDeliveryById(Request $request)
  {
    $delivery = tbl_delivery::find($request->input("deliveryId"));
    if(empty($delivery)){
       return response()->json(config('common.dataMessage'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
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
        return response()->json(config('common.successMessage'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
    }catch (\Exception $e) {
        return response()->json(config('common.errorMessage'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
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
      return response()->json(config('common.dataMessage'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
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
      return response()->json(config('common.dataMessage'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
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
      return response()->json(config('common.dataMessage'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
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
      return response()->json(config('common.dataMessage'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
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
        return response()->json(config('common.dataMessage'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
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
        return response()->json(config('common.dataMessage'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
      }
  }
  public function getGoodReceiptByorderNo(Request $request)
  {
    $goodReceipt=tbl_good_receipt::with(['goodReceiptBygoodreceiptDetails','goodReceiptCity'])
                                  ->where('tbl_good_receipt.order_no','=',$request->input("orderNo"))
                                  ->get();
    if(sizeof($goodReceipt)){
        return response()->json($goodReceipt,200, config('common.header'),JSON_UNESCAPED_UNICODE);
      }
    else{
        return response()->json(config('common.dataMessage'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
      }
  }

}
 ?>
