<?php
    $jsonRicevuto = file_get_contents("php://input");
    $datiRicevuti = json_decode($jsonRicevuto, true);

    if($datiRicevuti && isset($datiRicevuti["nomeComponente"])) {
        $nomeDaCancellare = $datiRicevuti["nomeComponente"];
        $nomeFile = "componenti.json";

        if(file_exists($nomeFile)) {
            $contenutoFile = file_get_contents($nomeFile);
            $tuttiIComponenti = json_decode($contenutoFile, true);

            $listaAggiornata = [];
            $componenteTrovato = false;

            foreach($tuttiIComponenti as $componente) {
                if($componente['nomeComponente'] !== $nomeDaCancellare)
                    $listaAggiornata[] = $componente;
                else
                    $componenteTrovato = true;
            }

            if($componenteTrovato) {
                file_put_contents($nomeFile, json_encode($listaAggiornata, JSON_PRETTY_PRINT));
                http_response_code(200);
                echo json_encode(["status" => "success"]);
            }
            else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Componente non trovato"]);
            }
        }
    }
    else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Dati non validi"]);
    }
?>