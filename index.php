<?php
$Dsn = "";
$User = "";
$MDP = "";

try {
    $db = new PDO($Dsn, $User, $MDP);
    $db->exec("SET NAMES 'UTF8'");
} catch (PDOException $e) {
    var_dump($e);
    echo "Connexion echouee !!!";
    exit();
}

$sql = "SELECT * FROM spaceinvader_score ORDER BY score DESC LIMIT 0 , 5";
$Res = $db->prepare($sql);
$Res->execute();
$Vals = $Res->fetchAll();
$db = null;
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Les envahisseurs de l'espace</title>
        <link rel="stylesheet" type="text/css" href="./css/style.css" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <script src="./javascript/jeu.js"></script>
    </head>
    <body>
        <header><h1>Les envahisseurs de l'espace</h1></header>
        <div id="jeu">
            <canvas id="score"></canvas>
            <canvas id="main">Vous devez utiliser un navigateur prenant en charge les Canvas, Telecharger <a href="https://www.mozilla.org/fr/firefox/new/">Firefox</a></canvas>
        </div>
        <footer><p>Meilleurs Scores</p>
            <ol>
                <?php
                foreach ($Vals as $DispScore) {
                    echo '<li>' . $DispScore['nom'] . ' : ' . $DispScore['score'] . '</li>';
                }
                ?>
            </ol>
        </footer>
    </body>
</html>
