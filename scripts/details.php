<?php
require("connexion.php");
$conn = mysqli_connect($host, $user, $passwd, $db);
mysqli_select_db($conn, $db) or die("Unable to select db $db");


$name = mysqli_real_escape_string($conn, $_POST["name"]);
$artist = mysqli_real_escape_string($conn, $_POST["artist"]);
$track = mysqli_real_escape_string($conn, $_POST["filename"]);

$filepath = getcwd() . "/tracks/" . $track;
 

$requete = "INSERT INTO music (artist, name, date_created, track_id, track) VALUES ('$artist', '$name', NOW(), '$filepath', '$track')";
mysqli_query($conn, $requete);



mysqli_close($conn);
?>

