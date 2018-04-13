<?php
require("connexion.php");
$conn = mysqli_connect($host, $user, $passwd, $db);
mysqli_select_db($conn, $db) or die("Unable to select db $db");

$name = mysqli_real_escape_string($conn, $_POST["name"]);
$artist = mysqli_real_escape_string($conn, $_POST["artist"]);
/*$track = mysqli_real_escape_string($conn, $_POST["track"]);*/

$track_path = "";
/*
 *TODO save the track on the server and
 *return the path to save it in the db.
 *
 *
 *
$filename = $artist . $name;
file_put_contents($filename, $track);
 */
$track_path = getcwd();
$track_path = $track_path . $filename;
 

$requete = "INSERT INTO music (artist, name, date_created, track_id) VALUES ('$artist', '$name', NOW(), '$track_path')";
mysqli_query($conn, $requete);



mysqli_close($conn);
?>

