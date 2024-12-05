document.getElementById('preview-container').addEventListener('click', function() {
    document.getElementById('foto').click(); 
});

document.getElementById('foto').addEventListener('change', function(event) {
    const file = event.target.files[0]; 

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewImage = document.getElementById('preview-image');
            const placeholderText = document.getElementById('placeholder-text');
            previewImage.src = e.target.result;
            previewImage.style.display = 'block'; 
            placeholderText.style.display = 'none'; 
        };
        reader.readAsDataURL(file); 
    }
});