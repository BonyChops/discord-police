<?php
$json_string = file_get_contents('php://input');
$json_object = json_decode($json_string);
file_put_contents(__DIR__.'/../github.json', json_encode($json_object, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT));
