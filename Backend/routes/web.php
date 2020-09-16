<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::post('/saveTblCompany', array('middleware' => 'cors', 'uses' => 'RegisterController@saveTblCompany'));
Route::post('/loginValidate', array('middleware' => 'cors', 'uses' => 'CompanyLoginController@loginValidate'));
Route::post('save_tbl_city',array('middleware'=>'cors','uses'=>'CityController@save_tbl_city'));
Route::post('get_tbl_city',array('middleware'=>'cors','uses'=>'CityController@get_tbl_city'));
Route::post('get_tbl_city_by_id',array('middleware'=>'cors','uses'=>'CityController@get_tbl_city_by_id'));
Route::post('update_tbl_city',array('middleware'=>'cors','uses'=>'CityController@update_tbl_city'));
Route::post('delete_tbl_city',array('middleware'=>'cors','uses'=>'CityController@delete_tbl_city'));

