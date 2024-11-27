

function selectCategoria(categoria){

    
    const tbTitulo = document.getElementById('tbTitulo');
    const tbComposito = document.getElementById('tbCompositor');

    let data = {
        'categoria' : categoria,
    }

    fetch('/buscar/selectCategoria/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            window.location.href = "/inicio/";
        })
        .then(data => {
        })
        .catch(error => {
        });

}