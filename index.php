<?php

use App\SimpleRoutePhp\Route;

//INICIO: HEADER
header("Access-Control-Allow-Origin: *"); //Qualquer site pode acessar
header("Content-Type: application/json; charset=UTF-8"); //tipo de retorno
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE"); // tipos de verbos http aceitos
header("Access-Control-Max-Age: 3600"); // Durabilidade Máxima de 1 hora
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"); // Habilita alguma autorização
//FIM: HEADER

require_once __DIR__ . "/vendor/autoload.php";
require_once __DIR__ . "/src/Config.php";

$route = new Route(URL_BASE);

$route->namespace("App\\Address");

$route->get("/", function () {

    header("Location: /view");
});

$route->post("/cep", "AddressController:setAddress");
$route->get("/{cep}", "AddressController:getAddress");

$route->dispatch();

$error = $route->getError();

if ($error["error"]) {
    echo json_encode($error);
}
