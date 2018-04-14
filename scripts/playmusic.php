<?php
require("connexion.php");
$conn = mysqli_connect($host, $user, $passwd, $db);
mysqli_select_db($conn, $db) or die("Unable to select db $db");

$val = $_GET['trackid'];


$requete = "SELECT * FROM music WHERE id='$val'";
$results = mysqli_query($conn, $requete);



if(($ligne = mysqli_fetch_array($results)) == true)
{
	$file_name = $ligne['track'];
	$track_path = $ligne['track_id'];
/*	if(file_exists($track_path)){
		header($_SERVER["SERVER_PROTOCOL"] . "200 OK");
		header("Cache-Control: public");
		header("Content-Type: audio/ogg");
		header("Content-Transfer-Encoding: Binary");
		header("Content-Length:".filesize($track_path));
		header("Content-Disposition: audio; filename=".$file_name);
		readfile($track_path);
	}*/
	echo $file_name;
}



mysqli_close($conn);
?>

