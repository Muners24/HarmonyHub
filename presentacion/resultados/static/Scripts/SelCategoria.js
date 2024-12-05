function selCategoria(categoria) {
    
    let data = {'categoria': categoria}


    fetch('/resultados/selCategoria/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            window.location.href = "/resultados/categoria/";
        })
        .then(data => {
        })
        .catch(error => {
        });
}