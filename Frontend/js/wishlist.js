let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
function addToWishlist(product) {
    if (!wishlist.some(item => item.id === product.id)) {
        wishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        if(window.showToast) window.showToast(`${product.name} has been added to wishlist!`, 'success');
        updateWishlistBadge();
        displayWishlist();
    } else{
        if(window.showToast) window.showToast(`${product.name} is already in wishlist!`, 'warning');
    }
}

function removeFromWishlist(id, isSilent = false){
    wishlist = wishlist.filter(item => item.id !== id);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    displayWishlist();
    updateWishlistBadge();
    if(!isSilent && window.showToast) window.showToast(`Item has been removed from wishlist!`, 'remove');
}

function updateWishlistBadge() {
    let badge =document.getElementById('wishlistBadge') || document.querySelector('.header-action[href="wishlist.html"] ~ .badge');
    if (badge) badge.innerText = wishlist.length;
}
function displayWishlist(){
    const container = document.getElementById('wishlist-container');
    const template = document.getElementById('wishlist-item-template');
    if (!container || !template) return;
    container.innerHTML = '';
    if (wishlist.length === 0) {
        container.innerHTML =`
            <div class="empty-state">
                <h3 class="empty-title">Wishlist is empty :3</h3>
                <p class="empty-desc">You haven't added any products to your wishlist yet. Start shopping and add your favorite items!</p>
                <a href="index.html" class="btn-continue-shopping">Continue Shopping</a>
            </div>
        `;
        return;
    }
    wishlist.forEach(product => {
        const clone = template.content.cloneNode(true);
        const imgEl = clone.querySelector('.wishlist-item-img');
        imgEl.src = product.image;
        imgEl.alt = product.name;
        clone.querySelector('.item-title').textContent = product.name;
        clone.querySelector('.item-price').textContent = `$${parseFloat(product.price).toFixed(2)}`;
        clone.querySelector('.btn-add-cart').addEventListener('click', () => moveToCart(product.id));
        clone.querySelector('.btn-remove-wishlist').addEventListener('click', () => removeFromWishlist(product.id));
        container.appendChild(clone);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    displayWishlist();
    let attempts = 0;
    const checkInt = setInterval(() => {
        let badge= document.getElementById('wishlistBadge') || document.querySelector('.header-action[href="wishlist.html"] ~ .badge');
        if(badge || attempts > 50){
            if(badge) updateWishlistBadge();
            clearInterval(checkInt);
        }
        attempts++;
    },100);
});