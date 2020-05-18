<?php
file_put_contents(__DIR__.'/../github.json', json_encode($_POST, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT));