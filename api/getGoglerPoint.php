<?php
header('content-type: application/json; charset=utf-8');
$data = [];
if(!file_exists(__DIR__.'/../genkaiData.json')){
    http_response_code( 404 ) ;
    $status = "error";
    $mes = "There is no data.";
}else{
    $data = json_decode(file_get_contents(__DIR__.'/../genkaiData.json'), true);
    $status = "success";
    $mes = "OK";
}
$json_data = [
    "status" => $status,
    "message" => $mes,
    "data" => $data
];
print(json_encode($json_data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT));
$json_data = [
    "method" => "getGoglerPoint",
    "time" => date(DATE_ATOM),
    "host" => $_SERVER["REMOTE_ADDR"],
    "status" => $status,
    "mes" => $mes
];
file_put_contents(__DIR__.'/../apiLaunched.json', json_encode($json_data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT));