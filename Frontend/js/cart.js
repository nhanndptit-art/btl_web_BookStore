let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    if(window.showToast) window.showToast(`${product.name} has been added to the cart!`, 'success');
    updateCartBadge();
    displayCart();
}

function moveToCart(productId) {
    let currentWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const productToMove = currentWishlist.find(item => item.id === productId);
    if (productToMove) {
        addToCart(productToMove);
        if (typeof removeFromWishlist === 'function') {
            removeFromWishlist(productId, true); 
        }
    }
}

function updateCartBadge() {
    const cartBadge = document.querySelector('.header-action[href="cart.html"] ~ .badge');
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.innerText = totalItems;
    }
}

function displayCart() {
    const container = document.getElementById('cart-items-list');
    const itemTemplate = document.getElementById('cart-item-template');
    const emptyTemplate = document.getElementById('cart-empty-template');
    const cartHeader = document.getElementById('cart-header');
    const cartSummary = document.getElementById('cart-summary-container');
    if (!container || !itemTemplate || !emptyTemplate) return; 
    container.innerHTML = '';
    if (cart.length === 0) {
        if(cartHeader) cartHeader.style.display = 'none';
        if(cartSummary) cartSummary.style.display = 'none';
        const emptyClone = emptyTemplate.content.cloneNode(true);
        container.appendChild(emptyClone);
        return;
    }
    if(cartHeader) cartHeader.style.display = 'grid'; 
    if(cartSummary) cartSummary.style.display = 'block'; 
    cart.forEach(item => {
        const clone = itemTemplate.content.cloneNode(true);
        const imgEl = clone.querySelector('.cart-item-img');
        imgEl.src = item.image;
        imgEl.alt = item.name;
        
        clone.querySelector('.cart-item-name').textContent = item.name;
        clone.querySelector('.cart-item-qty').textContent = item.quantity;
        
        const price = parseFloat(item.price);
        const itemTotal = price * item.quantity;
        clone.querySelector('.col-price').textContent = `$${price.toFixed(2)}`;
        clone.querySelector('.col-total').textContent = `$${itemTotal.toFixed(2)}`;
        clone.querySelector('.btn-decrease').addEventListener('click', () => changeQuantity(item.id, -1));
        clone.querySelector('.btn-increase').addEventListener('click', () => changeQuantity(item.id, 1));
        clone.querySelector('.btn-remove-cart').addEventListener('click', () => removeFromCart(item.id));
        container.appendChild(clone);
    });
    updateCartTotals();
}

function changeQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return; 
    const newQty = Math.max(1, item.quantity + delta);
    if (item.quantity !== newQty) {
        item.quantity = newQty;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartBadge();
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartBadge();
    if(window.showToast) window.showToast('Product has been removed from cart!', 'remove');
}

function updateCartTotals() {
    const subtotalEl = document.getElementById('cart-subtotal');
    const vatEl = document.getElementById('cart-vat');
    const totalEl = document.getElementById('cart-total');
    if (!subtotalEl || !totalEl) return;
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const vat = subtotal * 0.1;
    const total = subtotal + vat;
    
    subtotalEl.innerText = `$ ${subtotal.toFixed(2)}`;
    if (vatEl) vatEl.innerText = `$ ${vat.toFixed(2)}`;
    totalEl.innerText = `$ ${total.toFixed(2)}`;
}

function checkout() {
    if (cart.length === 0) {
        if (window.showToast) window.showToast('Your cart is empty!', 'warning');
        return;
    }
    const checkoutBtn = document.querySelector('.btn-checkout-bottom');
    if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Processing...';
    }
    try {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const vat = subtotal * 0.1;
        const total = subtotal + vat;
        const orderId = 'ORD-' + Date.now().toString().slice(-6);
        const orderDate = new Date().toLocaleString('vi-VN');
        const newOrder = {
            id: orderId,
            date: orderDate,
            items: [...cart],
            total: total.toFixed(2),
            status: 'Đang xử lý'
        };
        let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
        orderHistory.unshift(newOrder); 
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartBadge();
        if (window.showToast) {
            window.showToast('Order placed successfully! Redirecting...', 'success');
        }
        setTimeout(() => {
            window.location.href = 'order.html'; 
        }, 2000);
    } catch (error) {
        console.error("Error during checkout:", error);
        if (window.showToast) {
            window.showToast('Has an error occurred during checkout. Please try again.', 'remove');
        }
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
            checkoutBtn.innerHTML = 'Checkout';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayCart();
    let attempts = 0;
    const checkInt = setInterval(() => {
        const badge = document.querySelector('.header-action[href="cart.html"] ~ .badge');
        if(badge || attempts > 50){
            if(badge) updateCartBadge();
            clearInterval(checkInt);
        }
        attempts++;
    }, 100);
});