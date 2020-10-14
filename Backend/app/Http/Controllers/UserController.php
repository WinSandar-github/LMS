<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Auth\Authenticatable;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Input;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Hash;
use App\User;
class UserController extends Controller
{
  public function createUser(Request $request)
  {
       try{
            $userData = json_decode($request->getContent(), true);
            $user=new User();
            $user->full_name=$userData["full_name"];
            $user->email =$userData["email"];
            $user->password=Hash::make($userData["password"]);
            $user->phone_no=$userData["phone_no"];
            $user->address=$userData["address"];
            $user->company_id=$userData["company_id"];
            $user->save();
            return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
  }
  public function getUser(Request $request)
  {
        $user = User::where("company_id","=",request("company_id"))
                    ->get();
        if(sizeof($user)){
            return response()->json($user, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
           return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
  }
  public function deleteUser(Request $request)
  {
        $user = User::find(request("user_id"));
        if($user->delete()){
            return response()->json(config('common.message.success'), 200, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
        else{
            return response()->json(config('common.message.error'), 500,config('common.header'), JSON_UNESCAPED_UNICODE);
        }
  }
  public function showUserInfo(Request $request)
  {
         $user = User::find(request("user_id"));
         if(empty($user)){
            return response()->json(config('common.message.data'), 404, config('common.header'), JSON_UNESCAPED_UNICODE);
         }
         else{
            return response()->json($user, 200,config('common.header'), JSON_UNESCAPED_UNICODE);
         }
  }
  public function updateUser(Request $request)
  {
        try{
            $userData = json_decode($request->getContent(), true);
            $user = User::find($userData["user_id"]);
            $user->full_name=$userData["full_name"];
            $user->email=$userData["email"];
            $user->phone_no=$userData["phone_no"];
            $user->address=$userData["address"];
            $user->save();
            return response()->json(config('common.message.success'), 200,config('common.header'), JSON_UNESCAPED_UNICODE);
        }catch (\Exception $e) {
            return response()->json(config('common.message.error'), 500, config('common.header'), JSON_UNESCAPED_UNICODE);
        }
  }
}
