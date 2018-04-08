<?php
require("connexion.php");
$conn = mysqli_connect($host, $user, $passwd, $db);
mysqli_select_db($conn, $db) or die("Unable to select db $db");

echo "<p>Songstuff wewewew</p>";


mysqli_close($conn);
?>
