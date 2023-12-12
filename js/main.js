// Mobile cart buttons

const cartElement = document.getElementById("cart");
const cartOpenButton = document.getElementById("openCart");
const cartTitle = document.querySelector(".cart_title");
const cartCloseButton = document.getElementById("closeCart");

cartOpenButton.onclick = function () {

  cartElement.classList.add("cart-open");

};

cartCloseButton.onclick = function () {

  cartElement.classList.add('cart-close');

  setTimeout(function() {
    
    cartElement.classList.remove('cart-open');
    cartElement.classList.remove('cart-close');   

  }, 100);

};

cartTitle.addEventListener('click', function () {

  cartElement.classList.add('cart-close');

  setTimeout(function() {
    
    cartElement.classList.remove('cart-open');
    cartElement.classList.remove('cart-close');   

  }, 100);

});


// Render Products based on selected category

const categoryButtons = document.querySelectorAll(".category_button");
const productsContainer = document.getElementById("productsContainer");

async function getProducts() {

  const response = await fetch(`./products/products.json`);

  productsArray = await response.json();
  return productsArray;

};

async function renderProducts() {

  const selectedCategory = document.querySelector(".category_selected");
  const categoryName = document.querySelector(".category_name");

  categoryName.innerHTML = "";
  categoryName.insertAdjacentHTML("beforeend", selectedCategory.textContent);

  productsContainer.innerHTML = "";

  await getProducts();

  productsArray.forEach(function (product) {

    if (product.category === selectedCategory.dataset.category) {

      const productHTML = `
            <div data-id="${product.id}" class="product_card">
                <div class="card_product-image">
                    <img src="./img/products/${product.category}/${product.image}" alt="${product.name}">
                </div>
                <p class="product_price card_product-price">${product.price}</p>
                <p class="card_product-name">${product.name}</p>
                <div class="spacer"></div>
                <span class="card_product-weight">${product.weight}</span>
                <button class="button add-button">Добавить</button>
            </div>`;
      productsContainer.insertAdjacentHTML("beforeend", productHTML);

    }

  });

  if (productsContainer.innerHTML === "") {
    const productHTML = `<h1 class="no-products_message">Здесь пока ничего нет <nobr>:(</nobr></h1>`;
    productsContainer.insertAdjacentHTML('beforeend', productHTML);
  }

};


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

  if (event.target.closest(".product_card") && !event.target.classList.contains('add-button')) {
    const selectedCard = event.target.closest(".product_card");
    showProductInfo(selectedCard);
  }

});

