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
            $goodReceiptId=$orderData[0]["goodReceiptId"];
            $order->order_no=$orderData[0]["orderNo"];
            $order->order_date=date("Y-m-d");
            $order->order_total=$orderData[0]["orderTotal"];
            $order->total=$orderData[0]["total"];
            $order->labour=$orderData[0]["labour"];
            $order->land=$orderData[0]["land"];
            $order->good_receipt_id=$goodReceiptId;
            $order->user_id=$orderData[0]["userId"];
            $order->company_id=$orderData[0]["companyId"];
            $order->save();
            $orderId=$order->id;
            for($order = 1; $order < count($orderData); $order++) {
              $orderDetail=new tbl_order_details();
              $orderDetail->product_name=$orderData[$order]["productName"];
              $orderDetail->quantity=$orderData[$order]["quantity"];
              $orderDetail->unit=$orderData[$order]["unit"];
              $orderDetail->product_price=$orderData[$order]["productPrice"];
              $orderDetail->weight=$orderData[$order]["weight"];
              $orderDetail->total=$orderData[$order]["total"];
              $orderDetail->order_id=$orderId;
              $orderDetail->user_id=$orderData[$order]["userId"];
              $orderDetail->save();
            }
            $goodReceipt=tbl_good_receipt::find($goodReceiptId);
            $goodReceipt->order_status=1;
            $goodReceipt->save();
            return response()->json(config('common.successMessage'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.errorMessage'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
}