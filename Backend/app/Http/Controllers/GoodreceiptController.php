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
            return response()->json(config('common.successMessage'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
          }catch (\Exception $e) {
          return response()->json(config('common.errorMessage'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
    public function getGoodReceipt(Request $request,$orderStatus)
	{
        $goodReceipt=DB::table('tbl_good_receipt')
                        ->select('tbl_good_receipt.id','tbl_good_receipt.sender_name','tbl_good_receipt.cash_method','tbl_good_receipt.customer_name','tbl_good_receipt.order_no','tbl_good_receipt.remark','tbl_good_receipt.date','tbl_good_receipt.order_status','tbl_good_receipt.date','users.full_name')
                        ->join('users','tbl_good_receipt.user_id','=','users.id')
                        ->where("tbl_good_receipt.company_id","=",$request->input("companyId"))
                        ->where("tbl_good_receipt.order_status","=",$orderStatus)
                        ->get();
        if(sizeof($goodReceipt)){
            return response()->json($goodReceipt, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
           return response()->json(config('common.dataMessage'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
    }
    public function showGoodReceiptInfo(Request $request)
	{
         $goodReceipt = tbl_good_receipt::find($request->input("goodReceiptId"));
         if(empty($goodReceipt)){
            return response()->json(config('common.dataMessage'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
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
            return response()->json(config('common.successMessage'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.errorMessage'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
	}
    public function deleteGoodReceipt(Request $request)
	{
        $goodReceipt = tbl_good_receipt::find($request->input("goodReceiptId"));
        if($goodReceipt->delete()){
            return response()->json(config('common.successMessage'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.errorMessage'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
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
            return response()->json(config('common.successMessage'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);

        }catch (\Exception $e) {
            return response()->json(config('common.errorMessage'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
        }

	}
     public function getGoodReceiptDetail(Request $request)
	{
        $goodReceiptDetail=DB::table('tbl_good_receipt_details')
                        ->select('tbl_good_receipt_details.id','tbl_good_receipt.order_no','tbl_good_receipt_details.good_receipt_id','tbl_good_receipt_details.product_name','tbl_good_receipt_details.qty','tbl_good_receipt_details.unit','tbl_good_receipt_details.weight','tbl_good_receipt_details.remark','tbl_unit.unit_name')
                        ->join('tbl_unit','tbl_good_receipt_details.unit','=','tbl_unit.id')
                        ->join('tbl_good_receipt','tbl_good_receipt_details.good_receipt_id','=','tbl_good_receipt.id')
                        ->where("tbl_good_receipt_details.good_receipt_id","=",$request->input("goodReceiptId"))
                        ->get();
        if(sizeof($goodReceiptDetail)){
             return response()->json($goodReceiptDetail, 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
             return response()->json(config('common.dataMessage'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }

	}
     public function getGoodReceiptInvoice(Request $request)
	{
        $goodReceiptDetail=DB::table('tbl_good_receipt')
                        ->select('tbl_good_receipt.id','tbl_good_receipt.sender_name','tbl_good_receipt.cash_method','tbl_good_receipt.order_no','tbl_good_receipt.remark','tbl_good_receipt.customer_name','tbl_good_receipt.date','tbl_city_list.city_name','tbl_good_receipt_details.product_name','tbl_good_receipt_details.qty')
                        ->join('tbl_good_receipt_details','tbl_good_receipt.id','=','tbl_good_receipt_details.good_receipt_id')
                        ->join('tbl_city_list','tbl_good_receipt.city_id','=','tbl_city_list.id')
                        ->where("tbl_good_receipt.id","=",$request->input("goodReceiptId"))
                        ->get();
        if(sizeof($goodReceiptDetail)){
             return response()->json($goodReceiptDetail, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
             return response()->json(config('common.dataMessage'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }

	}



}
?>
