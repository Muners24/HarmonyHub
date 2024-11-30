document.getElementById('tbBuscar').addEventListener('keydown',function(event){
    if(event.key === 'Enter'){
        document.getElementById('buscar').click();
    }
})

function buscar(categoria) {
    const tbBuscar = document.getElementById('tbBuscar');
    
    let data = {
        'texto': tbBuscar.value,
        'categoria': categoria
    }

    fetch('/buscador/query/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            window.location.href = "/buscador/buscar/";
        })
        .then(data => {
        })
        .catch(error => {
        });
}

function verPerfil(idUsuario){

    let data = {
        'idUsuario': idUsuario,
    }


    fetch('/buscador/verPerfil/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            window.location.href = "/perfil/perfiles/";
        })
        .then(data => {
        })
        .catch(error => {
        });

}