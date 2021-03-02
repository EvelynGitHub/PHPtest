<?php

namespace App\Address;

use Exception;
use SimpleXMLElement;

class AddressController
{
    private $route;

    public function __construct($route)
    {
        $this->route = $route;
    }

    public function getAddress(string $cep)
    {
        $hasNumberAndHifen = preg_match('/^[\d\-]+$/', $cep);

        if ($hasNumberAndHifen) {

            if (strlen(trim($cep)) == 9) {
                $format = explode("-", $cep);

                if ((strlen($format[0]) == 5 && strlen($format[1]) == 3)) {
                    try {
                        $address = new Address();

                        $value = $address->findByCep($cep);

                        if ($value) {
                            $msg = [
                                "msg" => $value,
                                "error" => false,
                                "search_api" => false
                            ];
                        } else {
                            $msg = [
                                "msg" => "CEP não encontrado no Banco de Dados, consultando API...",
                                "error" => false,
                                "search_api" => true
                            ];
                        }
                    } catch (Exception $e) {
                        $msg = [
                            "msg" => "Desculpe, tivemos um erro inesperado, por favor tente mais tarde! ",
                            "error" => true,
                            "exception" => $e
                        ];
                    }
                } else {
                    $msg = [
                        "msg" => "A formatação deve seguir o formato '12345-123'",
                        "error" => true
                    ];
                }
            } else {
                $msg = ["msg" => "Número de digitos inválido", "error" => true];
            }
        } else {
            $msg = ["msg" => 'Só é permitido números e hifens', "error" => true];
        }
        // $cep = str_replace('-', "", $cep);

        return json_encode($msg);
    }

    public function setAddress(array $data)
    {
        $inputs = [
            "cep",
            "logradouro",
            "complemento",
            "bairro",
            "localidade",
            "uf",
            "ibge",
            "gia",
            "ddd",
            "siafi",
        ];

        if (!$this->isExists($inputs, $data)) {
            return json_encode("Campos do endereço não informados!");
        }

        if (empty($data["cep"])) {
            return json_encode("O campo CEP não pode ser vazio!");
        }

        $address = new Address();

        $value = $address->create(array_filter($data));

        if ($value) {
            return json_encode("Endereço cadastrado!");
        } else {
            return json_encode("Desculpe, tivemos um erro inesperado, por favor tente mais tarde!");
        }
    }

    function isExists(array $key, ?array $data)
    {
        $notExist = array_diff($key, array_keys($data));

        if ($notExist) return false;

        return true;
    }
}
