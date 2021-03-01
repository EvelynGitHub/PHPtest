<?php

namespace App\Address;

use App\SimpleCrudPhp\Crud;

class Address extends Crud
{
    public function create(array $data)
    {
        $crud = $this->insert("address", $data)->execute();

        return $crud;
    }

    public function findByCep(string $cep)
    {
        $crud = $this->select()->from("address")->where("cep = ?", [$cep]);

        return $crud;
    }
}
