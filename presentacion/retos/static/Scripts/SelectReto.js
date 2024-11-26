function selectReto(id) {
    
    fetch('selectReto/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: id}),
    })
    .then(response => {
        window.location.href = "reto/";
    })
    .then(data => {
    })
    .catch(error => {
    });

}