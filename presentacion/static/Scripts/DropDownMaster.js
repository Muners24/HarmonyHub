document.addEventListener('DOMContentLoaded',function () {
    let items = document.querySelectorAll('.dropdown-container-down');
    items.forEach(item => {
        item.style.display = 'none';
    });
});

function toggleDD(id){

    let element = document.getElementById(id);
    
    alert(id);

    if (element.style.display === 'none'){
        element.style.display = '';
        return;
    }

    element.style.display = 'none';

}
