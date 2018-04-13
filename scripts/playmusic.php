<?php
require("connexion.php");
$conn = mysqli_connect($host, $user, $passwd, $db);
mysqli_select_db($conn, $db) or die("Unable to select db $db");

$val = $_GET['trackid']);


$requete = "SELECT * FROM music WHERE id='$val'";
$results = mysqli_query($conn, $requete);


if(($ligne = mysqli_fetch_array($results)) == true)
{
	printf("<script type=\"text/javascript\">%s</script>", $ligne['track_id']);
}



mysqli_close($conn);
?>

