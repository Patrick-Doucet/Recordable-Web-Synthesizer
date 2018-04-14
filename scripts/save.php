<?php





$track = file_get_contents("php://input");
$track_path = "";

$filename = microtime();
$filename = strtr($filename, array('.' => '', ' ' => ''));
$filename = $filename . ".ogg";
$filepath = getcwd() . "/tracks/" . $filename;
file_put_contents($filepath, $track);
$track_path = $filepath;
 

echo $filename;


?>

