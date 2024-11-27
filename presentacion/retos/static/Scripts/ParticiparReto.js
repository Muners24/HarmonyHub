function participarReto() {
    
    const tbTitulo = document.getElementById('tbTitulo');
    const tbComposito = document.getElementById('tbCompositor');

    let data = {
        'titulo' : tbTitulo.value,
        'compositor' : tbComposito.value,
        'notacion' : editor.getData()
    }

    fetch('/retos/participarReto/', {
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