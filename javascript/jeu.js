window.onload = function () {
    // Nombre d'images par seconde
    var fps = 60;
    // Mettre en place le contexte d'annimation du canvas
    window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / fps);
                };
    })();
    // Nombre de vie
    vie = 3;
    // Score
    score = 0;
    /*
     * @author Lilian
     * J'ai mis la variable niveau pour avancer et preparer pour moi mais il faudrai que tu approuve Keke
     */
    niveau = 1;
    debug = false;
    /*
     * @author Lilian
     * Direction du bloc Alien 0=gauche 1=droite 2=bas puis droite 3=bas puis gauche
     */

    direction = 0;
    // Creer le canvas
    var canvas = document.getElementById('main');
    var Contexte = canvas.getContext("2d");
    // Taille du Canvas
    canvas.width = 1000;
    canvas.height = 600;
    // Petit canvas pour afficher le score, les vies et la pause, actualisé uniquement quand il le faut
    var canvasscore = document.getElementById('score');
    var ContexteScore = canvasscore.getContext("2d");
    // Taille du Canvas
    canvasscore.width = canvas.width;
    canvasscore.height = 20;

    derniertir = 0;
    gameover = false;
    // Variable du vaisseau
    var Vaisseau = {
        x: 0,
        y: 0,
        TailleX: 95,
        TailleY: 41
    };
    /*
     * @author Lilian
     * Variable du cadre des Aliens
     */
    var CadreAlien = {
        x: 0,
        y: 0,
        TailleX: 589,
        TailleY: 182
    };
    /*
     * @author Lilian
     * Variable des Aliens
     */
    Alien = {
        1: {x: 0, y: 0, type: 0},
        2: {x: 75, y: 0, type: 0},
        3: {x: 150, y: 0, type: 0},
        4: {x: 225, y: 0, type: 0},
        5: {x: 300, y: 0, type: 0},
        6: {x: 375, y: 0, type: 0},
        7: {x: 450, y: 0, type: 0},
        8: {x: 525, y: 0, type: 0},
        9: {x: 0, y: 75, type: 1},
        10: {x: 75, y: 75, type: 1},
        11: {x: 150, y: 75, type: 1},
        12: {x: 225, y: 75, type: 1},
        13: {x: 300, y: 75, type: 1},
        14: {x: 375, y: 75, type: 1},
        15: {x: 450, y: 75, type: 1},
        16: {x: 525, y: 75, type: 1},
        17: {x: 0, y: 150, type: 2},
        18: {x: 75, y: 150, type: 2},
        19: {x: 150, y: 150, type: 2},
        20: {x: 225, y: 150, type: 2},
        21: {x: 300, y: 150, type: 2},
        22: {x: 375, y: 150, type: 2},
        23: {x: 450, y: 150, type: 2},
        24: {x: 525, y: 150, type: 2},
        TailleX: 64,
        TailleY: 32
    };

    Missile = [];
    Bonus = [];
    // Fonction permettant de voir si l'utilisateur a quitté le navigateur
    window.addEventListener('focus', function () {
        enleverpause();
    });

    window.addEventListener('blur', function () {
        pause();
    });

    // Un bouton pour mettre en pause
    document.getElementById("score").addEventListener('click', function () {
        if (encours) {
            pause();
        }
        else {
            enleverpause();
        }


    });
    // Demmarrer le jeu
    remiseazero();
    var datenow = Date.now();
    var encours = true;
    renduscore();
    main();


    // Fonction
    function scoreniveau(niveau) {
        return Math.floor((0.1 * niveau * niveau) + niveau + 99);
    }
    function lancerbonus(idAlien) {
        var typebonus = Math.floor(Math.random() * 2) + 1;
        Bonus.push({x: Math.ceil((Alien[idAlien].x + (Alien[idAlien].x + Alien.TailleX)) / 2), y: Alien[idAlien].y + 5, type: typebonus});
    }
    // Remettre le jeu a 0
    function remiseazero() {
        // Dimitri : Mettre le vaisseau au milieu
        Vaisseau.x = Math.ceil(canvas.width / 2);
        Vaisseau.y = canvas.height - 50;
        // Vie
        vie = 3;
        /*
         * @author Lilian
         * J'ai mis la variable niveau pour etre sur qu'on l'oublie pas!
         */
        niveau = 1;
        /*
         * @author Lilian
         * On remet les aliens a leur place
         */
        Bonus = [];
        CadreAlien.x = 0;
        CadreAlien.y = 0;
        Alien = {
            1: {x: 0, y: 0, type: 0},
            2: {x: 75, y: 0, type: 0},
            3: {x: 150, y: 0, type: 0},
            4: {x: 225, y: 0, type: 0},
            5: {x: 300, y: 0, type: 0},
            6: {x: 375, y: 0, type: 0},
            7: {x: 450, y: 0, type: 0},
            8: {x: 525, y: 0, type: 0},
            9: {x: 0, y: 75, type: 1},
            10: {x: 75, y: 75, type: 1},
            11: {x: 150, y: 75, type: 1},
            12: {x: 225, y: 75, type: 1},
            13: {x: 300, y: 75, type: 1},
            14: {x: 375, y: 75, type: 1},
            15: {x: 450, y: 75, type: 1},
            16: {x: 525, y: 75, type: 1},
            17: {x: 0, y: 150, type: 2},
            18: {x: 75, y: 150, type: 2},
            19: {x: 150, y: 150, type: 2},
            20: {x: 225, y: 150, type: 2},
            21: {x: 300, y: 150, type: 2},
            22: {x: 375, y: 150, type: 2},
            23: {x: 450, y: 150, type: 2},
            24: {x: 525, y: 150, type: 2},
            TailleX: 64,
            TailleY: 32
        };
        score = 0;
        Missile = [];
        derniertir = 0;
    }

    //Preparer pour un nouveau niveau
    function nouveauniveau() {
        Vaisseau.x = Math.ceil(canvas.width / 2);
        Vaisseau.y = canvas.height - 50;
        score += (1000 * niveau);
        niveau += 1;
        vie += 1;
        Bonus = [];
        CadreAlien.x = 0;
        CadreAlien.y = 0;
        Alien = {
            1: {x: 0, y: 0, type: 0},
            2: {x: 75, y: 0, type: 0},
            3: {x: 150, y: 0, type: 0},
            4: {x: 225, y: 0, type: 0},
            5: {x: 300, y: 0, type: 0},
            6: {x: 375, y: 0, type: 0},
            7: {x: 450, y: 0, type: 0},
            8: {x: 525, y: 0, type: 0},
            9: {x: 0, y: 75, type: 1},
            10: {x: 75, y: 75, type: 1},
            11: {x: 150, y: 75, type: 1},
            12: {x: 225, y: 75, type: 1},
            13: {x: 300, y: 75, type: 1},
            14: {x: 375, y: 75, type: 1},
            15: {x: 450, y: 75, type: 1},
            16: {x: 525, y: 75, type: 1},
            17: {x: 0, y: 150, type: 2},
            18: {x: 75, y: 150, type: 2},
            19: {x: 150, y: 150, type: 2},
            20: {x: 225, y: 150, type: 2},
            21: {x: 300, y: 150, type: 2},
            22: {x: 375, y: 150, type: 2},
            23: {x: 450, y: 150, type: 2},
            24: {x: 525, y: 150, type: 2},
            TailleX: 64,
            TailleY: 32
        };
        Missile = [];
        derniertir = 0;
        renduscore();
    }

    // Pause
    function pause() {
        if (!gameover) {

            Contexte.fillStyle = "rgba(64, 64, 64, 0.8)";
            Contexte.fillRect(0, 0, canvas.width, canvas.height);

            Contexte.font = "150px akashiregular";
            Contexte.fillStyle = "blue";
            Contexte.textAlign = 'center';
            Contexte.textBaseline = 'middle';
            Contexte.fillText("Pause", Math.ceil(canvas.width / 2), Math.ceil(canvas.height / 2));
            encours = false;
        }
    }

    // Enlever la pause
    function enleverpause() {
        if (!gameover) {

            encours = true;
            datenow = Date.now();
            main();
        }
    }

    /*
     * @author Lilian
     * Gestion des collisions pour les aliens et du futur deplacement
     */
    function verifierBords() {
        if (direction == 0 && (CadreAlien.x + CadreAlien.TailleX) > (canvas.width - 5)) {
            direction = 3;
        }
        else if (direction == 1 && CadreAlien.x < 5) {
            direction = 2;
        }
        else if (direction == 2) {
            direction = 0;
        }
        else if (direction == 3) {
            direction = 1;
        }
        else if (CadreAlien.y > canvas.height) {
            lancergameover();
        }
    }

    function collisionAlien() {
        for (var id in Alien) {
            if (Vaisseau.x < Alien[id].x + Alien.TailleY) {
                if (Vaisseau.x + Vaisseau.TailleX > Alien[id].x) {
                    if (Vaisseau.y < Alien[id].y + Alien.TailleY) {
                        if (Vaisseau.TailleY + Vaisseau.y > Alien[id].y) {
                            lancergameover();
                        }
                    }
                }
            }

        }
    }

    function AttraperBonus() {
        for (var id in Bonus) {
            if (Bonus[id].y > canvas.height) {
                Bonus.splice(id, 1);
                break;
            }

            if (Vaisseau.x < Bonus[id].x + 10) {
                if (Vaisseau.x + Vaisseau.TailleX > Bonus[id].x) {
                    if (Vaisseau.y < Bonus[id].y + 10) {
                        if (Vaisseau.TailleY + Vaisseau.y > Bonus[id].y) {
                            if (Bonus[id].type == 1) {
                                vie += 1;
                            }
                            else {
                                score += 500;
                            }
                            Bonus.splice(id, 1);
                        }
                    }
                }
            }

        }
    }

    function lancergameover() {
        gameover = true;
        Alien = {TailleX: 64, TailleY: 32};
        Missile = [];
        var pseudo = prompt("Entrer votre pseudo pour enregistrer votre score", "");
        // Faire une requete Ajax
        xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    alert(xmlhttp.responseText);
                }
                else {
                    alert('Erreur');
                }
            }
        };

        xmlhttp.open("GET", "enregistrementscore.php?pseudo=" + pseudo + "&score=" + score + "&" + Date.now(), true);
        xmlhttp.send();
    }
    /*
     * @author Lilian
     * Fonction gerant le tir (En commun avec Dimitri)
     */
    function tirer(direction, idAlien) {
        /*
         * @author
         * Condition verifiant la direction du tir
         * 1 = Du vaisseau vers les aliens (Dim)
         * 1 Tir toutes les demi-secondes faudra voir si c'est raisonable ou pas
         * 2 = Des aliens vers le vaisseau (Lil)
         */
        if (direction == 1) {
            if (Date.now() > derniertir + 500) {
                derniertir = Date.now();

                Missile.push({x: Math.ceil((Vaisseau.x + (Vaisseau.x + Vaisseau.TailleX)) / 2), y: Vaisseau.y - 5, direction: 1});
            }
        }
        else if (direction == 2) {
            Missile.push({x: Math.ceil((Alien[idAlien].x + (Alien[idAlien].x + Alien.TailleX)) / 2), y: Alien[idAlien].y + 5, direction: 2});
        }
        else {
            console.warn("Aie il y a un probleme");
        }
    }
    /*
     * @author Lilian
     * Fonction déplacant le bloc alien correctement
     */
    function deplacerAlien(temps) {
        // Trouve sur Internet pour comparer des object js
        if (JSON.stringify(Alien) == JSON.stringify({TailleX: 64, TailleY: 32}) && !gameover) {
            nouveauniveau();
        }
        verifierBords();
        var AlienVitesse = 10 * niveau;
        if (direction == 0) {
            CadreAlien.x += AlienVitesse * temps;
            for (var i in Alien) {
                if (isNaN(i)) {
                    break;
                }
                Alien[i].x += AlienVitesse * temps;
            }
        }
        else if (direction == 1) {
            CadreAlien.x -= AlienVitesse * temps;
            for (var i in Alien) {
                if (isNaN(i)) {
                    break;
                }
                Alien[i].x -= AlienVitesse * temps;
            }
        }
        else if (direction == 2 || direction == 3) {
            CadreAlien.y += 25;
            for (var i in Alien) {
                if (isNaN(i)) {
                    break;
                }
                Alien[i].y += 25;
            }
        }
    }
    function verifierTir() {
        for (var id in Missile) {
            if (Missile[id].y < 0) {
                Missile.splice(id, 1);
                break;
            }
            if (Missile[id].y > canvas.height) {
                Missile.splice(id, 1);
                break;
            }

            if (Missile[id].direction == 1) {
                for (var idAlien in Alien) {
                    if (Missile[id].x < Alien[idAlien].x + Alien.TailleX) {
                        if (Missile[id].x > Alien[idAlien].x) {
                            if (Missile[id].y < Alien[idAlien].y + Alien.TailleY) {
                                if (Missile[id].y > Alien[idAlien].y) {
                                    // Temporaire avec la courbe de difficulté
                                    score += scoreniveau(niveau);
                                    renduscore();
                                    if ((Math.floor(Math.random() * (100 - niveau)) + 1) < 5) {
                                        lancerbonus(idAlien);
                                    }
                                    delete Alien[idAlien];
                                    Missile.splice(id, 1);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            else if (Missile[id].direction == 2) {
                if (Missile[id].x < Vaisseau.x + Vaisseau.TailleX) {
                    if (Missile[id].x > Vaisseau.x) {
                        if (Missile[id].y < Vaisseau.y + Vaisseau.TailleY) {
                            if (Missile[id].y > Vaisseau.y) {
                                vie -= 1;
                                renduscore();
                                if (vie <= 0) {
                                    lancergameover();
                                    break;
                                }
                                Missile.splice(id, 1);
                                break;
                            }
                        }
                    }
                }
            }

        }
    }
    // Fonction geante mettant a jour le jeu en fonction des evenements et des touches du clavier
    function miseajour(temps) {
        // Dimitri : Vitesse en pixels, 150 afin d'avoir une animation fluide
        var VaisseauVitesse = 150;
        // Dimitri : Le vaiseau ne peut aller que de gauche a droite, et on verifie en meme temps qu'on ne touche pas le bord
        if (JeuTouches.estAppuye('LEFT')) {
            if (Vaisseau.x > 0) {
                Vaisseau.x -= VaisseauVitesse * temps;
            }
        }

        if (JeuTouches.estAppuye('RIGHT')) {
            if ((Vaisseau.x + Vaisseau.TailleX) < canvas.width) {
                Vaisseau.x += VaisseauVitesse * temps;
            }
        }

        if (JeuTouches.estAppuye('UP')) {
            if (!gameover) {
                tirer(1, 0);
            }
        }
        /*
         * @author Lilian
         * Appeler le deplacement
         */

        if (!gameover) {
            deplacerAlien(temps);
            for (var id in Alien) {
                if (isNaN(id)) {
                    break;
                }
                if ((Math.floor(Math.random() * 10000) + 1) > (9995 - Math.ceil(0.5 * niveau))) {
                    tirer(2, id);
                }

            }
            verifierTir();
            collisionAlien();
            for (var id in Missile) {
                if (Missile[id].direction == 1) {
                    Missile[id].y -= 5;
                }
                else if (Missile[id].direction == 2) {
                    Missile[id].y += 1;
                }
                else {
                    console.warn("Aie il y a un probleme");
                }

            }
            for (var id in Bonus) {
                Bonus[id].y += 5;
            }
            AttraperBonus();
        }

    }
    /*
     * @author Lilian
     * Fonctions dessinants les aliens
     */

    //<editor-fold defaultstate="collapsed" desc="Ne pas supprimer!">
    function dessineralienzero(Contexte, x, y, fill) {
        Contexte.save();
        Contexte.scale(0.5, 0.5);
        Contexte.translate(x, y);
        Contexte.strokeStyle = 'rgba(0,0,0,0)';
        Contexte.lineCap = 'butt';
        Contexte.lineJoin = 'miter';
        Contexte.miterLimit = 4;
        Contexte.save();
        Contexte.fillStyle = fill;
        Contexte.strokeStyle = fill;
        Contexte.lineWidth = 1;
        Contexte.beginPath();
        Contexte.moveTo(80 + x, y);
        Contexte.bezierCurveTo(80 + x, y, 80 + x, 8 + y, 80 + x, 8 + y);
        Contexte.bezierCurveTo(80 + x, 8 + y, 96 + x, 8 + y, 96 + x, 8 + y);
        Contexte.bezierCurveTo(96 + x, 8 + y, 96 + x, 16 + y, 96 + x, 16 + y);
        Contexte.bezierCurveTo(96 + x, 16 + y, 112 + x, 16 + y, 112 + x, 16 + y);
        Contexte.bezierCurveTo(112 + x, 16 + y, 112 + x, 24 + y, 112 + x, 24 + y);
        Contexte.bezierCurveTo(112 + x, 24 + y, 128 + x, 24 + y, 128 + x, 24 + y);
        Contexte.bezierCurveTo(128 + x, 24 + y, 128 + x, 40 + y, 128 + x, 40 + y);
        Contexte.bezierCurveTo(128 + x, 40 + y, 96 + x, 40 + y, 96 + x, 40 + y);
        Contexte.bezierCurveTo(96 + x, 40 + y, 96 + x, 48 + y, 96 + x, 48 + y);
        Contexte.bezierCurveTo(96 + x, 48 + y, 112 + x, 48 + y, 112 + x, 48 + y);
        Contexte.bezierCurveTo(112 + x, 48 + y, 112 + x, 56 + y, 112 + x, 56 + y);
        Contexte.bezierCurveTo(112 + x, 56 + y, 128 + x, 56 + y, 128 + x, 56 + y);
        Contexte.bezierCurveTo(128 + x, 56 + y, 128 + x, 64 + y, 128 + x, 64 + y);
        Contexte.bezierCurveTo(128 + x, 64 + y, 112 + x, 64 + y, 112 + x, 64 + y);
        Contexte.bezierCurveTo(112 + x, 64 + y, 112 + x, 56 + y, 112 + x, 56 + y);
        Contexte.bezierCurveTo(112 + x, 56 + y, 96 + x, 56 + y, 96 + x, 56 + y);
        Contexte.bezierCurveTo(96 + x, 56 + y, 96 + x, 64 + y, 96 + x, 64 + y);
        Contexte.bezierCurveTo(96 + x, 64 + y, 80 + x, 64 + y, 80 + x, 64 + y);
        Contexte.bezierCurveTo(80 + x, 64 + y, 80 + x, 56 + y, 80 + x, 56 + y);
        Contexte.bezierCurveTo(80 + x, 56 + y, 48 + x, 56 + y, 48 + x, 56 + y);
        Contexte.bezierCurveTo(48 + x, 56 + y, 48 + x, 64 + y, 48 + x, 64 + y);
        Contexte.bezierCurveTo(48 + x, 64 + y, 32 + x, 64 + y, 32 + x, 64 + y);
        Contexte.bezierCurveTo(32 + x, 64 + y, 32 + x, 56 + y, 32 + x, 56 + y);
        Contexte.bezierCurveTo(32 + x, 56 + y, 16 + x, 56 + y, 16 + x, 56 + y);
        Contexte.bezierCurveTo(16 + x, 56 + y, 16 + x, 64 + y, 16 + x, 64 + y);
        Contexte.bezierCurveTo(16 + x, 64 + y, x, 64 + y, x, 64 + y);
        Contexte.bezierCurveTo(x, 64 + y, x, 56 + y, x, 56 + y);
        Contexte.bezierCurveTo(x, 56 + y, 16 + x, 56 + y, 16 + x, 56 + y);
        Contexte.bezierCurveTo(16 + x, 56 + y, 16 + x, 48 + y, 16 + x, 48 + y);
        Contexte.bezierCurveTo(16 + x, 48 + y, 32 + x, 48 + y, 32 + x, 48 + y);
        Contexte.bezierCurveTo(32 + x, 48 + y, 32 + x, 40 + y, 32 + x, 40 + y);
        Contexte.bezierCurveTo(32 + x, 40 + y, x, 40 + y, x, 40 + y);
        Contexte.bezierCurveTo(x, 40 + y, x, 24 + y, x, 24 + y);
        Contexte.bezierCurveTo(x, 24 + y, 16 + x, 24 + y, 16 + x, 24 + y);
        Contexte.bezierCurveTo(16 + x, 24 + y, 16 + x, 16 + y, 16 + x, 16 + y);
        Contexte.bezierCurveTo(16 + x, 16 + y, 32 + x, 16 + y, 32 + x, 16 + y);
        Contexte.bezierCurveTo(32 + x, 16 + y, 32 + x, 8 + y, 32 + x, 8 + y);
        Contexte.bezierCurveTo(32 + x, 8 + y, 48 + x, 8 + y, 48 + x, 8 + y);
        Contexte.bezierCurveTo(48 + x, 8 + y, 48 + x, y, 48 + x, y);
        Contexte.bezierCurveTo(48 + x, y, 80 + x, y, 80 + x, y);
        Contexte.closePath();
        Contexte.moveTo(32 + x, 24 + y);
        Contexte.bezierCurveTo(32 + x, 24 + y, 32 + x, 32 + y, 32 + x, 32 + y);
        Contexte.bezierCurveTo(32 + x, 32 + y, 48 + x, 32 + y, 48 + x, 32 + y);
        Contexte.bezierCurveTo(48 + x, 32 + y, 48 + x, 24 + y, 48 + x, 24 + y);
        Contexte.bezierCurveTo(48 + x, 24 + y, 32 + x, 24 + y, 32 + x, 24 + y);
        Contexte.closePath();
        Contexte.moveTo(80 + x, 24 + y);
        Contexte.bezierCurveTo(80 + x, 24 + y, 80 + x, 32 + y, 80 + x, 32 + y);
        Contexte.bezierCurveTo(80 + x, 32 + y, 96 + x, 32 + y, 96 + x, 32 + y);
        Contexte.bezierCurveTo(96 + x, 32 + y, 96 + x, 24 + y, 96 + x, 24 + y);
        Contexte.bezierCurveTo(96 + x, 24 + y, 80 + x, 24 + y, 80 + x, 24 + y);
        Contexte.closePath();
        Contexte.moveTo(48 + x, 40 + y);
        Contexte.bezierCurveTo(48 + x, 40 + y, 48 + x, 48 + y, 48 + x, 48 + y);
        Contexte.bezierCurveTo(48 + x, 48 + y, 80 + x, 48 + y, 80 + x, 48 + y);
        Contexte.bezierCurveTo(80 + x, 48 + y, 80 + x, 40 + y, 80 + x, 40 + y);
        Contexte.bezierCurveTo(80 + x, 40 + y, 48 + x, 40 + y, 48 + x, 40 + y);
        Contexte.closePath();
        Contexte.moveTo(32 + x, 48 + y);
        Contexte.bezierCurveTo(32 + x, 48 + y, 32 + x, 56 + y, 32 + x, 56 + y);
        Contexte.bezierCurveTo(32 + x, 56 + y, 48 + x, 56 + y, 48 + x, 56 + y);
        Contexte.bezierCurveTo(48 + x, 56 + y, 48 + x, 48 + y, 48 + x, 48 + y);
        Contexte.bezierCurveTo(48 + x, 48 + y, 32 + x, 48 + y, 32 + x, 48 + y);
        Contexte.closePath();
        Contexte.moveTo(80 + x, 48 + y);
        Contexte.bezierCurveTo(80 + x, 48 + y, 80 + x, 56 + y, 80 + x, 56 + y);
        Contexte.bezierCurveTo(80 + x, 56 + y, 96 + x, 56 + y, 96 + x, 56 + y);
        Contexte.bezierCurveTo(96 + x, 56 + y, 96 + x, 48 + y, 96 + x, 48 + y);
        Contexte.bezierCurveTo(96 + x, 48 + y, 80 + x, 48 + y, 80 + x, 48 + y);
        Contexte.closePath();
        Contexte.fill();
        Contexte.stroke();
        Contexte.restore();
        Contexte.restore();
    }

    function dessineralienun(Contexte, x, y, fill) {
        Contexte.save();
        Contexte.scale(1, 1);
        Contexte.translate(0, 0);
        Contexte.strokeStyle = 'rgba(0,0,0,0)';
        Contexte.lineCap = 'butt';
        Contexte.lineJoin = 'miter';
        Contexte.miterLimit = 4;
        Contexte.save();
        Contexte.fillStyle = fill;
        Contexte.strokeStyle = fill;
        Contexte.lineWidth = 1;
        Contexte.beginPath();
        Contexte.moveTo(18 + x, y);
        Contexte.bezierCurveTo(18 + x, y, 18 + x, 4 + y, 18 + x, 4 + y);
        Contexte.bezierCurveTo(18 + x, 4 + y, 23 + x, 4 + y, 23 + x, 4 + y);
        Contexte.bezierCurveTo(23 + x, 4 + y, 23 + x, 8 + y, 23 + x, 8 + y);
        Contexte.bezierCurveTo(23 + x, 8 + y, 41 + x, 8 + y, 41 + x, 8 + y);
        Contexte.bezierCurveTo(41 + x, 8 + y, 41 + x, 4 + y, 41 + x, 4 + y);
        Contexte.bezierCurveTo(41 + x, 4 + y, 46 + x, 4 + y, 46 + x, 4 + y);
        Contexte.bezierCurveTo(46 + x, 4 + y, 46 + x, y, 46 + x, y);
        Contexte.bezierCurveTo(46 + x, y, 52 + x, y, 52 + x, y);
        Contexte.bezierCurveTo(52 + x, y, 52 + x, 4 + y, 52 + x, 4 + y);
        Contexte.bezierCurveTo(52 + x, 4 + y, 47 + x, 4 + y, 47 + x, 4 + y);
        Contexte.bezierCurveTo(47 + x, 4 + y, 47 + x, 8 + y, 47 + x, 8 + y);
        Contexte.bezierCurveTo(47 + x, 8 + y, 52 + x, 8 + y, 52 + x, 8 + y);
        Contexte.bezierCurveTo(52 + x, 8 + y, 52 + x, 12 + y, 52 + x, 12 + y);
        Contexte.bezierCurveTo(52 + x, 12 + y, 58 + x, 12 + y, 58 + x, 12 + y);
        Contexte.bezierCurveTo(58 + x, 12 + y, 58 + x, 16 + y, 58 + x, 16 + y);
        Contexte.bezierCurveTo(58 + x, 16 + y, 64 + x, 16 + y, 64 + x, 16 + y);
        Contexte.bezierCurveTo(64 + x, 16 + y, 64 + x, 28 + y, 64 + x, 28 + y);
        Contexte.bezierCurveTo(64 + x, 28 + y, 58 + x, 28 + y, 58 + x, 28 + y);
        Contexte.bezierCurveTo(58 + x, 28 + y, 58 + x, 20 + y, 58 + x, 20 + y);
        Contexte.bezierCurveTo(58 + x, 20 + y, 52 + x, 20 + y, 52 + x, 20 + y);
        Contexte.bezierCurveTo(52 + x, 20 + y, 52 + x, 28 + y, 52 + x, 28 + y);
        Contexte.bezierCurveTo(52 + x, 28 + y, 47 + x, 28 + y, 47 + x, 28 + y);
        Contexte.bezierCurveTo(47 + x, 28 + y, 47 + x, 32 + y, 47 + x, 32 + y);
        Contexte.bezierCurveTo(47 + x, 32 + y, 35 + x, 32 + y, 35 + x, 32 + y);
        Contexte.bezierCurveTo(35 + x, 32 + y, 35 + x, 28 + y, 35 + x, 28 + y);
        Contexte.bezierCurveTo(35 + x, 28 + y, 46 + x, 28 + y, 46 + x, 28 + y);
        Contexte.bezierCurveTo(46 + x, 28 + y, 46 + x, 20 + y, 46 + x, 20 + y);
        Contexte.bezierCurveTo(46 + x, 20 + y, 41 + x, 20 + y, 41 + x, 20 + y);
        Contexte.bezierCurveTo(41 + x, 20 + y, 41 + x, 24 + y, 41 + x, 24 + y);
        Contexte.bezierCurveTo(41 + x, 24 + y, 23 + x, 24 + y, 23 + x, 24 + y);
        Contexte.bezierCurveTo(23 + x, 24 + y, 23 + x, 20 + y, 23 + x, 20 + y);
        Contexte.bezierCurveTo(23 + x, 20 + y, 18 + x, 20 + y, 18 + x, 20 + y);
        Contexte.bezierCurveTo(18 + x, 20 + y, 18 + x, 28 + y, 18 + x, 28 + y);
        Contexte.bezierCurveTo(18 + x, 28 + y, 29 + x, 28 + y, 29 + x, 28 + y);
        Contexte.bezierCurveTo(29 + x, 28 + y, 29 + x, 32 + y, 29 + x, 32 + y);
        Contexte.bezierCurveTo(29 + x, 32 + y, 17 + x, 32 + y, 17 + x, 32 + y);
        Contexte.bezierCurveTo(17 + x, 32 + y, 17 + x, 28 + y, 17 + x, 28 + y);
        Contexte.bezierCurveTo(17 + x, 28 + y, 12 + x, 28 + y, 12 + x, 28 + y);
        Contexte.bezierCurveTo(12 + x, 28 + y, 12 + x, 20 + y, 12 + x, 20 + y);
        Contexte.bezierCurveTo(12 + x, 20 + y, 6 + x, 20 + y, 6 + x, 20 + y);
        Contexte.bezierCurveTo(6 + x, 20 + y, 6 + x, 28 + y, 6 + x, 28 + y);
        Contexte.bezierCurveTo(6 + x, 28 + y, x, 28 + y, x, 28 + y);
        Contexte.bezierCurveTo(x, 28 + y, x, 16 + y, x, 16 + y);
        Contexte.bezierCurveTo(x, 16 + y, 6 + x, 16 + y, 6 + x, 16 + y);
        Contexte.bezierCurveTo(6 + x, 16 + y, 6 + x, 12 + y, 6 + x, 12 + y);
        Contexte.bezierCurveTo(6 + x, 12 + y, 12 + x, 12 + y, 12 + x, 12 + y);
        Contexte.bezierCurveTo(12 + x, 12 + y, 12 + x, 8 + y, 12 + x, 8 + y);
        Contexte.bezierCurveTo(12 + x, 8 + y, 17 + x, 8 + y, 17 + x, 8 + y);
        Contexte.bezierCurveTo(17 + x, 8 + y, 17 + x, 4 + y, 17 + x, 4 + y);
        Contexte.bezierCurveTo(17 + x, 4 + y, 12 + x, 4 + y, 12 + x, 4 + y);
        Contexte.bezierCurveTo(12 + x, 4 + y, 12 + x, y, 12 + x, y);
        Contexte.bezierCurveTo(12 + x, y, 18 + x, y, 18 + x, y);
        Contexte.closePath();
        Contexte.moveTo(18 + x, 12 + y);
        Contexte.bezierCurveTo(18 + x, 12 + y, 18 + x, 16 + y, 18 + x, 16 + y);
        Contexte.bezierCurveTo(18 + x, 16 + y, 23 + x, 16 + y, 23 + x, 16 + y);
        Contexte.bezierCurveTo(23 + x, 16 + y, 23 + x, 12 + y, 23 + x, 12 + y);
        Contexte.bezierCurveTo(23 + x, 12 + y, 18 + x, 12 + y, 18 + x, 12 + y);
        Contexte.closePath();
        Contexte.moveTo(41 + x, 12 + y);
        Contexte.bezierCurveTo(41 + x, 12 + y, 41 + x, 16 + y, 41 + x, 16 + y);
        Contexte.bezierCurveTo(41 + x, 16 + y, 46 + x, 16 + y, 46 + x, 16 + y);
        Contexte.bezierCurveTo(46 + x, 16 + y, 46 + x, 12 + y, 46 + x, 12 + y);
        Contexte.bezierCurveTo(46 + x, 12 + y, 41 + x, 12 + y, 41 + x, 12 + y);
        Contexte.closePath();
        Contexte.fill();
        Contexte.stroke();
        Contexte.restore();
        Contexte.restore();
    }
    function dessineraliendeux(Contexte, x, y, fill) {
        Contexte.save();
        Contexte.scale(1, 1);
        Contexte.translate(0, 0);
        Contexte.strokeStyle = 'rgba(0,0,0,0)';
        Contexte.lineCap = 'butt';
        Contexte.lineJoin = 'miter';
        Contexte.miterLimit = 4;
        Contexte.save();
        Contexte.fillStyle = fill;
        Contexte.strokeStyle = fill;
        Contexte.lineWidth = 1;
        Contexte.beginPath();
        Contexte.moveTo(43 + x, y);
        Contexte.bezierCurveTo(43 + x, y, 43 + x, 4 + y, 43 + x, 4 + y);
        Contexte.bezierCurveTo(43 + x, 4 + y, 59 + x, 4 + y, 59 + x, 4 + y);
        Contexte.bezierCurveTo(59 + x, 4 + y, 59 + x, 8 + y, 59 + x, 8 + y);
        Contexte.bezierCurveTo(59 + x, 8 + y, 64 + x, 8 + y, 64 + x, 8 + y);
        Contexte.bezierCurveTo(64 + x, 8 + y, 64 + x, 20 + y, 64 + x, 20 + y);
        Contexte.bezierCurveTo(64 + x, 20 + y, 48 + x, 20 + y, 48 + x, 20 + y);
        Contexte.bezierCurveTo(48 + x, 20 + y, 48 + x, 24 + y, 48 + x, 24 + y);
        Contexte.bezierCurveTo(48 + x, 24 + y, 53 + x, 24 + y, 53 + x, 24 + y);
        Contexte.bezierCurveTo(53 + x, 24 + y, 53 + x, 28 + y, 53 + x, 28 + y);
        Contexte.bezierCurveTo(53 + x, 28 + y, 43 + x, 28 + y, 43 + x, 28 + y);
        Contexte.bezierCurveTo(43 + x, 28 + y, 43 + x, 24 + y, 43 + x, 24 + y);
        Contexte.bezierCurveTo(43 + x, 24 + y, 38 + x, 24 + y, 38 + x, 24 + y);
        Contexte.bezierCurveTo(38 + x, 24 + y, 38 + x, 20 + y, 38 + x, 20 + y);
        Contexte.bezierCurveTo(38 + x, 20 + y, 27 + x, 20 + y, 27 + x, 20 + y);
        Contexte.bezierCurveTo(27 + x, 20 + y, 27 + x, 24 + y, 27 + x, 24 + y);
        Contexte.bezierCurveTo(27 + x, 24 + y, 37 + x, 24 + y, 37 + x, 24 + y);
        Contexte.bezierCurveTo(37 + x, 24 + y, 37 + x, 28 + y, 37 + x, 28 + y);
        Contexte.bezierCurveTo(37 + x, 28 + y, 27 + x, 28 + y, 27 + x, 28 + y);
        Contexte.bezierCurveTo(27 + x, 28 + y, 27 + x, 24 + y, 27 + x, 24 + y);
        Contexte.bezierCurveTo(27 + x, 24 + y, 21 + x, 24 + y, 21 + x, 24 + y);
        Contexte.bezierCurveTo(21 + x, 24 + y, 21 + x, 28 + y, 21 + x, 28 + y);
        Contexte.bezierCurveTo(21 + x, 28 + y, 11 + x, 28 + y, 11 + x, 28 + y);
        Contexte.bezierCurveTo(11 + x, 28 + y, 11 + x, 24 + y, 11 + x, 24 + y);
        Contexte.bezierCurveTo(11 + x, 24 + y, 16 + x, 24 + y, 16 + x, 24 + y);
        Contexte.bezierCurveTo(16 + x, 24 + y, 16 + x, 20 + y, 16 + x, 20 + y);
        Contexte.bezierCurveTo(16 + x, 20 + y, x, 20 + y, x, 20 + y);
        Contexte.bezierCurveTo(x, 20 + y, x, 8 + y, x, 8 + y);
        Contexte.bezierCurveTo(x, 8 + y, 5 + x, 8 + y, 5 + x, 8 + y);
        Contexte.bezierCurveTo(5 + x, 8 + y, 5 + x, 4 + y, 5 + x, 4 + y);
        Contexte.bezierCurveTo(5 + x, 4 + y, 21 + x, 4 + y, 21 + x, 4 + y);
        Contexte.bezierCurveTo(21 + x, 4 + y, 21 + x, y, 21 + x, y);
        Contexte.bezierCurveTo(21 + x, y, 43 + x, y, 43 + x, y);
        Contexte.closePath();
        Contexte.moveTo(16 + x, 12 + y);
        Contexte.bezierCurveTo(16 + x, 12 + y, 16 + x, 16 + y, 16 + x, 16 + y);
        Contexte.bezierCurveTo(16 + x, 16 + y, 27 + x, 16 + y, 27 + x, 16 + y);
        Contexte.bezierCurveTo(27 + x, 16 + y, 27 + x, 12 + y, 27 + x, 12 + y);
        Contexte.bezierCurveTo(27 + x, 12 + y, 16 + x, 12 + y, 16 + x, 12 + y);
        Contexte.closePath();
        Contexte.moveTo(37 + x, 12 + y);
        Contexte.bezierCurveTo(37 + x, 12 + y, 37 + x, 16 + y, 37 + x, 16 + y);
        Contexte.bezierCurveTo(37 + x, 16 + y, 48 + x, 16 + y, 48 + x, 16 + y);
        Contexte.bezierCurveTo(48 + x, 16 + y, 48 + x, 12 + y, 48 + x, 12 + y);
        Contexte.bezierCurveTo(48 + x, 12 + y, 37 + x, 12 + y, 37 + x, 12 + y);
        Contexte.closePath();
        Contexte.moveTo(10 + x, 28 + y);
        Contexte.bezierCurveTo(10 + x, 28 + y, 10 + x, 32 + y, 10 + x, 32 + y);
        Contexte.bezierCurveTo(10 + x, 32 + y, x, 32 + y, x, 32 + y);
        Contexte.bezierCurveTo(x, 32 + y, x, 28 + y, x, 28 + y);
        Contexte.bezierCurveTo(x, 28 + y, 10 + x, 28 + y, 10 + x, 28 + y);
        Contexte.closePath();
        Contexte.moveTo(64 + x, 28 + y);
        Contexte.bezierCurveTo(64 + x, 28 + y, 64 + x, 32 + y, 64 + x, 32 + y);
        Contexte.bezierCurveTo(64 + x, 32 + y, 54 + x, 32 + y, 54 + x, 32 + y);
        Contexte.bezierCurveTo(54 + x, 32 + y, 54 + x, 28 + y, 54 + x, 28 + y);
        Contexte.bezierCurveTo(54 + x, 28 + y, 64 + x, 28 + y, 64 + x, 28 + y);
        Contexte.closePath();
        Contexte.fill();
        Contexte.stroke();
        Contexte.restore();
        Contexte.restore();
    }
    // Dimitri : Dessine le vaisseau

    function dessinervaisseau(Contexte, x, y) {
        Contexte.save();
        Contexte.scale(1, 1);
        Contexte.translate(0, 0);
        Contexte.strokeStyle = 'rgba(0,0,0,0)';
        Contexte.lineCap = 'butt';
        Contexte.lineJoin = 'miter';
        Contexte.miterLimit = 4;
        Contexte.save();
        Contexte.fillStyle = "#D1D16B";
        Contexte.strokeStyle = "#D1D16B";
        Contexte.lineWidth = 1;
        Contexte.beginPath();
        Contexte.moveTo(65 + x, y);
        Contexte.bezierCurveTo(65 + x, y, 65 + x, 6 + y, 65 + x, 6 + y);
        Contexte.bezierCurveTo(65 + x, 6 + y, 77 + x, 6 + y, 77 + x, 6 + y);
        Contexte.bezierCurveTo(77 + x, 6 + y, 77 + x, 12 + y, 77 + x, 12 + y);
        Contexte.bezierCurveTo(77 + x, 12 + y, 83 + x, 12 + y, 83 + x, 12 + y);
        Contexte.bezierCurveTo(83 + x, 12 + y, 83 + x, 18 + y, 83 + x, 18 + y);
        Contexte.bezierCurveTo(83 + x, 18 + y, 89 + x, 18 + y, 89 + x, 18 + y);
        Contexte.bezierCurveTo(89 + x, 18 + y, 89 + x, 24 + y, 89 + x, 24 + y);
        Contexte.bezierCurveTo(89 + x, 24 + y, 95 + x, 24 + y, 95 + x, 24 + y);
        Contexte.bezierCurveTo(95 + x, 24 + y, 95 + x, 29 + y, 95 + x, 29 + y);
        Contexte.bezierCurveTo(95 + x, 29 + y, 83 + x, 29 + y, 83 + x, 29 + y);
        Contexte.bezierCurveTo(83 + x, 29 + y, 83 + x, 35 + y, 83 + x, 35 + y);
        Contexte.bezierCurveTo(83 + x, 35 + y, 77 + x, 35 + y, 77 + x, 35 + y);
        Contexte.bezierCurveTo(77 + x, 35 + y, 77 + x, 41 + y, 77 + x, 41 + y);
        Contexte.bezierCurveTo(77 + x, 41 + y, 71 + x, 41 + y, 71 + x, 41 + y);
        Contexte.bezierCurveTo(71 + x, 41 + y, 71 + x, 35 + y, 71 + x, 35 + y);
        Contexte.bezierCurveTo(71 + x, 35 + y, 65 + x, 35 + y, 65 + x, 35 + y);
        Contexte.bezierCurveTo(65 + x, 35 + y, 65 + x, 29 + y, 65 + x, 29 + y);
        Contexte.bezierCurveTo(65 + x, 29 + y, 53 + x, 29 + y, 53 + x, 29 + y);
        Contexte.bezierCurveTo(53 + x, 29 + y, 53 + x, 35 + y, 53 + x, 35 + y);
        Contexte.bezierCurveTo(53 + x, 35 + y, 42 + x, 35 + y, 42 + x, 35 + y);
        Contexte.bezierCurveTo(42 + x, 35 + y, 42 + x, 29 + y, 42 + x, 29 + y);
        Contexte.bezierCurveTo(42 + x, 29 + y, 30 + x, 29 + y, 30 + x, 29 + y);
        Contexte.bezierCurveTo(30 + x, 29 + y, 30 + x, 35 + y, 30 + x, 35 + y);
        Contexte.bezierCurveTo(30 + x, 35 + y, 24 + x, 35 + y, 24 + x, 35 + y);
        Contexte.bezierCurveTo(24 + x, 35 + y, 24 + x, 41 + y, 24 + x, 41 + y);
        Contexte.bezierCurveTo(24 + x, 41 + y, 18 + x, 41 + y, 18 + x, 41 + y);
        Contexte.bezierCurveTo(18 + x, 41 + y, 18 + x, 35 + y, 18 + x, 35 + y);
        Contexte.bezierCurveTo(18 + x, 35 + y, 12 + x, 35 + y, 12 + x, 35 + y);
        Contexte.bezierCurveTo(12 + x, 35 + y, 12 + x, 29 + y, 12 + x, 29 + y);
        Contexte.bezierCurveTo(12 + x, 29 + y, x, 29 + y, x, 29 + y);
        Contexte.bezierCurveTo(x, 29 + y, x, 24 + y, x, 24 + y);
        Contexte.bezierCurveTo(x, 24 + y, 6 + x, 24 + y, 6 + x, 24 + y);
        Contexte.bezierCurveTo(6 + x, 24 + y, 6 + x, 18 + y, 6 + x, 18 + y);
        Contexte.bezierCurveTo(6 + x, 18 + y, 12 + x, 18 + y, 12 + x, 18 + y);
        Contexte.bezierCurveTo(12 + x, 18 + y, 12 + x, 12 + y, 12 + x, 12 + y);
        Contexte.bezierCurveTo(12 + x, 12 + y, 18 + x, 12 + y, 18 + x, 12 + y);
        Contexte.bezierCurveTo(18 + x, 12 + y, 18 + x, 6 + y, 18 + x, 6 + y);
        Contexte.bezierCurveTo(18 + x, 6 + y, 30 + x, 6 + y, 30 + x, 6 + y);
        Contexte.bezierCurveTo(30 + x, 6 + y, 30 + x, y, 30 + x, y);
        Contexte.bezierCurveTo(30 + x, y, 65 + x, y, 65 + x, y);
        Contexte.closePath();
        Contexte.moveTo(18 + x, 18 + y);
        Contexte.bezierCurveTo(18 + x, 18 + y, 18 + x, 24 + y, 18 + x, 24 + y);
        Contexte.bezierCurveTo(18 + x, 24 + y, 24 + x, 24 + y, 24 + x, 24 + y);
        Contexte.bezierCurveTo(24 + x, 24 + y, 24 + x, 18 + y, 24 + x, 18 + y);
        Contexte.bezierCurveTo(24 + x, 18 + y, 18 + x, 18 + y, 18 + x, 18 + y);
        Contexte.closePath();
        Contexte.moveTo(36 + x, 18 + y);
        Contexte.bezierCurveTo(36 + x, 18 + y, 36 + x, 24 + y, 36 + x, 24 + y);
        Contexte.bezierCurveTo(36 + x, 24 + y, 42 + x, 24 + y, 42 + x, 24 + y);
        Contexte.bezierCurveTo(42 + x, 24 + y, 42 + x, 18 + y, 42 + x, 18 + y);
        Contexte.bezierCurveTo(42 + x, 18 + y, 36 + x, 18 + y, 36 + x, 18 + y);
        Contexte.closePath();
        Contexte.moveTo(53 + x, 18 + y);
        Contexte.bezierCurveTo(53 + x, 18 + y, 53 + x, 24 + y, 53 + x, 24 + y);
        Contexte.bezierCurveTo(53 + x, 24 + y, 59 + x, 24 + y, 59 + x, 24 + y);
        Contexte.bezierCurveTo(59 + x, 24 + y, 59 + x, 18 + y, 59 + x, 18 + y);
        Contexte.bezierCurveTo(59 + x, 18 + y, 53 + x, 18 + y, 53 + x, 18 + y);
        Contexte.closePath();
        Contexte.moveTo(71 + x, 18 + y);
        Contexte.bezierCurveTo(71 + x, 18 + y, 71 + x, 24 + y, 71 + x, 24 + y);
        Contexte.bezierCurveTo(71 + x, 24 + y, 77 + x, 24 + y, 77 + x, 24 + y);
        Contexte.bezierCurveTo(77 + x, 24 + y, 77 + x, 18 + y, 77 + x, 18 + y);
        Contexte.bezierCurveTo(77 + x, 18 + y, 71 + x, 18 + y, 71 + x, 18 + y);
        Contexte.closePath();
        Contexte.fill();
        Contexte.stroke();
        Contexte.restore();
        Contexte.restore();
    }
    //</editor-fold>

    // Dessiner
    function rendu() {
        Contexte.fillStyle = 'black';
        Contexte.fillRect(0, 0, canvas.width, canvas.height);
        // Dimitri : Dessine le vaisseau, et un cadre pour Lilian
        if (debug) {
            Contexte.fillStyle = 'green';
            Contexte.fillRect(Vaisseau.x, Vaisseau.y, Vaisseau.TailleX, Vaisseau.TailleY);
        }
        dessinervaisseau(Contexte, Vaisseau.x, Vaisseau.y);

        /*
         * @author Lilian
         * Dessin du cadre des aliens uniquement en debug
         */

        if (debug) {
            Contexte.strokeStyle = 'rgb(255, 255, 255)';
            Contexte.strokeRect(CadreAlien.x, CadreAlien.y, CadreAlien.TailleX, CadreAlien.TailleY);
        }

        /*
         * @author Lilian
         *  Dessin cadre des aliens
         */
        for (var id in Alien) {
            if (isNaN(id)) {
                break;
            }
            var fill;
            if (debug) {
                Contexte.fillStyle = 'rgb(255,255,255)';
                Contexte.fillRect(Alien[id].x, Alien[id].y, Alien.TailleX, Alien.TailleY);
            }
            switch (Alien[id].type)
            {
                case 0:
                    fill = Contexte.fillStyle = 'rgb(255, 0, 0)';
                    dessineralienzero(Contexte, Alien[id].x, Alien[id].y, fill);
                    break;
                case 1:
                    fill = Contexte.fillStyle = 'rgb(255, 150, 150)';
                    dessineralienun(Contexte, Alien[id].x, Alien[id].y, fill);

                    break;
                case 2:
                    fill = Contexte.fillStyle = 'rgb(255, 75, 75)';
                    dessineraliendeux(Contexte, Alien[id].x, Alien[id].y, fill);

                    break;
            }


        }
        for (var id in Missile) {
            if (Missile[id].direction == 1) {
                Contexte.fillStyle = 'green';
            }
            else {
                Contexte.fillStyle = 'red';
            }
            Contexte.fillRect(Missile[id].x, Missile[id].y, 3, 3);
        }
        for (var id in Bonus) {
            if (Bonus[id].type == 1) {
                Contexte.fillStyle = 'yellow';
                Contexte.fillRect(Bonus[id].x, Bonus[id].y, 10, 10);
            }
            else {
                Contexte.fillStyle = 'green';
                Contexte.fillRect(Bonus[id].x, Bonus[id].y, 10, 10);
            }
        }
        if (gameover) {
            Contexte.font = "150px akashiregular";
            Contexte.fillStyle = "red";
            Contexte.textAlign = 'center';
            Contexte.textBaseline = 'middle';
            Contexte.fillText("Game Over", Math.ceil(canvas.width / 2), Math.ceil(canvas.height / 2));
            Contexte.font = "50px akashiregular";
            Contexte.fillStyle = "red";
            Contexte.textAlign = 'center';
            Contexte.textBaseline = 'middle';
            Contexte.fillText("F5 pour relancer une partie", Math.ceil(canvas.width / 2), Math.ceil(canvas.height / 2) + 80);

        }
    }

    function renduscore() {
        ContexteScore.fillStyle = 'black';
        ContexteScore.fillRect(0, 0, canvasscore.width, canvasscore.height);
        ContexteScore.font = (canvasscore.height - 2) + "px akashiregular";
        ContexteScore.fillStyle = "white";
        ContexteScore.textAlign = 'center';
        ContexteScore.textBaseline = 'middle';
        ContexteScore.fillText("Vie:" + vie, 40, Math.ceil(canvasscore.height / 2));
        ContexteScore.fillText("Score:" + score, Math.ceil(canvasscore.width / 2), Math.ceil(canvasscore.height / 2));
        ContexteScore.fillText("Niveau:" + niveau, canvasscore.width - 120, Math.ceil(canvasscore.height / 2));
        ContexteScore.fillRect(canvasscore.width - 10, 4, 3, canvasscore.height - 4);
        ContexteScore.fillRect(canvasscore.width - 15, 4, 3, canvasscore.height - 4);
    }

    // La Boucle principale
    function main() {
        if (!encours) {
            return;
        }

        var now = Date.now();
        var temps = (now - datenow) / 1000.0;

        miseajour(temps);
        rendu();

        datenow = now;
        requestAnimFrame(main);
    }

};

// La fonction gerant les touches

var JeuTouches = (function () {

    var touchesAppuyes = {};
    // Met a jour les touches
    function settouche(event, etat) {
        var code = event.keyCode;
        var touche;
        switch (code) {
            case 32:
                touche = 'SPACE';
                break;
            case 37:
                touche = 'LEFT';
                break;
            case 38:
                touche = 'UP';
                break;
            case 39:
                touche = 'RIGHT';
                break;
            case 40:
                touche = 'DOWN';
                break;
            default:
                touche = null;


        }

        touchesAppuyes[touche] = etat;
    }
    // Active les evenements
    document.addEventListener('keydown', function (e) {
        settouche(e, true);
    });

    document.addEventListener('keyup', function (e) {
        settouche(e, false);
    });

    window.addEventListener('blur', function () {
        touchesAppuyes = {};
    });

    function estAppuye(touche) {
        return touchesAppuyes[touche];
    }


    return {
        estAppuye: estAppuye
    };

})();

