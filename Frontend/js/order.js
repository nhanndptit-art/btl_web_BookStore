document.addEventListener('DOMContentLoaded', () => {
    displayOrderHistory();
});

function displayOrderHistory() {
    const container = document.getElementById('order-container');
    const emptyTemplate = document.getElementById('order-empty-template');
    const cardTemplate = document.getElementById('order-card-template');
    const itemTemplate = document.getElementById('history-item-template');
    const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
    if (!container || !emptyTemplate || !cardTemplate || !itemTemplate) return;
    container.innerHTML = '';
    
    if (orderHistory.length === 0) {
        const emptyClone = emptyTemplate.content.cloneNode(true);
        container.appendChild(emptyClone);
        return;
    }
    orderHistory.forEach(order => {
        const clone = cardTemplate.content.cloneNode(true);
        clone.querySelector('.order-id').textContent = `ID: ${order.id}`;
        clone.querySelector('.order-date').textContent = `Time: ${order.date}`;
        clone.querySelector('.order-total-price').textContent = `$${order.total}`;
        const itemsListContainer = clone.querySelector('.order-items-list');
        
        order.items.forEach(item => {
            const itemClone = itemTemplate.content.cloneNode(true);
            const imgEl = itemClone.querySelector('.history-item-img');
            imgEl.src = item.image;
            imgEl.alt = item.name;
            itemClone.querySelector('.history-item-name').textContent = item.name;
            itemClone.querySelector('.history-item-qty').textContent = `x${item.quantity}`;
            itemClone.querySelector('.history-item-price').textContent = `$${(item.price * item.quantity).toFixed(2)}`;

            itemsListContainer.appendChild(itemClone);
        });
        container.appendChild(clone);
    });
}