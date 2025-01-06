const token = sessionStorage.getItem("token");

var url = "";
var restaurant_id = "";
var userId;

if (token == null) {
  window.location.href = "login.html";
}

setTimeout(function () {
  $("body").removeClass("loading").addClass("loaded");
}, 2000);

fetch("/env.json")
  .then((response) => response.json())
  .then((data) => {
    url = data.URL;
    //  locationId = data.LOCATION;
    // restaurant_id = data.RESTAURANT_ID;
    restaurant_id = localStorage.getItem("urlSegment");

    console.log("API URL:", url);
    // console.log('Location ID:', locationId);
    console.log("Restaurant ID:", restaurant_id);
  })
  .catch((error) => console.error("Error fetching env.json:", error));
function checkOTP() {
  // Get the OTP input values
  var otp1 = document.getElementById("otp1");
  var otp2 = document.getElementById("otp2");
  var otp3 = document.getElementById("otp3");
  var otp4 = document.getElementById("otp4");

  // Check if all OTP inputs exist before accessing their values
  if (otp1 && otp2 && otp3 && otp4) {
    var otpValue1 = otp1.value;
    var otpValue2 = otp2.value;
    var otpValue3 = otp3.value;
    var otpValue4 = otp4.value;

    // Assuming you will add logic to enable/disable continueButton based on OTP values
    var continueButton = document.getElementById("continueButton");
    // Add your logic here to check the OTP and control the continueButton
  } else {
    console.error("One or more OTP input elements are missing.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var location = sessionStorage.getItem("selectedLocationName");
  if (location) {
    document.getElementById("locationName").innerText = location; // Display the location name in the div
  }

  // Ensure the DOM is loaded before attaching event listeners
  var otp1 = document.getElementById("otp1");
  var otp2 = document.getElementById("otp2");
  var otp3 = document.getElementById("otp3");
  var otp4 = document.getElementById("otp4");

  if (otp1 && otp2 && otp3 && otp4) {
    // Attach event listeners to OTP input fields
    otp1.addEventListener("input", function () {
      if (this.value.length === this.maxLength) {
        otp2.focus();
      }
      checkOTP();
    });

    otp2.addEventListener("input", function () {
      if (this.value.length === this.maxLength) {
        otp3.focus();
      }
      checkOTP();
    });

    otp3.addEventListener("input", function () {
      if (this.value.length === this.maxLength) {
        otp4.focus();
      }
      checkOTP();
    });

    otp4.addEventListener("input", function () {
      checkOTP();
    });
  } else {
    console.error("One or more OTP input elements are missing.");
  }

  // Call checkOTP only if all OTP elements exist
  if (otp1 && otp2 && otp3 && otp4) {
    checkOTP();
  }
});

function updateCartUI() {
  const cartItemsContainer = document.getElementById("cart-items-container");

  const viewCartMainDiv = document.getElementById("viewCartMainDiv");

  const cartItems = JSON.parse(sessionStorage.getItem("cart")) || [];
  cartItemsContainer.innerHTML = "";
  var total = 0;

  if (cartItems.length > 0) {
    cartItems.forEach((cartItem, index) => {
      const cartItemDiv = document.createElement("div");
      cartItemDiv.className = "row";

      cartItemDiv.innerHTML = `
                <div class="row mt-2">
                    <div class="col-6 mt-2">
                        <h6><span>${cartItem.name}</span></h6>
                    </div>
                    <div class="col-3 mt-2">
                        <h6>₹ ${cartItem.price}</h6>
                    </div>
                    <div class="col-3">
                        <div class="input-group mb-2">
                            <button class="btn btn-outline-danger m-0" type="button" onclick="decreaseQuantity(${index})">-</button>
                            <input type="text" class="form-control form-control-sm" style="color: red;" value="${cartItem.quantity}" id="quantity-${index}" readonly>
                            <button class="btn btn-outline-danger" type="button" onclick="increaseQuantity(${index})">+</button>
                        </div>
                    </div>
                </div>
            `;

      cartItemsContainer.appendChild(cartItemDiv);
      total += cartItem.product_total;
    });

    const viewCartDiv = document.createElement("div");
    viewCartDiv.className = "view-cart";

    viewCartDiv.innerHTML = `
            <p class="mt-3 mb-1 fw-bold text-light ms-4 "> ₹${total.toFixed(
              2
            )}</p>
            <button class="cart-info btn fw-bold text-light " style="margin-left: 18vh;
            " >PROCEED <i class="bi bi-arrow-right"></i></button>
        `;

    viewCartDiv.addEventListener("click", function () {
      customerName = document.getElementById("customerName");
      customerNumber = document.getElementById("customerNumber");
      exampleModalLabelName = document.getElementById("exampleModalLabelName");
      customerName.value = sessionStorage.getItem("customerName");
      customerNumber.value = sessionStorage.getItem("customerNumber");
      exampleModalLabelName.textContent =
        "Enter OTP Sent to " + customerNumber.value;
      $("#cartModal").modal("show");
    });

    $("#cartDiv").addClass("hidden");
  }
  updateCartCount();
}

function updateCartCount() {
  const cartCountElement = document.getElementById("item-count");
  const cartItems = JSON.parse(sessionStorage.getItem("cart")) || [];

  // Set the cart count to the number of distinct items in the cart
  cartCountElement.textContent = cartItems.length;
}

function decreaseQuantity(index) {
  console.log("Index", index);
  const cartItems = JSON.parse(sessionStorage.getItem("cart")) || [];
  const itemId = cartItems[index].id;
  console.log("cartItems :", cartItems);
  const quantityInput = document.getElementById(`quantity-${index}`);

  console.log("quantity :", quantityInput);
  let quantity = parseInt(quantityInput.value);

  if (quantity > 1) {
    quantity--;
    quantityInput.value = quantity;
    updateCartItemQuantity(itemId, quantity);
  } else if (quantity === 1) {
    removeItemFromCart(itemId);
  }
}

function removeItemFromCart(itemId) {
  let existingCartItems = JSON.parse(sessionStorage.getItem("cart")) || [];
  existingCartItems = existingCartItems.filter((item) => item.id !== itemId);
  sessionStorage.setItem("cart", JSON.stringify(existingCartItems));
  updateCartUI();
}

function increaseQuantity(index) {
  const cartItems = JSON.parse(sessionStorage.getItem("cart")) || [];
  const itemId = cartItems[index].id;
  const quantityInput = document.getElementById(`quantity-${index}`);
  let quantity = parseInt(quantityInput.value);
  quantity++;
  quantityInput.value = quantity;
  updateCartItemQuantity(itemId, quantity);
}

function updateCartItemQuantity(itemId, newQuantity) {
  const existingCartItems = JSON.parse(sessionStorage.getItem("cart")) || [];
  const cartItemIndex = existingCartItems.findIndex(
    (item) => item.id === itemId
  );
  if (cartItemIndex !== -1) {
    existingCartItems[cartItemIndex].quantity = newQuantity;
    existingCartItems[cartItemIndex].product_total =
      existingCartItems[cartItemIndex].quantity *
      existingCartItems[cartItemIndex].price;
    sessionStorage.setItem("cart", JSON.stringify(existingCartItems));
    updateCartUI();
  }
}

$('input[name="pilih"]').on("change", function () {
  // Get the value of the selected radio button
  var areaName = $('input[name="pilih"]:checked').val();

  sessionStorage.setItem("areaName", areaName);
  console.log("Selected Value:", areaName);
});

$(document).ready(function () {
  // When the radio button changes

  const token = sessionStorage.getItem("token");
  if (token == null) {
    window.location.href = "login.html";
  }
  if (!sessionStorage.getItem("areaName")) {
    // Trigger change event on page load
    $('input[name="pilih"]').trigger("change");
  }

  const locationId = sessionStorage.getItem("selectedLocationId");
  var url = "";
  var restaurantId = "";

  restaurantId = localStorage.getItem("urlSegment");
  var logout = document.getElementById("logout");
  logout.addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "login.html";
  });

  fetch("/env.json")
    .then((response) => response.json())
    .then((data) => {
      url = data.URL;

      console.log("API URL2 :", url);
      console.log("Restaurant ID2 :", restaurantId);

      if (locationId == null) {
        alert("Location is not selected");
      }
      const token = sessionStorage.getItem("token");
      const customerId = sessionStorage.getItem("customerId");

      var areaName = sessionStorage.getItem("areaName", areaName);
      if (areaName != null) {
        $('input[name="pilih"][value="' + areaName + '"]').prop(
          "checked",
          true
        );
      }

      updateCartUI();

      // fetch(
      //   `https://app.extraaazpos.com/api/get-categories?location_id=${locationId}&restaurant_id=${restaurantId}`,
      //   {
      //     method: "GET",
      //     headers: {
      //       Accept: "application/json",
      //       Authorization: "Bearer " + token,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // )
      fetch(
        `https://app.extraaazpos.com/api/get-categories?location_id=${locationId}&restaurant_id=${restaurantId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Categories:", data.data);

          if (Array.isArray(data.data) && data.data.length > 0) {
            var userId = data.data[0]["user_id"];
            console.log("User ID:", userId);
            usingUserId(userId);
            categoryId = data.data[0]["id"];
            currentPage = 1;
            itemsContainer.innerHTML = "";
            fetchItems();
            updateCategories(data.data);
            updateModalCategories(data.data);
          } else {
            console.error("Error: Categories data is empty or not an array");
          }
        })
        .catch((error) => console.error("Error fetching categories:", error));

      // .then((response) => response.json())
      // .then((data) => {
      //   console.log("Categories:", data.data);

      //   var userId = data.data[0]["user_id"];
      //   console.log(data.data[0]["user_id"]);
      //   usingUserId(userId);
      //   categoryId = data.data[0]["id"];
      //   currentPage = 1;
      //   itemsContainer.innerHTML = "";
      //   fetchItems();
      //   updateCategories(data.data);
      //   updateModalCategories(data.data);
      // })
      // .catch((error) => console.error("Error fetching categories:", error));

      fetch(
        `https://app.extraaazpos.com/api/getOrderHistory?location_id=${locationId}&restaurant_id=${restaurantId}&customer_id=${customerId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("OrderHistory:", data.data);
          const modalBody = document.getElementById("modalBody");
          modalBody.innerHTML = "";

          data.data.forEach((order) => {
            const card = document.createElement("div");
            card.className = "card shadow-lg mt-2";
            const cardBody = document.createElement("div");
            cardBody.className = "card-body";

            const clickableContent = document.createElement("div");
            clickableContent.style.padding = "10px";
            clickableContent.style.cursor = "pointer";
            clickableContent.innerHTML = `<p>Table ID: ${order.table_id}</p>
                                          <p>Date: ${new Date(order.created_at).toLocaleString()}</p>`;

            clickableContent.addEventListener("click", () => {
              const link = `success-page.html?tableId="${order.table_id}"`;
              window.location.href = link;
            });

            cardBody.appendChild(clickableContent);
            card.appendChild(cardBody);
            modalBody.appendChild(card);
          });
        })
        .catch((error) =>
          console.error("Error fetching Order History:", error)
        );

      function updateCategories(categories) {
        const categoriesContainer = document.getElementById(
          "custom-categories-container"
        );

        if (!categoriesContainer) {
          console.error("categories-container element not found");
          return;
        }

        categoriesContainer.innerHTML = "";

        categories.forEach((category) => {
          const catItemDiv = document.createElement("div");
          catItemDiv.className = "cat-item px-1 py-3";

          const categoryLink = document.createElement("a");
          categoryLink.className =
            "bg-white rounded d-block p-2 text-center shadow";
          categoryLink.href = "#";

          const categoryImg = document.createElement("img");
          categoryImg.src =
            category.image_url ||
            "/askbootstrap.com/preview/swiggi/img/icons/Breakfast.png";

          const categoryText = document.createElement("p");
          categoryText.className = "m-0 small";
          categoryText.textContent = category.cat_name || "Unknown Category";

          categoryLink.addEventListener("click", () => {
            const selectedCategories =
              document.querySelectorAll(".selected-category");
            if (categoryLink.classList.contains("selected-category")) {
              categoryLink.classList.remove("selected-category");
            } else {
              selectedCategories.forEach((selectedCategory) => {
                selectedCategory.classList.remove("selected-category");
              });
              categoryLink.classList.add("selected-category");
            }
            console.log(category.id);
            categoryId = category.id;
            currentPage = 1;
            itemsContainer.innerHTML = "";
            fetchItems();
          });

          categoryLink.appendChild(categoryImg);
          categoryLink.appendChild(categoryText);
          catItemDiv.appendChild(categoryLink);
          categoriesContainer.appendChild(catItemDiv);
        });

        $(".cat-slider").slick("unslick");
        $(".cat-slider").slick({
          infinite: true,
          slidesToShow: 3,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2000,
          arrows: true,
          dots: false,
        });
      }

      let currentPage = 1;
      let categoryId = null;
      const itemsContainer = document.getElementById("item-details-container");

      function updateModalCategories(categories) {
        const categoriesContainer = document.getElementById("Modal-container");

        if (!categoriesContainer) {
          console.error("Modal-container element not found");
          return;
        }

        categoriesContainer.innerHTML = "";

        categories.forEach((category) => {
          const catItemDiv = document.createElement("div");
          catItemDiv.className = "cat-item px-1 py-3";

          const categoryLink = document.createElement("a");
          categoryLink.className =
            "bg-white rounded d-block p-2 text-center shadow";
          categoryLink.href = "#";
          categoryLink.innerHTML = category.cat_name || "Unknown Category";

          categoryLink.addEventListener("click", () => {
            console.log(category.id);
            categoryId = category.id;
            currentPage = 1;
            itemsContainer.innerHTML = "";
            fetchItems();

            $("#catmodal").modal("hide");
          });

          catItemDiv.appendChild(categoryLink);
          categoriesContainer.appendChild(catItemDiv);
        });
      }
      function usingUserId(id) {
        userId = id;
        console.log("UserId set toiiiiiii:", userId);
      }

      function fetchItems() {
        if (categoryId === null) return;
        console.log(locationId);
        fetch(
          `https://app.extraaazpos.com/api/get-items?location_id=${locationId}&restaurant_id=${restaurantId}&category_id=${categoryId}&limit=10&page=${currentPage}`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("Items:", data.data);
            if (data.success) {
              allItems = data.data;
              displayItems(allItems);
              currentPage++;
            }
          })
          .catch((error) => console.error("Error fetching items:", error));
      }

      function displayItems(displayItems) {
        displayItems.forEach((item) => {
          const foodTypeLogo =
            item.item_food_type === "1"
              ? "image/veg-icon.png"
              : "image/non-veg-icon.png";
          let displayPrice = item.item_default_sell_price;
          if (!displayPrice) {
            displayPrice = item.areaPrice1; // Fallback price
          }

          const itemHtml = `
          
      <div class="container shop-list-wrap rounded-lg shadow-lg bg-white mt-3 mb-3 p-3">
      <div class="align-items-center">
  <div class="row list-product mt-2 d-flex align-item-center">
    <!-- Product Info Section (Name and Price) -->
    <div class="col-12 col-md-8 d-flex align-items-center mb-3 mb-md-0 justify-content-center justify-content-md-start text-center text-md-start">
      <img src="https://w7.pngwing.com/pngs/366/356/png-transparent-hamburger-whopper-chicken-sandwich-fried-chicken-fast-food-fried-chicken-food-recipe-fast-food-restaurant.png" 
           alt="img" 
           class="custom-img img-fluid rounded-circle me-3"
           style="max-width: 80px; height: 80px;" />
      <div>
        <h2 class="fs-5 text-truncate">
          <a href="#" class="product-link text-wrap">${item.item_name}</a>
        </h2>
        <div class="pricing-meta">
          ₹<span class="price iprice text-danger">${displayPrice}</span>
          <span class="visually-hidden" id="item-id">${item.id}</span>
        </div>
      </div>
    </div>

    <!-- "Add" Button Section -->
    <div class="col-12 col-md-4 d-flex justify-content-center justify-content-md-end align-items-center">
      <a class="add-button cart-11 add-to-cart-btn btn btn-outline-secondary px-5 py-2" 
         href="#" 
         onclick="addItem()"
         data-variant-status="${item.variantStatus}"
         data-addon-status="${item.addOnStatus}">
        ADD
      </a>
    </div>
  </div>
</div>
</div>

       <!-- Cart Modal -->
     <div class="modal fade" id="cartModal1" tabindex="-1" role="dialog" aria-labelledby="cartModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content custom-modal">
      <div class="modal-header">
        <h5 class="modal-title" id="cartModalLabel">Cart</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>Your cart items...</p>
        <div id="modifierData"></div>
      </div>
      <div class="modal-footer">
        <button type="button" id="addToCartButton" class="btn btn-primary">Add to Cart</button>
      </div>
    </div>
  </div>
</div>


      `;

          itemsContainer.innerHTML += itemHtml;
        });
      }

      // using modifier
      $(document).on("click", ".cart-11", function () {
        const variantStatus = this.getAttribute("data-variant-status");
        const addOnStatus = this.getAttribute("data-addon-status");

        // Store the item name and ID
        const itemName = $(this)
          .closest(".shop-list-wrap")
          .find(".product-link")
          .text();
        const itemId = $(this)
          .closest(".shop-list-wrap")
          .find("#item-id")
          .text();
        // const userId = $(this).closest(".shop-list-wrap").find("#user-id").text();
        console.log("Using userId:", userId);
        // alert(userId);
        const itemBasePrice = parseFloat(
          $(this).closest(".shop-list-wrap").find(".iprice").text()
        );

        if (variantStatus == 1 || addOnStatus == 1) {
          // Open the modal
          $("#cartModal1").modal("show");

          //const userId = 1;

          $.ajax({
            url: "https://app.extraaazpos.com/api/get-modifier",
            // url: 'http://127.0.0.1:8000/api/get-modifier',

            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
              item_id: itemId,
              user_id: userId,
            }),
            success: function (response) {
              console.log("API response:", response);

              if (response.data && Array.isArray(response.data)) {
                let modifierHtml = "";
                response.data.forEach((modifier) => {
                  if (variantStatus == 1) {
                    // Display radio buttons for variantStatus == 1
                    modifierHtml += `
                                <div class="modifier-item">
                                    <label>
                                        <input type="radio" name="modifier" value="${modifier.id}" data-price="${modifier.default_sale_price}" data-title="${modifier.title}">
                                        ${modifier.title} - $${modifier.default_sale_price}
                                    </label>
                                </div>`;
                  } else if (addOnStatus == 1) {
                    // Display checkboxes for addOnStatus == 1
                    modifierHtml += `
                                <div class="modifier-item">
                                    <label>
                                        <input type="checkbox" name="modifier" value="${modifier.id}" data-price="${modifier.default_sale_price}" data-title="${modifier.title}">
                                        ${modifier.title} - $${modifier.default_sale_price}
                                    </label>
                                </div>`;
                  }
                });
                $("#modifierData").html(modifierHtml);
              } else {
                $("#modifierData").html("<p>No modifiers found.</p>");
              }
            },
            error: function (error) {
              console.error("Error fetching modifier data:", error);
              $("#modifierData").html("<p>Error fetching modifier data.</p>");
            },
          });

          $("#addToCartButton")
            .off("click")
            .on("click", function () {
              let totalModifierPrice = 0;
              let selectedModifierTitles = "";

              if (variantStatus == 1) {
                const selectedModifierPrice = parseFloat(
                  $('input[name="modifier"]:checked').data("price")
                );
                const selectedModifierTitle = $(
                  'input[name="modifier"]:checked'
                ).data("title");
                if (!isNaN(selectedModifierPrice)) {
                  totalModifierPrice = selectedModifierPrice;
                  selectedModifierTitles = selectedModifierTitle;
                } else {
                  alert("Please select a modifier.");
                  return;
                }
              } else if (addOnStatus == 1) {
                $('input[name="modifier"]:checked').each(function () {
                  const selectedModifierPrice = parseFloat(
                    $(this).data("price")
                  );
                  const selectedModifierTitle = $(this).data("title");
                  if (!isNaN(selectedModifierPrice)) {
                    totalModifierPrice += selectedModifierPrice;
                    selectedModifierTitles += selectedModifierTitles
                      ? `, ${selectedModifierTitle}`
                      : selectedModifierTitle;
                  }
                });
                // Add the base item price only for addOnStatus
                totalModifierPrice += itemBasePrice;
              }

              const itemQuantity = 1;

              const cartItem = {
                id: itemId,
                name: `${itemName} (${selectedModifierTitles})`, // Combine item name with selected modifiers
                price: totalModifierPrice,
                product_total: totalModifierPrice * itemQuantity,
                quantity: itemQuantity,
                modifiers: $('input[name="modifier"]:checked')
                  .map(function () {
                    return $(this).val();
                  })
                  .get(),
              };

              addToCart(cartItem);
              updateCartUI();

              $("#cartModal1").modal("hide");
            });
        } else {
          // Directly add to cart if neither variantStatus nor addOnStatus is 1
          const itemQuantity = 1;

          const cartItem = {
            id: itemId,
            name: itemName, // Use the item's name
            price: itemBasePrice,
            product_total: itemBasePrice * itemQuantity,
            quantity: itemQuantity,
          };

          addToCart(cartItem);
          updateCartUI();
        }
      });

      // add to cart
      function addToCart(item) {
        const existingCartItems =
          JSON.parse(sessionStorage.getItem("cart")) || [];
        const existingItem = existingCartItems.find(
          (cartItem) => cartItem.id === item.id
        );

        if (existingItem) {
          // If the item is already in the cart, update the quantity
          existingItem.quantity += item.quantity;
          existingItem.product_total =
            parseFloat(item.price) * existingItem.quantity;
          console.log("Existing :", existingItem.product_total);
        } else {
          // If the item is not in the cart, add it
          existingCartItems.push(item);
        }
        sessionStorage.setItem("cart", JSON.stringify(existingCartItems));
        updateCartUI();
      }

      function updateCartIcon(count) {
        const cartIcon = document.getElementById("cart-icon");
        if (cartIcon) {
          cartIcon.textContent = count;
        }
      }
    });
});
