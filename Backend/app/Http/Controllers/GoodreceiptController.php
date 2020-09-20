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
            $goodReceipt->order_no=$goodReceiptData["refInitials"]."-".$running_number;
            $goodReceipt->phone_no=$goodReceiptData["phoneNo"];
            $goodReceipt->remark=$goodReceiptData["remark"];
            $goodReceipt->status=$goodReceiptData["status"];
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
}
