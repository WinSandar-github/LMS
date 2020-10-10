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
            $getRunningno=tbl_good_receipt::where("company_id","=",$goodReceiptData["companyId"])
										  ->max('running_number');

      		if($getRunningno==null){
                $runningNumber=1;

      	    }
      	    else{
                $runningNumber=$getRunningno+1;
      		}
            $goodReceipt=new tbl_good_receipt();
            $goodReceipt->sender_name=$goodReceiptData["senderName"];
            $date=$goodReceiptData["date"];
            $goodReceipt->date=date("Y-m-d", strtotime($date));
            $goodReceipt->customer_name=$goodReceiptData["customerName"];
            $goodReceipt->order_no=$goodReceiptData["refInitials"]."-".$runningNumber;
            $goodReceipt->phone_no=$goodReceiptData["phoneNo"];
            $goodReceipt->remark=$goodReceiptData["remark"];
            $goodReceipt->status=$goodReceiptData["customerStatus"];
            $goodReceipt->cash_method=$goodReceiptData["cashMethod"];
            $goodReceipt->city_id=$goodReceiptData["cityId"];
            $goodReceipt->address=$goodReceiptData["address"];
            $goodReceipt->company_id=$goodReceiptData["companyId"];
            $goodReceipt->ref_initials=$goodReceiptData["refInitials"];
            $goodReceipt->running_number=$runningNumber;
            $goodReceipt->user_id=$goodReceiptData["userId"];
            $goodReceipt->save();
            return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
    public function getGoodReceipt(Request $request,$orderStatus)
	{
        $goodReceipt = tbl_good_receipt::with('users')
                                        ->where("tbl_good_receipt.company_id","=",$request->input("companyId"))
                                        ->where("tbl_good_receipt.order_status","=",$orderStatus)
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
         $goodReceipt = tbl_good_receipt::find($request->input("goodReceiptId"));
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
            $goodReceipt = tbl_good_receipt::find($goodReceiptData["goodReceiptId"]);
            $goodReceipt->sender_name=$goodReceiptData["senderName"];
            $date=$goodReceiptData["date"];
            $goodReceipt->date=date("Y-m-d", strtotime($date));
            $goodReceipt->customer_name=$goodReceiptData["customerName"];
            $goodReceipt->phone_no=$goodReceiptData["phoneNo"];
            $goodReceipt->remark=$goodReceiptData["remark"];
            $goodReceipt->status=$goodReceiptData["status"];
            $goodReceipt->cash_method=$goodReceiptData["cashMethod"];
            $goodReceipt->city_id=$goodReceiptData["cityId"];
            $goodReceipt->address=$goodReceiptData["address"];
            $goodReceipt->save();
            return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
	}
    public function deleteGoodReceipt(Request $request)
	{
        $goodReceipt = tbl_good_receipt::find($request->input("goodReceiptId"));
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
            $goodReceiptDetail->product_name=$productData["productName"];
            $goodReceiptDetail->qty=$productData["quantity"];
            $goodReceiptDetail->unit=$productData["unitId"];
            $goodReceiptDetail->weight=$productData["weight"];
            $goodReceiptDetail->good_receipt_id=$productData["goodReceiptId"];
            $goodReceiptDetail->user_id=$productData["userId"];
            $goodReceiptDetail->company_id=$productData["companyId"];
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
                                                    ->where("tbl_good_receipt_details.good_receipt_id","=",$request->input("goodReceiptId"))
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
                                            ->where("tbl_good_receipt.id","=",$request->input("goodReceiptId"))
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
         $goodReceiptDetail = tbl_good_receipt_details::find($request->input("goodReceiptDetailId"));
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
            $goodReceiptDetail = tbl_good_receipt_details::find($goodReceiptDetailData["goodReceiptDetailId"]);
            $goodReceiptDetail->product_name=$goodReceiptDetailData["productName"];
            $goodReceiptDetail->unit=$goodReceiptDetailData["UnitId"];
            $goodReceiptDetail->qty=$goodReceiptDetailData["quantity"];
            $goodReceiptDetail->weight=$goodReceiptDetailData["weight"];
            $goodReceiptDetail->remark=$goodReceiptDetailData["remark"];
            $goodReceiptDetail->user_id=$goodReceiptDetailData["userId"];
            $goodReceiptDetail->save();
            return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
	}
    public function deleteGoodReceiptDetail(Request $request)
	{
        $goodReceiptDetail = tbl_good_receipt_details::find($request->input("goodReceiptDetailId"));
        if($goodReceiptDetail->delete()){
            return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.message.error'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
        }  
	}
     public function getVipCustomer(Request $request)
	{
        $vipCustomer=tbl_good_receipt::where("company_id","=",$request->input("companyId"))
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
        $startDate=date("Y-m-d", strtotime($request->input("startDate")));
        $endDate=date("Y-m-d", strtotime($request->input("endDate")));
        if($startDate==$endDate){
            $vipCustomer=tbl_good_receipt::with(['goodReceiptDetailByGoodReceipt','goodReceiptOrder'])
                                         ->where('tbl_good_receipt.customer_name','=',$request->input("customerName"))
                                         ->get();
        }
        else{
             $vipCustomer=tbl_good_receipt::with(['goodReceiptDetailByGoodReceipt','goodReceiptOrder'])
                                          ->where('tbl_good_receipt.customer_name','=',$request->input("customerName"))
                                          ->whereBetween('date',[$startDate, $endDate])
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
