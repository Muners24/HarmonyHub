function buscar(categoria) {
    const tbBuscar = document.getElementById('tbBuscar');
    
    alert(tbBuscar.value);
    alert(categoria);

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