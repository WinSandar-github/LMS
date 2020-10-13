<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Auth\Authenticatable;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\tbl_order;
use App\tbl_order_details;
use App\tbl_good_receipt;
class OrderController extends Controller
{
     public function createOrder(Request $request)
	{
         try{
            $orderData = json_decode($request->getContent(), true);
            $order=new tbl_order();
            $goodReceiptId=$orderData[0]["goodReceipt_id"];
            $order->order_no=$orderData[0]["order_no"];
            $order->order_date=date("Y-m-d");
            $order->order_total=$orderData[0]["order_total"];
            $order->total=$orderData[0]["total"];
            $order->labour=$orderData[0]["labour"];
            $order->land=$orderData[0]["land"];
            $order->good_receipt_id=$goodReceiptId;
            $order->user_id=$orderData[0]["user_id"];
            $order->company_id=$orderData[0]["company_id"];
            $order->save();
            $orderId=$order->id;
            for($order = 1; $order < count($orderData); $order++) {
              $orderDetail=new tbl_order_details();
              $orderDetail->product_name=$orderData[$order]["product_name"];
              $orderDetail->quantity=$orderData[$order]["quantity"];
              $orderDetail->unit=$orderData[$order]["unit"];
              $orderDetail->product_price=$orderData[$order]["product_price"];
              $orderDetail->weight=$orderData[$order]["weight"];
              $orderDetail->total=$orderData[$order]["total"];
              $orderDetail->order_id=$orderId;
              $orderDetail->user_id=$orderData[$order]["user_id"];
              $orderDetail->save();
            }
            $goodReceipt=tbl_good_receipt::find($goodReceiptId);
            $goodReceipt->order_status=1;
            $goodReceipt->save();
            return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
    public function getOrder(Request $request,$delivery_status)
	{
        $goodReceipt = tbl_order::with('userByOrder')
                                ->where("tbl_order.company_id","=",$request->company_id)
                                ->where("tbl_order.delivery_status","=",$delivery_status)
                                ->get();
        if(sizeof($goodReceipt)){
            return response()->json($goodReceipt, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
           return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
     public function getOrderDetail(Request $request)
	{
        $orderDetail=tbl_order_details::where("order_id","=",$request->order_id)
                                      ->get();
        if(sizeof($orderDetail)){
             return response()->json($orderDetail, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
             return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
	}
     public function deleteOrder(Request $request)
	{
        $order = tbl_order::find($request->order_id);
        if($order->delete()){
            return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.message.error'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
        }  
	}
    
}
