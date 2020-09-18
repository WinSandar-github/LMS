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
Route::post('/saveCompany', array('middleware' => 'cors', 'uses' => 'RegisterController@saveCompany'));
Route::post('/updateCompany', array('middleware' => 'cors', 'uses' => 'RegisterController@updateCompany'));
Route::post('/loginValidate', array('middleware' => 'cors', 'uses' => 'CompanyLoginController@loginValidate'));
Route::post('/saveDelivery', array('middleware' => 'cors', 'uses' => 'DeliveryController@saveDelivery'));
Route::post('/updateDelivery', array('middleware' => 'cors', 'uses' => 'DeliveryController@updateDelivery'));
Route::post('/deleteDelivery', array('middleware' => 'cors', 'uses' => 'DeliveryController@deleteDelivery'));
Route::post('/saveDeliverDetail', array('middleware' => 'cors', 'uses' => 'DeliverDetailController@saveDeliverDetail'));
Route::post('/updateDeliverDetail', array('middleware' => 'cors', 'uses' => 'DeliverDetailController@updateDeliverDetail'));
Route::post('/deleteDeliverDetail', array('middleware' => 'cors', 'uses' => 'DeliverDetailController@deleteDeliverDetail'));

Route::post('createCity',array('middleware'=>'cors','uses'=>'CityController@createCity'));
Route::post('getCity',array('middleware'=>'cors','uses'=>'CityController@getCity'));
Route::post('getCityInfo',array('middleware'=>'cors','uses'=>'CityController@getCityInfo'));
Route::post('updateCity',array('middleware'=>'cors','uses'=>'CityController@updateCity'));
Route::post('deleteCity',array('middleware'=>'cors','uses'=>'CityController@deleteCity'));


Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
