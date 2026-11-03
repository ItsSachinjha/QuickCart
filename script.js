
// Get data from Local Storage
let cart = JSON.parse(localStorage.getItem("quickCart")) || [];
let wishlist = JSON.parse(localStorage.getItem("quickWishlist")) || [];


// Save Cart
function saveCart() {
    localStorage.setItem("quickCart", JSON.stringify(cart));
    updateCartCount();
}


// Save Wishlist
function saveWishlist() {
    localStorage.setItem("quickWishlist", JSON.stringify(wishlist));
    updateWishlistCount();
}


// Get Product Details
function getProductDetails(productId, type) {

    const button = document.querySelector(
        `[onclick="${type}(${productId})"]`
    );

    if (!button) return null;

    const card = button.closest(".card");

    if (!card) return null;

    return {
        id: productId,
        name: card.querySelector(".card-title")?.innerText || "Product",
        price: card.querySelector(".text-success")?.innerText ||
               card.querySelector(".card-text")?.innerText || "",
        image: card.querySelector("img")?.src || ""
    };
}


// Add to Cart
function addToCart(productId) {

    const product = getProductDetails(productId, "addToCart");

    if (!product) {
        showNotification("Product not found");
        return;
    }

    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    showNotification("Product added to cart");
}


// Add to Wishlist
function addToWishlist(productId) {

    const product = getProductDetails(productId, "addToWishlist");

    if (!product) {
        showNotification("Product not found");
        return;
    }

    const exists = wishlist.some(item => item.id === productId);

    if (exists) {
        showNotification("Product already in wishlist");
        return;
    }

    wishlist.push(product);

    saveWishlist();
    showNotification("Product added to wishlist");
}


// Update Cart Count
function updateCartCount() {

    const cartCount = document.getElementById("cartCount");

    const total = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    if (cartCount) {
        cartCount.innerText = total;
    }
}


// Update Wishlist Count
function updateWishlistCount() {

    const wishlistCount = document.getElementById("wishlistCount");

    if (wishlistCount) {
        wishlistCount.innerText = wishlist.length;
    }
}


// Remove from Cart
function removeFromCart(productId) {

    cart = cart.filter(item => item.id !== productId);

    saveCart();
    showNotification("Product removed from cart");
}


// Remove from Wishlist
function removeFromWishlist(productId) {

    wishlist = wishlist.filter(item => item.id !== productId);

    saveWishlist();
    showNotification("Product removed from wishlist");
}


// Show Notification
function showNotification(message) {

    let notification = document.getElementById("quickCartToast");

    if (!notification) {

        notification = document.createElement("div");
        notification.id = "quickCartToast";

        notification.style.cssText = `
            position: fixed;
            top: 85px;
            right: 20px;
            background: #198754;
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            z-index: 2000;
        `;

        document.body.appendChild(notification);
    }

    notification.innerText = message;
    notification.style.display = "block";

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(function () {
        notification.style.display = "none";
    }, 2000);
}


// Initialize
document.addEventListener("DOMContentLoaded", function () {

    updateCartCount();
    updateWishlistCount();

});
