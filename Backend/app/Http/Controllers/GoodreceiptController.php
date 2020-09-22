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
use DB;

class GoodreceiptController extends Controller
{
    protected $header = array(
					'Content-Type' => 'application/json; charset=UTF-8',
					'charset' => 'utf-8');
    protected $successMessage=array('message'=>'success.');
    protected $errorMessage=array('message'=>'there is error occur.');
    protected $dataMessage=array('message'=>'there is no data.');

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
            return response()->json($this->successMessage, 200, $this->header, JSON_UNESCAPED_UNICODE);
           
        }catch (\Exception $e) {
           return response()->json($this->errorMessage, 500, $this->header, JSON_UNESCAPED_UNICODE);
        }
			
	}
     public function getGoodReceipt(Request $request,$orderStatus)
	{
        try{
            $goodReceipt=DB::table('tbl_good_receipt')
                        ->select('tbl_good_receipt.id','tbl_good_receipt.sender_name','tbl_good_receipt.cash_method','tbl_good_receipt.customer_name','tbl_good_receipt.order_no','tbl_good_receipt.remark','tbl_good_receipt.date','tbl_good_receipt.order_status','tbl_good_receipt.date','users.full_name')
                        ->join('users','tbl_good_receipt.user_id','=','users.id')
                        ->where("tbl_good_receipt.company_id","=",$request->input("companyId"))
                        ->where("tbl_good_receipt.order_status","=",$orderStatus)
                        ->get();
            if(sizeof($goodReceipt)){
                return response()->json($goodReceipt, 200, $this->header, JSON_UNESCAPED_UNICODE);
            }
            else{
                return response()->json($this->dataMessage, 404, $this->header, JSON_UNESCAPED_UNICODE);
            }
        }catch (\Exception $e) {
            return response()->json($this->errorMessage, 500, $this->header, JSON_UNESCAPED_UNICODE);
        }
		
	}
     public function showGoodReceiptInfo(Request $request)
	{
         try{
             $goodReceipt = tbl_good_receipt::find($request->input("goodReceiptId"));
             if(empty($goodReceipt)){
                return response()->json($this->dataMessage, 404, $this->header, JSON_UNESCAPED_UNICODE);
             }
             else{
                return response()->json($goodReceipt, 200, $this->header, JSON_UNESCAPED_UNICODE);
             }
         }catch (\Exception $e) {
             return response()->json($this->errorMessage, 500, $this->header, JSON_UNESCAPED_UNICODE);
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
            return response()->json($this->successMessage, 200, $this->header, JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json($this->errorMessage, 500, $this->header, JSON_UNESCAPED_UNICODE);
        }
	}
    public function deleteGoodReceipt(Request $request)
	{
        try{
            $goodReceipt = tbl_good_receipt::find($request->input("goodReceiptId"));
            $goodReceipt->delete();
            return response()->json($this->successMessage, 200, $this->header, JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json($this->errorMessage, 500, $this->header, JSON_UNESCAPED_UNICODE);
        }
	}
}
