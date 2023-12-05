// Cart Buttons

const cart = document.getElementById('cart');
const cartOpenButton = document.getElementById('openCart');
const cartTitle = document.querySelector('.cart_title');
const cartCloseButton = document.getElementById('closeCart');

cartOpenButton.onclick = function () {
    cart.classList.add('cart-open');
}

cartCloseButton.onclick = function () {
    cart.classList.remove('cart-open');
}

cartTitle.addEventListener('click', function() {
    cart.classList.remove('cart-open');
})

// Render Products based on selected category

const categoryButtons = document.querySelectorAll('.category_button');
const productsContainer = document.getElementById('productsContainer');

async function getProducts () {

    const selectedCategory = document.querySelector('.category_selected');
    const response = await fetch(`./products/${selectedCategory.dataset.category}.json`);

    productsArray = await response.json();

    productsContainer.innerHTML = "";

    renderProducts(productsArray, selectedCategory);
}

function renderProducts (productsArray, selectedCategory) {

    const categoryName = document.querySelector('.category_name');
    categoryName.innerHTML = "";
    categoryName.insertAdjacentHTML('beforeend', selectedCategory.textContent)

    if (productsArray.length === 0) {
        const productHTML = `<h1 class="no-products_message">Здесь пока ничего нет <nobr>:(</nobr></h1>`;
        productsContainer.insertAdjacentHTML('beforeend', productHTML)
    } else {
        productsArray.forEach(function (item) {
            const productHTML = `
            <div id="${item.id}" class="product_card">
                <div class="card_product-image">
                    <img src="./img/products/${selectedCategory.dataset.category}/${item.image}" alt="${item.name}">
                </div>
                <p class="product_price card_product-price">${item.price}</p>
                <p class="card_product-name">${item.name}</p>
                <div class="spacer"></div>
                <span class="card_product-weight">${item.weight}</span>
                <button class="button add-button">Добавить</button>
            </div>`;

            productsContainer.insertAdjacentHTML('beforeend', productHTML);
        })
    };
}

categoryButtons.forEach(function(categoryButton) {

    categoryButton.addEventListener("click", function() {

        categoryButtons.forEach(function(categoryButton){
            categoryButton.classList.remove('category_selected');
            categoryButton.disabled = false;
        })

        this.classList.add('category_selected');
        this.disabled = true;

        getProducts();
    });
});

getProducts();