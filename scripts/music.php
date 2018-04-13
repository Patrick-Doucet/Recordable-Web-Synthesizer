<?php
require("connexion.php");
$conn = mysqli_connect($host, $user, $passwd, $db);
mysqli_select_db($conn, $db) or die("Unable to select db $db");

$col = mysqli_real_escape_string($conn, $_GET['type']);
$val = mysqli_real_escape_string($conn, $_GET['val']);


$requete = "SELECT * FROM music WHERE UPPER($col) = UPPER('$val')";
$results = mysqli_query($conn, $requete);

echo '<table class="resultTable">';
printf("\n<tr>\n<th>Name</th>\n<th>Artist</th>\n<th>Date Created</th>\n</tr>\n");

while(($ligne = mysqli_fetch_array($results)) == true)
{
	printf("<tr>\n<td>%s</td>\n<td>%s</td>\n<td>%s</td>\n</tr>\n", $ligne['name'], $ligne['artist'], $ligne['date_created']);
	

}

printf("</table>\n");


mysqli_close($conn);
?>

