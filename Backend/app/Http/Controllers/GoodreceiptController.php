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
use App\tbl_unit;
use App\tbl_city_list;
use DB;

class GoodreceiptController extends Controller
{
    public function createGoodRecipt(Request $request)
	{
        try{
            $goodReceiptData = json_decode($request->getContent(), true);
            $runningNumber= $this->getRunningNo($goodReceiptData["company_id"]);
            $goodReceipt=new tbl_good_receipt();
            $goodReceipt->sender_name=$goodReceiptData["sender_name"];
            $date=$goodReceiptData["date"];
            $goodReceipt->date=date("Y-m-d", strtotime($date));
            $goodReceipt->customer_name=$goodReceiptData["customer_name"];
            $goodReceipt->order_no=$goodReceiptData["ref_initials"]."-".$runningNumber;
            $goodReceipt->phone_no=$goodReceiptData["phone_no"];
            $goodReceipt->remark=$goodReceiptData["remark"];
            $goodReceipt->status=$goodReceiptData["status"];
            $goodReceipt->cash_method=$goodReceiptData["cash_method"];
            $goodReceipt->city_id=$goodReceiptData["city_id"];
            $goodReceipt->address=$goodReceiptData["address"];
            $goodReceipt->company_id=$goodReceiptData["company_id"];
            $goodReceipt->ref_initials=$goodReceiptData["ref_initials"];
            $goodReceipt->running_number=$runningNumber;
            $goodReceipt->user_id=$goodReceiptData["user_id"];
            $goodReceipt->save();
            return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
    public function getRunningNo($company_id)
	{
        $getMaxRunningNo=tbl_good_receipt::where("company_id","=",$company_id)
									     ->max('running_number');
        $runningNo = (!$getMaxRunningNo) ? 1 : $getMaxRunningNo + 1;
        return $runningNo;
    }
    public function getGoodReceipt(Request $request,$order_status)
	{
        $goodReceipt = tbl_good_receipt::with('users')
                                        ->where("tbl_good_receipt.company_id","=",$request->company_id)
                                        ->where("tbl_good_receipt.order_status","=",$order_status)
                                        ->get();
        if(sizeof($goodReceipt)){
            return response()->json($goodReceipt, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
           return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
    public function showGoodReceiptInfo(Request $request)
	{
         $goodReceipt = tbl_good_receipt::find($request->goodReceipt_id);
         if(empty($goodReceipt)){
            return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
         }
         else{
            return response()->json($goodReceipt, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
         }
    }
    public function updateGoodReceipt(Request $request)
	{
        try{
            $goodReceiptData = json_decode($request->getContent(), true);
            $goodReceipt = tbl_good_receipt::find($goodReceiptData["goodReceipt_id"]);
            $goodReceipt->sender_name=$goodReceiptData["sender_name"];
            $date=$goodReceiptData["date"];
            $goodReceipt->date=date("Y-m-d", strtotime($date));
            $goodReceipt->customer_name=$goodReceiptData["customer_name"];
            $goodReceipt->phone_no=$goodReceiptData["phone_no"];
            $goodReceipt->remark=$goodReceiptData["remark"];
            $goodReceipt->status=$goodReceiptData["status"];
            $goodReceipt->cash_method=$goodReceiptData["cash_method"];
            $goodReceipt->city_id=$goodReceiptData["city_id"];
            $goodReceipt->address=$goodReceiptData["address"];
            $goodReceipt->save();
            return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
	}
    public function deleteGoodReceipt(Request $request)
	{
        $goodReceipt = tbl_good_receipt::find($request->goodReceipt_id);
        if($goodReceipt->delete()){
            return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.message.error'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
	}
     public function createGoodReciptDetails(Request $request)
	{
        try{
            $productData = json_decode($request->getContent(), true);
            $goodReceiptDetail=new tbl_good_receipt_details();
            $goodReceiptDetail->product_name=$productData["product_name"];
            $goodReceiptDetail->qty=$productData["qty"];
            $goodReceiptDetail->unit=$productData["unit_id"];
            $goodReceiptDetail->weight=$productData["weight"];
            $goodReceiptDetail->good_receipt_id=$productData["good_receipt_id"];
            $goodReceiptDetail->user_id=$productData["user_id"];
            $goodReceiptDetail->company_id=$productData["company_id"];
            $goodReceiptDetail->remark=$productData["remark"];
            $goodReceiptDetail->save();
            return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
	}
     public function getGoodReceiptDetail(Request $request)
	{
        $goodReceiptDetail=tbl_good_receipt_details::with(['goodReceiptByDetail','unitByDetail'])
                                                    ->where("tbl_good_receipt_details.good_receipt_id","=",$request->good_receipt_id)
                                                    ->get();
        if(sizeof($goodReceiptDetail)){
             return response()->json($goodReceiptDetail, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
             return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }

	}
     public function getGoodReceiptInvoice(Request $request)
	{
        $goodReceiptDetail=tbl_good_receipt::with(['cityList','goodReceiptDetailByGoodReceipt'])
                                            ->where("tbl_good_receipt.id","=",$request->good_receipt_id)
                                            ->get();
        if(sizeof($goodReceiptDetail)){
             return response()->json($goodReceiptDetail, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
             return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }

	}
    public function showGoodReceiptDetailInfo(Request $request)
	{
         $goodReceiptDetail = tbl_good_receipt_details::find($request->goodReceipt_detail_id);
         if(empty($goodReceiptDetail)){
            return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
         }
         else{
            return response()->json($goodReceiptDetail, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
         }
    }
    public function updateGoodReceiptDetail(Request $request)
	{
        try{
            $goodReceiptDetailData = json_decode($request->getContent(), true);
            $goodReceiptDetail = tbl_good_receipt_details::find($goodReceiptDetailData["goodreceipt_detail_id"]);
            $goodReceiptDetail->product_name=$goodReceiptDetailData["product_name"];
            $goodReceiptDetail->unit=$goodReceiptDetailData["unit_id"];
            $goodReceiptDetail->qty=$goodReceiptDetailData["qty"];
            $goodReceiptDetail->weight=$goodReceiptDetailData["weight"];
            $goodReceiptDetail->remark=$goodReceiptDetailData["remark"];
            $goodReceiptDetail->user_id=$goodReceiptDetailData["user_id"];
            $goodReceiptDetail->save();
            return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
	}
    public function deleteGoodReceiptDetail(Request $request)
	{
        $goodReceiptDetail = tbl_good_receipt_details::find($request->goodreceipt_detail_id);
        if($goodReceiptDetail->delete()){
            return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.message.error'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
        }  
	}
     public function getVipCustomer(Request $request)
	{
        $vipCustomer=tbl_good_receipt::where("company_id","=",$request->company_id)
                                     ->where('status','=',1)
                                     ->groupBy('customer_name')
                                     ->get();
        if(sizeof($vipCustomer)){
             return response()->json($vipCustomer, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
             return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }

	}
     public function getVipCustomerInfo(Request $request)
	{
        $startDate=date("Y-m-d", strtotime($request->start_date));
        $endDate=date("Y-m-d", strtotime($request->end_date));
        if($startDate==$endDate){
            $vipCustomer=tbl_good_receipt::with(['goodReceiptDetailByGoodReceipt','goodReceiptOrder'])
                                         ->where('tbl_good_receipt.customer_name','=',$request->customer_name)
                                         ->get();
        }
        else{
             $vipCustomer=tbl_good_receipt::with(['goodReceiptDetailByGoodReceipt','goodReceiptOrder'])
                                          ->where('tbl_good_receipt.customer_name','=',$request->customer_name)
                                          ->whereBetween('tbl_good_receipt.date',[$startDate, $endDate])
                                          ->get();
        }
        if(sizeof($vipCustomer)){
             return response()->json($vipCustomer, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
             return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }

	}
}
?>
