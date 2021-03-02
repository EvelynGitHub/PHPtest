const urlBase = "http://localhost"

console.log("Carreando js...")

let inputCep = document.getElementById("cep")

document.getElementById("search").addEventListener("click", function (e) {
    e.preventDefault();
    console.log("Foi clicado")

    console.log("CEP pesquisado: " + inputCep.value);

    // Varifica se existe esse cep na base de dados
    let hasInBD = findCepInDB(inputCep.value);

    console.log("Existe esse cep no BD: ", hasInBD)

    // Se existir no banco trago os dados de lá
    if (hasInBD) {
        console.log("Dados do Banco");
        console.log(hasInBD);
    } else {//Se não existir no banco
        //busco na API 
        let hasInAPI = findCepInViaCep(inputCep.value);
        console.log(JSON.parse(hasInAPI));

        if (hasInAPI) {
            // salvo o resultado no banco
            addInBD(JSON.parse(hasInAPI));

        } else {
            // caso não tenha valor na API
            console.log("Não tem valor");
        }


    }

})

function findCepInDB(cep) {
    let hasInBD = false;

    ajax({
        method: "GET",
        url: urlBase + "/" + cep,
        assinc: true,
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
        url: `http://viacep.com.br/ws/${cep}/json/`,
        assinc: false,
        data: null,
        dataType: null,
        success(e) {
            // console.log(e)
            data = e;
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
            console.log(e)
        },
        error(e) {
            console.log(e);
        },
    });

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

