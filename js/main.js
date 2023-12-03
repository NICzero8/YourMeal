const cart = document.getElementById("cart");
const cartOpenButton = document.getElementById("openCart");
const cartCloseButton = document.getElementById("closeCart");

cartOpenButton.onclick = function () {
    cart.classList.add('cart-open')
}

cartCloseButton.onclick = function () {
    cart.classList.remove('cart-open')
}

