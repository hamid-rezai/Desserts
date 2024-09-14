fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    const dessertsList = document.querySelector(".desserts-list");
    const cartItemsList = document.querySelector(".cart-items");
    const cartTotalElement = document.querySelector(".cart-order-total");
    const cartCountElement = document.querySelector("h2");
    const cartDynamicContent = document.querySelector(".cart-dynamic-content");
    const cartEmptyState = document.querySelector(".cart-empty");
    let cartItems = [];

    // Clear existing content
    dessertsList.innerHTML = "";

    // Function to update cart display
    function updateCartDisplay() {
      cartItemsList.innerHTML = "";
      let total = 0;
      if (!cartItems.length) {
        cartDynamicContent.style.display = "none";
        cartEmptyState.style.display = "flex";
        cartCountElement.textContent = `Your Cart (0)`;
      } else {
        cartEmptyState.style.display = "none";
        cartDynamicContent.style.display = "block";
        cartItems.forEach((item) => {
          const cartItemElement = document.createElement("li");
          cartItemElement.classList.add("cart-item");
          cartItemElement.innerHTML = `
          <p class="cart-item-name">${item.name}</p>
          <div class="cart-item-details">
            <p class="cart-item-quantity">${item.quantity}x</p>
            <p class="cart-item-price">@ $${item.price.toFixed(2)}</p>
            <p class="cart-item-total-price">$${(
              item.price * item.quantity
            ).toFixed(2)}</p>
            <button class="cart-cancel-item"><span>x</span></button>
          </div>
        `;
          cartItemsList.appendChild(cartItemElement);
          total += item.price * item.quantity;
        });

        document.querySelectorAll(".cart-cancel-item").forEach((button) => {
          button.addEventListener("click", (e) => {
            const index = parseInt(
              e.target.closest(".cart-cancel-item").dataset.index
            );
            cartItems.splice(index, 1);
            updateCartDisplay();
            updateDessertList();
          });
        });

        cartTotalElement.innerHTML = `<p class="order-total-text">Order Total</p><p class="order-total-amount">$${total.toFixed(
          2
        )}</p>`;

        let cartTotalCount = 0;
        for (const element of cartItems) {
          cartTotalCount += element.quantity;
        }

        cartCountElement.textContent = `Your Cart (${cartTotalCount})`;
      }
    }
    function updateDessertList() {
      dessertsList
        .querySelectorAll(".dessert-card-container")
        .forEach((card, index) => {
          const control = card.querySelector(".cart-control");
          const addToCartBtn = control.querySelector(".add-to-cart-btn");
          const quantityControl = control.querySelector(".quantity-control");
          const quantitySpan = control.querySelector(".quantity");
          const cartItem = cartItems.find(
            (item) => item.name === data[index].name
          );
          if (cartItem) {
            addToCartBtn.style.display = "none";
            quantityControl.style.display = "flex";
            quantitySpan.textContent = cartItem.quantity;
          } else {
            addToCartBtn.style.display = "flex";
            quantityControl.style.display = "none";
            quantitySpan.textContent = 1;
            control.parentElement.style.borderColor = "hsl(20, 50%, 98%)";
          }
        });
    }

    // Loop through each dessert item
    data.forEach((dessert) => {
      // Create a new list item
      const listItem = document.createElement("li");
      // Create the dessert card HTML
      listItem.innerHTML = `
      <div class="dessert-card-container">
        <div class="dessert-image-container">
          <picture class="dessert-picture">
            <source media="(min-width: 1024px)" srcset="${
              dessert.image.desktop
            }">
            <source media="(min-width: 650px)" srcset="${dessert.image.tablet}">
            <source media="(min-width: 0px)" srcset="${dessert.image.mobile}">
            <img src="${dessert.image.thumbnail}" alt="${
        dessert.name
      }" class="dessert-image">
          </picture>
          <div class="cart-control">
            <button class="add-to-cart-btn"><img src="assets/images/icon-add-to-cart.svg" alt=""/><p>Add to Cart</p></button>
            <div class="quantity-control" style="display: none;">
              <button class="quantity-btn minus"><span>-</span></button>
              <span class="quantity">1</span>
              <button class="quantity-btn plus"><span>+</span></button>
            </div>
          </div>
        </div>
        <div class="dessert-card-description">
          <p class="dessert-type">${dessert.category}</p>
          <p class="dessert-name">${dessert.name}</p>
          <p class="dessert-price">$${dessert.price.toFixed(2)}</p>
        </div>
      </div>
    `;
      // Append the new item to the list
      dessertsList.appendChild(listItem);

      const control = listItem.querySelector(".cart-control");
      const addToCartBtn = control.querySelector(".add-to-cart-btn");
      const quantityControl = control.querySelector(".quantity-control");
      const quantitySpan = control.querySelector(".quantity");
      const minusBtn = control.querySelector(".minus");
      const plusBtn = control.querySelector(".plus");
      let quantity = 0;

      addToCartBtn.addEventListener("click", () => {
        addToCartBtn.style.display = "none";
        quantityControl.style.display = "flex";
        quantity = 1;
        cartItems.push({ ...dessert, quantity: 1 });
        updateCartDisplay();
        control.parentElement.style.borderColor = "hsl(14, 86%, 42%)";
      });

      minusBtn.addEventListener("click", () => {
        if (quantity > 1) {
          quantity--;
          quantitySpan.textContent = quantity;
          const cartItem = cartItems.find((item) => item.name === dessert.name);
          if (cartItem) {
            cartItem.quantity--;
          }
        } else {
          quantity = 0;
          quantityControl.style.display = "none";
          addToCartBtn.style.display = "flex";
          cartItems = cartItems.filter((item) => item.name !== dessert.name);
          control.parentElement.style.borderColor = "hsl(20, 50%, 98%)";
        }
        updateCartDisplay();
      });

      plusBtn.addEventListener("click", () => {
        quantity++;
        quantitySpan.textContent = quantity;
        const cartItem = cartItems.find((item) => item.name === dessert.name);
        if (cartItem) {
          cartItem.quantity++;
        }
        updateCartDisplay();
      });
    });

    const confirmOrderBtn = document.getElementById("confirmOrderBtn");
    const modal = document.getElementById("confirmModal");
    const newOrderBtn = document.getElementById("newOrderBtn");

    function openModal() {
      modal.style.display = "flex";
    }
    function closeModal() {
      modal.style.display = "none";
    }

    confirmOrderBtn.addEventListener("click", () => {
      openModal();

      let total = 0;
      const finalDessertsList = document.getElementById("finalDessertsList");
      cartItems.forEach((item) => {
        const cartItemElement = document.createElement("li");
        cartItemElement.classList.add("order-item");
        cartItemElement.innerHTML = `
        <div class="order-item-details">
          <img src="${item.image.thumbnail}" alt="${item.name}"/>
          <div>
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-price"><span class="cart-item-quantity">${
              item.quantity
            }x</span>  @ $${item.price.toFixed(2)}</p>
          </div>
          <div class="cart-item-total-price-container">
            <p class="cart-item-total-price">$${(
              item.price * item.quantity
            ).toFixed(2)}</p>
          </div>
        </div>

      `;
        finalDessertsList.appendChild(cartItemElement);
        total += item.price * item.quantity;
      });

      const orderTotal = document.createElement("div");
      orderTotal.classList.add("order-total-section");
      orderTotal.innerHTML = `<p class="order-total-text">Order Total</p><p class="order-total-amount">$${total.toFixed(
        2
      )}</p>`;

      finalDessertsList.parentElement.append(orderTotal);

      newOrderBtn.addEventListener("click", () => {
        finalDessertsList.innerHTML = "";
        orderTotal.innerHTML = "";
        cartItems = [];
        updateCartDisplay();
        updateDessertList();
        closeModal();
      });
    });
  })
  .catch((error) => console.error("Error fetching desserts:", error));
