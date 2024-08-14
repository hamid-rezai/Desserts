const items = document.querySelectorAll(".add");

items.forEach((item) => {
  let number = 1;

  item.addEventListener("click", () => {
    item.innerHTML = "";
    const minusIcon = document.createElement("i");
    minusIcon.classList.add("fa-solid", "fa-circle-minus", "font-size", "red");
    item.appendChild(minusIcon);
    const numberItem = document.createTextNode(number);
    item.appendChild(numberItem);
    const plusIcon = document.createElement("i");
    plusIcon.classList.add("fa-solid", "fa-circle-plus", "font-size", "red");
    item.appendChild(plusIcon);
    const name = document.querySelectorAll(".name");

    minusIcon.addEventListener("click", () => {
      number--;
    });

    plusIcon.addEventListener("click", () => {
      number++;
      addItemToCart();
    });
  });
});

function addItemToCart(name, number, price, totalPrice) {
  const cart = document.querySelector(".cart");
  const cartItems = document.querySelector(".cart-items");
  const div = document.createElement("div");
  div.classList.add("cart-item");
  div.innerHTML = `<div>
              <h4>${name}</h4>
              <p>
                <span class="item-number"> ${number}x</span
                ><span class="each-item">@$${price}</span
                ><span class="total-price">$${totalPrice}</span>
              </p>
            </div>
            <i class="fa-regular fa-circle-xmark"></i>`;
  cartItems.appendChild(div);
}
