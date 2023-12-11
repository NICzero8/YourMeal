// Cart Buttons

const cart = document.getElementById("cart");
const cartOpenButton = document.getElementById("openCart");
const cartTitle = document.querySelector(".cart_title");
const cartCloseButton = document.getElementById("closeCart");

cartOpenButton.onclick = function () {
  cart.classList.add("cart-open");
};

cartCloseButton.onclick = function () {
  cart.classList.remove("cart-open");
};

cartTitle.addEventListener("click", function () {
  cart.classList.remove("cart-open");
});


// Render Products based on selected category

const categoryButtons = document.querySelectorAll(".category_button");
const productsContainer = document.getElementById("productsContainer");

async function getProducts() {
  const response = await fetch(`./products/products.json`);

  productsArray = await response.json();
  return productsArray;
}

async function renderProducts() {
  const selectedCategory = document.querySelector(".category_selected");
  const categoryName = document.querySelector(".category_name");

  categoryName.innerHTML = "";
  categoryName.insertAdjacentHTML("beforeend", selectedCategory.textContent);

  productsContainer.innerHTML = "";

  await getProducts();

  productsArray.forEach(function (item) {
    if (item.category === selectedCategory.dataset.category) {
      const productHTML = `
            <div data-id="${item.id}" class="product_card">
                <div class="card_product-image">
                    <img src="./img/products/${item.category}/${item.image}" alt="${item.name}">
                </div>
                <p class="product_price card_product-price">${item.price}</p>
                <p class="card_product-name">${item.name}</p>
                <div class="spacer"></div>
                <span class="card_product-weight">${item.weight}</span>
                <button class="button add-button">Добавить</button>
            </div>`;
      productsContainer.insertAdjacentHTML("beforeend", productHTML);
    }
  });

  if (productsContainer.innerHTML === "") {
    const productHTML = `<h1 class="no-products_message">Здесь пока ничего нет <nobr>:(</nobr></h1>`;
    productsContainer.insertAdjacentHTML('beforeend', productHTML);
  }
}


// Rendering products at page load

renderProducts();


// Selecting category

categoryButtons.forEach(function (categoryButton) {

  categoryButton.addEventListener("click", function () {

    categoryButtons.forEach(function (categoryButton) {
      categoryButton.classList.remove("category_selected");
      categoryButton.disabled = false;
    });

    this.classList.add("category_selected");
    this.disabled = true;

    renderProducts();
  });
});


// Open product information modal window

window.addEventListener("click", function (event) {
  if (event.target.closest(".product_card")) {
    const selectedCard = event.target.closest(".product_card");
    showProductInfo(selectedCard);
  }
});

function showProductInfo(selectedCard) {
  const selectedProduct = productsArray.find(
    (product) => product.id == selectedCard.dataset.id
  );

  let ingridientsHTML = '';

  console.log(selectedProduct);

// Make Ul from ingridiens array
  selectedProduct.ingridients.forEach((item) => {
    ingridientsHTML = `${ingridientsHTML} <li>${item}</li>`;
  })

  const productHTML = `<div id="modal" class="modal">
    <div class="modal_window">
        <button id="closeModal" class="close-button"></button>

        <div class="product-info_wrapper">
                
            <h2 class="product_title">${selectedProduct.name}</h2>

            <div class="product-details_wrapper">

                <div class="product-details_left-wrapper">

                    <div class="product_image">
                        <img src="./img/products/${selectedProduct.category}/${selectedProduct.image}" alt="Мясная бомба">
                    </div>

                </div>

                <div class="product-details_right-wrapper">

                    <p class="product_description">${selectedProduct.description}</p>

                    <div class="ingridients_wrapper">
                        <h4>Состав:</h4>
                        <ul class="igridient_list">
                            ${ingridientsHTML}
                        </ul>
                        <p class="nutritional-value">
                            <span class="product-weight">${selectedProduct.weight}</span>
                            <span class="product-energy">${selectedProduct.energy}</span>
                        </p>
                    </div>

                </div>

            </div>

            <div class="product-info_buttons-wrapper">

                <button class="button add-button product-info_add-button">Добавить</button>

                <div class="product-quantity_wrapper">
                    <div class="quantity_buttons product-info_quantity-buttons">
                        <button class="minus-button">-</button>
                        <p class="quantity-counter">${selectedProduct.quantity}</p>
                        <button class="plus-button">+</button>
                    </div>

                    <p class="product_price">${selectedProduct.price}</p>
                </div>

        </div>

    </div>

    </div>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", productHTML);
  document.getElementById("closeModal").onclick = function () {
    document.getElementById("modal").remove();
  };
};