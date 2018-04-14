<?php
require("connexion.php");
$conn = mysqli_connect($host, $user, $passwd, $db);
mysqli_select_db($conn, $db) or die("Unable to select db $db");
/*
$name = mysqli_real_escape_string($conn, $_POST["name"]);
$artist = mysqli_real_escape_string($conn, $_POST["artist"]);
$track = mysqli_real_escape_string($conn, $_POST["track"]);
 */
$name = "Wicked Sounds";
$artist = "Anonymous";
$track = file_get_contents("php://input");
$track_path = "";

$filename = microtime();
$filename = strtr($filename, array('.' => '', ' ' => ''));
$filename = $filename . ".ogg";
$filepath = getcwd() . "/tracks/" . $filename;
file_put_contents($filepath, $track);
$track_path = $filepath;
 

$requete = "INSERT INTO music (artist, name, date_created, track_id, track) VALUES ('$artist', '$name', NOW(), '$track_path', '$filename')";
mysqli_query($conn, $requete);



mysqli_close($conn);
?>

