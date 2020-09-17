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
Route::post('createCity',array('middleware'=>'cors','uses'=>'CityController@createCity'));
Route::post('getTblCity',array('middleware'=>'cors','uses'=>'CityController@getTblCity'));
Route::post('getCityInfo',array('middleware'=>'cors','uses'=>'CityController@getCityInfo'));
Route::post('updateTblCity',array('middleware'=>'cors','uses'=>'CityController@updateTblCity'));
Route::post('deleteTblCity',array('middleware'=>'cors','uses'=>'CityController@deleteTblCity'));

