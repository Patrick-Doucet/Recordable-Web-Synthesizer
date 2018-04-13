<?php
require("connexion.php");
$conn = mysqli_connect($host, $user, $passwd, $db);
mysqli_select_db($conn, $db) or die("Unable to select db $db");

$name = mysqli_real_escape_string($conn, $_POST["name"]);
$artist = mysqli_real_escape_string($conn, $_POST["artist"]);
$track = mysqli_real_escape_string($conn, $_POST["track"]);

$track_path = "";
/*
 *TODO save the track on the server and
 *return the path to save it in the db.
 *
 *
 */

$requete = "INSERT INTO music (artist, name, date_created, track_id) VALUES ('$artist', '$name', '$track_path')";
$results = mysqli_query($conn, $requete);



mysqli_close($conn);
?>

