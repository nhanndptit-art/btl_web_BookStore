function loadComponent(elementId, filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Không thể tải ${filePath}`);
            }
            return response.text(); 
        })
        .then(htmlData => { //arow function
            document.getElementById(elementId).innerHTML = htmlData;
        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
}

document.addEventListener("DOMContentLoaded", () => {
    loadComponent("header-placeholder", "header.html");
    loadComponent("footer-placeholder", "footer.html");
});