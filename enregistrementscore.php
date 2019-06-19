<?php

//On se connecte
$Dsn = "";
$User = "";
$MDP = "";

try {
    $db = new PDO($Dsn, $User, $MDP);
    $db->exec("SET NAMES 'UTF8'");
} catch (PDOException $e) {
    echo "Erreur";
    exit();
}

//On recupere le nom et le score du joueur
$pseudoajax = $_GET['pseudo'];
$scoreajax = (int) $_GET['score'];

if (!empty($pseudoajax)) {
    if (!empty($scoreajax)) {
        if (is_int($scoreajax)) {
            if ($scoreajax > 0) {
                if (is_string($pseudoajax)) {
                    //On verifie sa place dans les meilleurs scores
                    $sql = "SELECT * FROM spaceinvader_score ORDER BY score LIMIT 0 , 1";
                    $Res = $db->prepare($sql);
                    $Res->execute();
                    $Dernierresultatrequete = $Res->fetch();
                    $dernierresultat = intval($Dernierresultatrequete["score"]);
                    $iddudernierresultat = intval($Dernierresultatrequete["id"]);
                    //Si le socre peut etre mis dans les meilleurs scores:
                    if ($scoreajax > $dernierresultat) {
                        error_reporting(-1);
                        $update = "UPDATE spaceinvader_score SET score = ?,nom = ? WHERE id = ?;";
                        $maj = $db->prepare($update);
                        $maj->execute(array($scoreajax,$pseudoajax, $iddudernierresultat));
                        echo "Felicitation, vous avez inscrit un meilleur score";
                    } else {
                        echo "Vous n'avez pas battu de meilleur score";
                        exit();
                    }
                } else {
                    echo "Le pseudo est incorect";
                    exit();
                }
            } else {
                echo "Le score est inferieur a 0!";
                exit();
            }
        } else {
            echo "Le score doit etre un nombre";
            exit();
        }
    } else {
        echo "Le score est vide!";
        exit();
    }
} else {
    echo "Le pseudo est vide!";
    exit();
}
?>
