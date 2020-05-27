<?php

header('content-type: application/json; charset=utf-8');
$data = [];
if(!isset($_GET['user'])){
    $status = "error";
    $mes = 'You must set your Discord\'s tag (Example: "Bony_Chops#7715")';
    launch();
}
$rawData = file_get_contents('php://input');
if(($rawData == "")||($rawData == null)){
    $status = "error";
    $mes = 'You have to send data by POST(No data recieved).';
    launch();
}
$todoData = json_decode($rawData, true);


$requires = ["name", "link", "time"];
foreach($requires as $param){
    if(!isset($todoData[$param])){
        $status = "error";
        $mes = 'Data params not enough. (Required '.implode(", ", $requires).')';
        launch();
    }
}

$status = "success";
$mes = "This may fail when you send with wrong Discord's tag. Please check on Discord channel #bony-secure-log";
launch();

function launch(){
    global $status;
    global $mes;
    global $data;
    global $todoData;
    $json_data = [
        "status" => $status,
        "message" => $mes,
        "data" => $data
    ];
    print(json_encode($json_data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT));
    file_put_contents(__DIR__.'/../apiLog.json', json_encode($json_data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT));
    if($status == "success"){
        $json_data = [
            "method" => "todoist",
            "time" => date(DATE_ATOM),
            "host" => $_SERVER["REMOTE_ADDR"],
            "status" => $status,
            "mes" => $mes,
            "todoData" => $todoData,
            "userTag" => $_GET['user']
        ];
        file_put_contents(__DIR__.'/../apiLaunched.json', json_encode($json_data, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT));
    }
    exit();
}
