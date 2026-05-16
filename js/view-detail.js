
document.addEventListener('DOMContentLoaded', () => {
    
    const actionButtons = document.querySelectorAll('.view-detail-btn');

    actionButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();

            const productCard = this.closest('.product-card');

            if (productCard) {
                const detailLink = productCard.querySelector('a.card-title');

                if (detailLink && detailLink.href) {
                    window.location.href = detailLink.href;
                } else {
                    console.error('Không tìm thấy đường dẫn cho sản phẩm này.');
                }
            }
        });
    });
});