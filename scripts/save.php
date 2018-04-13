<?php
require("connexion.php");
$conn = mysqli_connect($host, $user, $passwd, $db);
mysqli_select_db($conn, $db) or die("Unable to select db $db");
/*
$name = mysqli_real_escape_string($conn, $_POST["name"]);
$artist = mysqli_real_escape_string($conn, $_POST["artist"]);
$track = mysqli_real_escape_string($conn, $_POST["track"]);
 */
$name = "test";
$artist = "J";
$track = file_get_contents("php://input");
$track_path = "";

$filename = microtime();
$filename = strtr($filename, array('.' => '', ' ' => ''));
$filename = getcwd() . "/tracks/" . $filename;
file_put_contents($filename, $track);
$track_path = $filename;
 

$requete = "INSERT INTO music (artist, name, date_created, track_id) VALUES ('$artist', '$name', NOW(), '$track_path')";
mysqli_query($conn, $requete);



mysqli_close($conn);
?>

