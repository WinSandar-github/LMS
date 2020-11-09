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
        $statement->car_no=$request->input("car_no");
        $statement->date=$request->input("date");
        $statement->total_price=$request->input("total_price");
        $statement->commission=$request->input("commission");
        $statement->commission_value=$request->input("commission_value");
        $statement->labour=$request->input("labour");
        $statement->advance=$request->input("advance");
        $statement->land=$request->input("land");
        $statement->final_price=$request->input("final_price");
        $statement->cash_total=$request->input("cash_total");
        $statement->all_total=$request->input("all_total");
        $statement->delivery_id=$request->input("delivery_id");
        $statement->company_id=$request->input("company_id");
        $statement->status=$request->input("status");
        $statement->save();
        return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
      }catch (\Exception $e){
        return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
     }
   }
   public function getStatmentCarList(Request $request)
   {
     $start_date=date("Y-m-d", strtotime($request->input("start_date")));
     $end_date=date("Y-m-d", strtotime($request->input("end_date")));
     if($start_date==$end_date){
         $statement=tbl_statement_car_list::where('company_id','=',$request->input("company_id"))
                                            ->get();
     }
     else{
          $statement=tbl_statement_car_list::where('company_id','=',$request->input("company_id"))
                                             ->whereBetween('date',[$start_date, $end_date])
                                             ->get();
     }
     if(sizeof($statement)){
          return response()->json($statement, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
     }
     else{
          return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
     }
   }
}
 ?>
