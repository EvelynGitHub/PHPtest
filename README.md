# PHPTeste

<center>

![Imagem de capa](https://github.com/EvelynGitHub/assets-readme/blob/main/PHPtest/home.png)

</center>
<center>

![GitHub](https://img.shields.io/github/license/EvelynGitHub/assets-readme)

</center>

# Sobre o Projeto:

Este projeto foi utilizado como teste técnico para o processo seletivo da empresa CD2 Serviços em Tecnologia da Informação Ltda.

Sendo este, um serviço para recuperar endereço apartir de CEP.

### Objetivo

O objetivo é consultar uma API que, ao informar um CEP válido, retorna dados do endereço.

Esses dados ser gravados num banco local e devem vir no formato XML.

Quando uma nova consulta for feita, devesse primeiro olhar o **banco local** e trazer os demais dados, apenas se o CEP **não** existir no **banco local** uma nova consulta na API deve ser feita.

## Layout Web

![Imagem de web](https://github.com/EvelynGitHub/assets-readme/blob/main/PHPtest/home.png)

## Modelo conceitual

### Diagrama de Classes

Não achei necessário um diagrama de Classes para este projeto.
### MER

![Modelo de Entidade e Relacionamento](https://github.com/EvelynGitHub/PHPtest/blob/master/docs/PHPTeste-model.png)

# Tecnologias utilizadas:

## Back end

- PHP
- Composer
- Docker

## Front end

- HTML / CSS / JS 
- Bootstrap

## Dados

- Banco de dados: MySql

# Por onde começar:

## Utilizando Docker

Pré-requisitos: Docker e composer

Em um terminal...

```bash
# clonar repositório
git clone https://github.com/EvelynGitHub/PHPtest.git

# entrar na pasta do projeto 
cd PHPtest

# baixar os pacotes do PHP com composer
composer install

# Executar o docker
docker-compose up -d
# Or caso precise ser root
sudo docker-compose up -d
```

Depois de executar os passos acima, abra um navegador e acesse <a>http://localhost/<a> ou 
<a>http://localhost/view<a>. A tela princial (a única tela na verdade), deve aparece. Agora você já pode teste a aplicação. 

**Obs.:** Caso o sistema não funcione de primeira, pode ser que o docker ainda esteja <i>se preparando</i>, então espere mais um pouco antes de tentar de novo.

Depois de testar você pode querer parar o conatiner docker, para isso:
```bash
# Parar o docker
docker-compose down
# Or caso precise ser root
sudo docker-compose down
```

## Utilizando Lampp/Xampp

Pré-requisitos: Lampp/Xampp com PHP7+ e composer

1 - Em um terminal...

```bash
# Navegue até a pasta htdocs do Lampp/Xampp
# Linux 
cd /opt/lampp/htdocs

# Windows 
cd /xampp/htdocs

# clonar repositório
git clone https://github.com/EvelynGitHub/PHPtest.git

# entrar na pasta do projeto 
cd PHPtest

# baixar os pacotes do PHP com composer
composer install

```

2 - Agora você precisa iniciar o Lampp/Xampp e ativar os serviços do APACHE e MySQL.

3 - Será necessário criar o banco e a tabela, para isso:
  - Acesse: <a>http://localhost/phpmyadmin<a>
  - Execute o script abaixo:
  ```sql
    CREATE DATABASE phptest;
    USE phptest;

    CREATE TABLE IF NOT EXISTS phptest.address (
      cep VARCHAR(9) NOT NULL,
      logradouro VARCHAR(100) NULL,
      complemento VARCHAR(150) NULL,
      bairro VARCHAR(100) NULL,
      localidade VARCHAR(50) NULL,
      uf VARCHAR(3) NULL,
      ibge VARCHAR(45) NULL,
      gia VARCHAR(45) NULL,
      ddd VARCHAR(45) NULL,
      siafi VARCHAR(45) NULL,
      PRIMARY KEY (cep),
      UNIQUE INDEX cep_UNIQUE (cep ASC))
    ENGINE = InnoDB;

  ```

4 - Agora que o banco já foi criado, entre na pasta do projeto (/htdocs/PHPtest) e abra o arquivo 
<code> env.php </code>. Mude o valor da **Variável de ambiente URL** para ficar de acordo com o seu  Lampp/Xampp, algo similar (ou igual à) <a>http://localhost/PHPtest<a>. Mude também qualquer outra váriavel de acesso ao banco que seja diferente do que está no arquivo.
O Arquivo <code> env.php </code> deve mudar de algo assim:
```php
  <?php
    // Variável de ambiente URL
    putenv("URL=http://localhost");

    putenv("DB_DRIVE=mysql");

    putenv("DB_HOST=db");

    putenv("DB_PORT=3306");

    putenv("DB_NAME=phptest");

    putenv("DB_USER_NAME=root");

    putenv("DB_USER_PASSWD=");
```
Para algo como:
```php
  <?php

    // Variável de ambiente URL
    putenv("URL=http://localhost/PHPtest");

    putenv("DB_DRIVE=mysql");

    putenv("DB_HOST=localhost");

    putenv("DB_PORT=3306");

    putenv("DB_NAME=phptest");

    putenv("DB_USER_NAME=root");

    putenv("DB_USER_PASSWD=");
```

5 - A ultima modificação é no arquivo <code> index.js </code>, dentro de .../PHPtest/view/js/index.js. A modificação vai na primeira linha, ela deve mudar de:
```js
  const urlBase = "http://localhost";
```
Para algo como:
```js
  const urlBase = "http://localhost/PHPtest";
```

6 - Finalmente, pronto! Agora é só acessar no seu navegador <a>http://localhost/PHPtest<a> ou
<a>http://localhost/PHPtest/view<a> e testar.
# Como começar a usar:

Basta digitar o CEP no campo... CEP. As mensagens vão aparecer num alert do bootstrap na parte 
superior da tela para saber o que está acontecendo.

No cabeçalho pode ter mais algumas informações úteis, mas não fazem parte lógica do site.
# Autor(es)

**Evelyn Francisco Brandão**

https://www.linkedin.com/in/evelyn-brandão

