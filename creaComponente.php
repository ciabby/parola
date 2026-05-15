<?php
    
    $inputRicevuto = file_get_contents("php://input");
    $nuovoComponente = json_decode($inputRicevuto, true);

    if($nuovoComponente) {
        $nomeFile = "componenti.json";
        $dati = json_decode(file_get_contents($nomeFile), true);
        $dati[] = $nuovoComponente;
        file_put_contents($nomeFile, json_encode($dati));
        echo json_encode(["status" => "success"]);
        echo "eseguito con successo";
    }
?>