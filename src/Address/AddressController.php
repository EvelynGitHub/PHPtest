<?php

namespace App\Address;


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
                    $address = new Address();

                    $value = $address->findByCep($cep);

                    if ($value) {
                        $msg = $value;
                    } else {
                        $msg = "Desculpe, tivemos um erro inesperado, por favor tente mais tarde!";
                    }
                } else {
                    $msg = "A formatação deve seguir o formato '12345-123'";
                }
            } else {
                $msg = "Número de digitos inválido";
            }
        } else {
            $msg = 'Só é permitido números e hifens';
        }
        // $cep = str_replace('-', "", $cep);

        return json_encode($msg);
    }

    public function setAddress(array $data)
    {
        // var_dump($data);
        // return json_encode($data);

        // die;

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
