<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\tbl_statement_car_list;
class StatementCarListController extends Controller
{
  public function saveStatementCarList(Request $request)
  {

    try{
      $statement=new tbl_statement_car_list();
      $statement->car_no=$request->input("carNumber");
      $statement->date=$request->input("deliveryDate");
      $statement->total_price=$request->input("totalPrice");
      $statement->commission=$request->input("commission");
      $statement->commission_value=$request->input("commissionValue");
      $statement->labour=$request->input("labour");
      $statement->advance=$request->input("advance");
      $statement->land=$request->input("land");
      $statement->final_price=$request->input("finalPrice");
      $statement->cash_total=$request->input("cashTotal");
      $statement->all_total=$request->input("allTotal");
      $statement->delivery_id=$request->input("deliveryId");
      $statement->status=$request->input("status");
      $statement->save();
      return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
      }catch (\Exception $e){
        return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
     }
   }
}
 ?>