function showProductInfo(selectedCard) {

  const selectedProduct = productsArray.find((product) => product.id == selectedCard.dataset.id);

  document.body.classList.add('no-scroll');

  let ingridientsHTML = '';

  // Make Ul from ingridiens array

  selectedProduct.ingridients.forEach((item) => {

    ingridientsHTML = `${ingridientsHTML} <li>${item}</li>`;

  })

  const productHTML = `<div id="modal" class="modal">
    <div class="modal_window">
        <button id="closeModal" class="close-button"></button>

        <div data-id="${selectedProduct.id}" class="product-info_wrapper">
                
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

            <div data-id="${selectedProduct.id}" data-modal="true" class="product-info_buttons-wrapper">

                <button class="button add-button product-info_add-button">Добавить</button>

                <div class="product-quantity_wrapper">
                    <div class="quantity_buttons product-info_quantity-buttons">
                        <button data-button="minus" class="minus-button">-</button>
                        <p class="quantity-counter">${selectedProduct.quantity}</p>
                        <button data-button="plus" class="plus-button">+</button>
                    </div>

                    <p class="product_price">${selectedProduct.price}</p>
                </div>

        </div>

    </div>

    </div>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", productHTML);

  document.getElementById("closeModal").onclick = function () {
    closeModal ();
  };

};

function closeModal () {
  document.getElementById("modal").remove();
    document.body.classList.remove('no-scroll');
};


// Cart

const cartItemsContainer = document.querySelector('.cart_items');
const cartCounter = document.querySelectorAll('.cart_counter');
const cartEmptyMessage = document.querySelector('.cart_empty-message');
const cartTotalContainer = document.querySelector('.cart_total_wrapper');
const cartTotalPriceEl = document.querySelector('.cart_total-price');
const cartOrderButton = document.querySelector('[data-button="order"]');
const cartDeliveryMessage = document.querySelector('.cart_delivery-message_wrapper');
const cartFreeDelivery = document.querySelector('.cart_free-delivery');
const cartPaidDelivery = document.querySelector('.cart_paid-delivery');

getCart();

let cart = JSON.parse(localStorage.getItem('cart'));

renderCart ();

function getCart () {
  if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', '[]')
  }
};

function renderCart() {

  let totalQuantity = 0;
  let totalPrice = 0;
  cart = JSON.parse(localStorage.getItem('cart'));
  
  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartEmptyMessage.classList.remove('none');
    cartTotalContainer.classList.add('none');
    cartOrderButton.classList.add('none');
    cartDeliveryMessage.classList.add('none');
    totalQuantity = 0;
  } else {

    cart.forEach(function (product) {

      const cartItemHTML = `<div class="cart_item">
  
        <div class="cart_item_img"><img src="./img/products/${product.category}/${product.image}" alt="${product.name}"></div>
  
        <div class="cart_item_info">
            <p class="cart_product-name">${product.name}</p>
            <span class="cart_product-weight">${product.weight}</span>
            <p class="cart_product-price">${product.price * product.quantity}</p>
        </div>
  
        <div data-id="${product.id}" class="quantity_buttons">
            <button data-button="minus" class="minus-button">-</button>
            <p class="quantity-counter">${product.quantity}</p>
            <button data-button="plus" class="plus-button">+</button>
        </div>
  
      </div>`;
  
      cartItemsContainer.insertAdjacentHTML("beforeend", cartItemHTML);

      totalQuantity = totalQuantity + product.quantity;
      totalPrice = totalPrice + product.price*product.quantity;
  
    })

    cartEmptyMessage.classList.add('none');
    cartTotalContainer.classList.remove('none');
    cartOrderButton.classList.remove('none');
    cartDeliveryMessage.classList.remove('none');

  }

  cartCounter.forEach(function(counter) {

    counter.textContent = totalQuantity;
    counter.classList.add('shake');
    setTimeout(function() {

      counter.classList.remove('shake');

    }, 700)

  });

  if (totalPrice > 599) {
    cartFreeDelivery.classList.remove('none');
    cartPaidDelivery.classList.add('none');
  } else {
    cartFreeDelivery.classList.add('none');
    cartPaidDelivery.classList.remove('none');
    totalPrice=totalPrice + 400;
  }
  
  cartTotalPriceEl.textContent = totalPrice;

};

// Add buttons

window.addEventListener("click", function (event) {

  if (event.target.classList.contains('add-button')) {

    const selectedProduct = productsArray.find((product) => product.id == event.target.parentNode.dataset.id);

    // Check if this button is in product-info modal window:

    if (event.target.parentNode.dataset.modal === 'true') {

      const counterElement = event.target.parentNode.querySelector('.quantity-counter');
      let counter = event.target.parentNode.querySelector('.quantity-counter').textContent;

      while (counter > 0) {
        addToCart(selectedProduct);
        --counter;
      }

      counterElement.textContent = 1;

      closeModal();

    } else {

        addToCart(selectedProduct);

      };

    renderCart ();
  }

});

function addToCart (selectedProduct) {

  // Check if cart is empty

  if (cart.lenght == 0) {

    cart.push(selectedProduct);

  } else {

    // Check if there is the same item in cart already

    let cartItem = cart.find(product => product.id == selectedProduct.id);

    if (cartItem === undefined) {

      cart.push(selectedProduct);

    } else {

      cartIncrease(selectedProduct);

    }
  }

  localStorage.setItem('cart', JSON.stringify(cart));

};

// Quantity buttons

window.addEventListener("click", function (event) {

  // Check if this button is in product-info modal window:

  if (event.target.closest('[data-modal]')) {

    const counter = event.target.parentNode.querySelector('.quantity-counter');

    if (event.target.dataset.button === ('plus')) {
      counter.textContent = ++counter.textContent;
    } else if (event.target.dataset.button === ('minus')) {
      if (parseInt(counter.textContent) > 1) {
        counter.textContent = --counter.textContent;
      }
    }

  } else {
    
    const selectedProduct = cart.find((product) => product.id == event.target.parentNode.dataset.id);

    if (event.target.dataset.button === ('plus')) {

      cartIncrease(selectedProduct);
      renderCart();

    } else if (event.target.dataset.button === ('minus')) {

      cartReduce(selectedProduct);
      renderCart();
    
    }

  };



});

function cartReduce (selectedProduct) {

  if (selectedProduct.quantity === 1) {

    const newCart = cart.filter(product => product.id != selectedProduct.id);

    localStorage.setItem('cart', JSON.stringify(newCart));
    
  } else {
    for (let product of cart) {

      if (product.id == selectedProduct.id) {

        product.quantity = --product.quantity;
        localStorage.setItem('cart', JSON.stringify(cart));

      }
    }
  };

};

function cartIncrease (selectedProduct) {

  for (let product of cart) {

    if (product.id == selectedProduct.id) {

      product.quantity = ++product.quantity;
      localStorage.setItem('cart', JSON.stringify(cart));

    }
  }

};