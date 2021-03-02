const urlBase = "http://localhost"

console.log("Carregando js...")

let inputCep = document.getElementById("cep")
let inputLocalidade = document.getElementById("localidade")
let inputBairro = document.getElementById("bairro")
let inputLogradouro = document.getElementById("logradouro")
let inputEstado = document.getElementById("estado")
let inputIbge = document.getElementById("ibge")
let inputDDD = document.getElementById("ddd")
let inputGIA = document.getElementById("gia")
let inputSiafi = document.getElementById("siafi")
let inputComplemento = document.getElementById("complemento")

let messageArea = document.getElementById("message")

let btnSearch = document.getElementById("search")


btnSearch.addEventListener("click", function (e) {
    e.preventDefault();

    if (inputCep.value.trim() == "") {
        message("danger", "o campo CEP não pode estar vazio.")
        return
    }

    // Varifica se existe esse cep na base de dados
    let hasInBD = convertInObject(findCepInDB(inputCep.value));

    console.log("Existe esse cep no BD: ", !hasInBD.search_api)

    // Se existir no banco trago os dados de lá
    if (!hasInBD.error && !hasInBD.search_api) {
        console.log("Buscando no Banco de Dados");
        message("primary", "Preenchendo os campos com os valores do Banco de Dados.")
        fillInputs(hasInBD.msg)

    } else if (hasInBD.error) {
        message("danger", hasInBD.msg)
        clearInputs();
        return
    } else {
        //Se não existir no banco
        //busco na API 
        let hasInAPI = (findCepInViaCep(inputCep.value));

        console.log("Deveria salvar no banco ?");
        if (!("erro" in hasInAPI)) {
            console.log("Sim, deveria, pois não tem erro");
            addInBD(hasInAPI);
            message("primary", "Preenchendo os campos com os valores do ViaCEP.")
            fillInputs(hasInAPI);
        } else {
            console.log("Não, não deveria, não foi encontrado o CEP na API");

            message("warning", "Sinto muito, não encontramos o CEP que procura!");
            clearInputs();
            return
        }


    }

})

function findCepInDB(cep) {
    let hasInBD = false;

    ajax({
        method: "GET",
        url: urlBase + "/" + cep,
        assinc: false,
        data: null,
        dataType: null,
        success(e) {
            // console.log(e)
            hasInBD = e;
        },
        error(e) {
            console.log(e);
            hasInBD = false;
        },
    });

    return hasInBD;
}

function findCepInViaCep(cep) {
    let data = false;
    cep = cep.replace('-', '');

    ajax({
        method: "GET",
        url: `http://viacep.com.br/ws/${cep}/xml/`,
        assinc: false,
        data: null,
        dataType: null,
        success(e) {
            data = convertInObject(e, true);
        },
        error(e) {
            console.log(e);
            data = false;
        },
    });

    return data;
}

function addInBD(obj) {
    let params = prepareData(obj)

    ajax({
        method: "POST",
        url: urlBase + "/cep",
        assinc: true,
        data: params,
        dataType: true,
        success(e) {
            console.log(e);
        },
        error(e) {
            console.log(e);
        },
    });

}

function convertInObject(params, api = false) {
    if (api) {
        return JSON.parse(xml2json(params));
    }

    return JSON.parse(params);
}


function message(cor, message) {
    // alert(message)

    messageArea.innerHTML = `
        <div id="alert-message" class="alert alert-${cor} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>`;
}

function fillInputs(obj) {
    clearInputs();
    inputLocalidade.value = obj.localidade;
    inputCep.value = obj.cep;
    inputBairro.value = obj.bairro;
    inputLogradouro.value = obj.logradouro;
    inputEstado.value = obj.uf;
    inputIbge.value = obj.ibge;
    inputDDD.value = obj.ddd;
    inputGIA.value = obj.gia;
    inputSiafi.value = obj.siafi;
    inputComplemento.value = obj.complemento;
}

function clearInputs() {
    inputLocalidade.value = '';
    inputCep.value = ''
    inputBairro.value = ''
    inputLogradouro.value = ''
    inputEstado.value = ''
    inputIbge.value = ''
    inputDDD.value = ''
    inputGIA.value = ''
    inputSiafi.value = ''
    inputComplemento.value = ''
}


function prepareData(data) {
    if (typeof data == 'string') return data;
    var pairs = Object.keys(data).map(function (key) {
        return [key, data[key]].map(encodeURIComponent).join('=');
    }).join('&');

    return pairs;
}


function ajax(params) {

    const xhr = new XMLHttpRequest();

    xhr.open(params.method, params.url, params.assinc);
    // xhr.open(params.method, params.url);

    if (params.dataType) {
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        // xhr.setRequestHeader("Content-type", "multipart/form-data");
    }


    xhr.onreadystatechange = () => {

        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                params.success(xhr.responseText);
            } else {
                params.error(xhr.responseText);
            }

        }

    };


    if (params.method == "POST") {
        xhr.send((params.data));
        // xhr.send("a=19&b=24");
    } else {
        xhr.send();
    }


}


function xml2json(xmlDoc) {

    parser = new DOMParser();
    xmlDoc = parser.parseFromString(xmlDoc, "text/xml");

    let xml = xmlDoc.getElementsByTagName("xmlcep")[0];

    let json = "{";

    for (let i = 0; i < xml.children.length; i++) {
        json += `"${xml.children[i].tagName}": "${xml.children[i].textContent}",`;
    }

    json = json.replace(/,\s*$/, "");

    json += "}";


    return (json);
}