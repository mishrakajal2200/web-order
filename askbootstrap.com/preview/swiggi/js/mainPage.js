const token = sessionStorage.getItem("token");

var url = "";
var restaurant_id = "";
var userId;

if (token == null) {
  window.location.href = "index.html";
}

setTimeout(function () {
  $("body").removeClass("loading").addClass("loaded");
}, 2000);

$(".carousel").carousel({
  interval: false,
});

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
  var otp1 = document.getElementById("otp1").value;
  var otp2 = document.getElementById("otp2").value;
  var otp3 = document.getElementById("otp3").value;
  var otp4 = document.getElementById("otp4").value;

  var continueButton = document.getElementById("continueButton");
}

document.addEventListener("DOMContentLoaded", function () {
  var location = sessionStorage.getItem("selectedLocationName");
  if (location) {
    document.getElementById("locationName").innerText = location; // Display the location name in the div
  }
  checkOTP(); // Call the function once the DOM is loaded
});

document.getElementById("otp1").addEventListener("input", function () {
  if (this.value.length === this.maxLength) {
    document.getElementById("otp2").focus();
  }
  checkOTP();
});

document.getElementById("otp2").addEventListener("input", function () {
  if (this.value.length === this.maxLength) {
    document.getElementById("otp3").focus();
  }
  checkOTP();
});

document.getElementById("otp3").addEventListener("input", function () {
  if (this.value.length === this.maxLength) {
    document.getElementById("otp4").focus();
  }
  checkOTP();
});

document.getElementById("otp4").addEventListener("input", function () {
  checkOTP();
});

function updateCartUI() {
  const cartItemsContainer = document.getElementById("newCartDiv");
  const cartMessage = document.getElementById("cartMessage");
  const viewCartMainDiv = document.getElementById("viewCartMainDiv");
  const newCartDivHida = document.getElementById("newCartDivHida");
  const cartItems = JSON.parse(sessionStorage.getItem("cart")) || [];
  cartItemsContainer.innerHTML = "";
  var total = 0;

  if (cartItems.length > 0) {
    cartMessage.textContent = "Items in Cart";

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
    newCartDivHida.classList.remove("hidden");
    newCartDivHida.appendChild(viewCartDiv);
  } else {
    cartMessage.textContent = "Your Cart is Empty";
    newCartDivHida.classList.add("hidden");
  }
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

async function getTableId(areaName) {
  var tableId = "";
  var areaName = Badlapur;
  // alert(restaurant_id);
  var restaurantId = EPOS123456;
  console.log("area name: " + Badlapur);

  try {
    const response = await fetch(
      `https://app.extraaazpos.com/api/getTableId/${Badlapur}/${EPOS123456}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log("Data:", data);
    tableId = data;

    return tableId;
  } catch (error) {
    console.error("Error fetching TableId:", error);
    throw error;
  }
}

$('input[name="pilih"]').on("change", function () {
  // Get the value of the selected radio button
  var areaName = $('input[name="pilih"]:checked').val();

  sessionStorage.setItem("areaName", areaName);
  console.log("Selected Value:", areaName);
});

async function formatCartData(cartItems) {
  var areaName = sessionStorage.getItem("areaName"); //$('input[name="pilih"]:checked').val();
  console.log("Selected Value:", areaName);
  const tableId = await getTableId(areaName);
  console.log("TableId : ", tableId);
  const sectionName = areaName == "Dine-In" ? "AC / 1" : tableId; //? "AC / 1" should be selected from the area(QR) !!!
  const total = cartItems.reduce((sum, item) => sum + item.product_total, 0);

  const formattedProducts = cartItems.map((item) => ({
    product_id: item.id,
    productName: item.name,
    quantity: item.quantity.toString(),
    unitPrice: item.price.toString(),
    total: item.product_total.toString(), //(item.price * item.quantity).toString(),
    kotInstruction: null,
    status: "confirmed",
    foodType: item.item_food_type,
  }));

  // Return the formatted data
  return {
    cover_count: "1", // This will come in Dine-In when there will be number of customers
    table_id: tableId,
    location_id: sessionStorage.getItem("selectedLocationId"),
    restaurant_id: restaurant_id,
    sectionName: sectionName,
    areaName: areaName,
    kitchenInstruction: null,
    billNote: null,
    internal_note: null,
    products: formattedProducts,
    total: total.toString(),
  };
}

async function sendCartDataToServer() {
  const apiUrl = "https://app.extraaazpos.com/api/storeToCart";
  const cartItems = JSON.parse(sessionStorage.getItem("cart")) || [];
  const formattedData = await formatCartData(cartItems);
  console.log("Formatted Data:", formattedData);

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(formattedData), // formattedData,//JSON.stringify({ cart: cartData }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // alert('Order placed successfully!');
        window.location.href =
          "cart.html?tableId=" + JSON.stringify(formattedData.table_id);
        // sessionStorage.setItem('cart', null);
      } else {
        alert("Error placing order. Please try again.");
      }
    })
    .catch((error) => {
      console.error("Error sending cart data:", error);
      alert("Error sending cart data. Please try again.");
    });
}

$(document).ready(function () {
  const token = sessionStorage.getItem("token");
  if (token == null) {
    window.location.href = "index.html";
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
    // window.location.reload();
    window.location.href = restaurantId + ".html";
  });

  fetch("/env.json")
    .then((response) => response.json())
    .then((data) => {
      url = data.URL;
      // restaurantId = data.RESTAURANT_ID;

      console.log("API URL2 :", url);
      console.log("Restaurant ID2 :", restaurantId);

      if (locationId == null) {
        alert("Location is not selected");
      }
      const token = sessionStorage.getItem("token");
      const customerId = sessionStorage.getItem("customerId");

      // if (token == null) {
      //   window.location.href = "index.html";
      // }

      var areaName = sessionStorage.getItem("areaName", areaName);
      if (areaName != null) {
        $('input[name="pilih"][value="' + areaName + '"]').prop(
          "checked",
          true
        );
      }

      updateCartUI();

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

          // Set userId and update categories
          var userId = data.data[0]["user_id"];
          console.log(data.data[0]["user_id"]);
          usingUserId(userId);
          categoryId = data.data[0]["id"]; // Update selected category ID
          currentPage = 1; // Reset to the first page
          itemsContainer.innerHTML = ""; // Clear previous items
          fetchItems();
          updateCategories(data.data);
          updateModalCategories(data.data);
          // fetchAllItemsAndDisplay(data.data);
        })
        .catch((error) => console.error("Error fetching categories:", error));
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
            // clickableContent.style.border = '2px solid red';
            clickableContent.style.padding = "10px";
            clickableContent.style.cursor = "pointer";
            clickableContent.innerHTML = `<p>Table ID: ${order.table_id}</p>
                                          <p>Date: ${new Date(
                                            order.created_at
                                          ).toLocaleString()}</p>`;

            // Add click event to redirect to the specified link
            clickableContent.addEventListener("click", () => {
              const link = `success-page.html?tableId="${order.table_id}"`; //encodeURIComponent
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
          "categories-container"
        );
        categoriesContainer.innerHTML = "";
        const ul = document.createElement("ul");

        categories.forEach((category) => {
          const li = document.createElement("li");
          const divRow = document.createElement("div");
          divRow.className = "sidebar-widget-list-left";

          // Create checkbox input
          const checkboxInput = document.createElement("input");
          checkboxInput.type = "checkbox";

          // Create category link
          const categoryLink = document.createElement("a");
          categoryLink.href = "#";
          categoryLink.innerHTML = `${category.cat_name}`;

          // Add event listener to toggle selected category
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
            categoryId = category.id; // Update selected category ID
            currentPage = 1; // Reset to the first page
            itemsContainer.innerHTML = ""; // Clear previous items
            fetchItems();
          });

          // Create checkmark span
          const checkmarkSpan = document.createElement("span");
          checkmarkSpan.className = "checkmark";

          divRow.appendChild(checkboxInput);
          divRow.appendChild(categoryLink);
          divRow.appendChild(checkmarkSpan);
          li.appendChild(divRow);
          ul.appendChild(li);
        });

        categoriesContainer.appendChild(ul);
      }

      let currentPage = 1;
      let categoryId = null; // Store the selected category ID
      const itemsContainer = document.getElementById("item-details-container");

      // Function to update categories in the modal body
      function updateModalCategories(categories) {
        const categoriesContainer = document.getElementById("Modal-container");
        categoriesContainer.innerHTML = ""; // Clear previous content
        const ul = document.createElement("ul");

        categories.forEach((category) => {
          const li = document.createElement("li");

          // Create category link
          const categoryLink = document.createElement("a");
          categoryLink.href = "#";
          categoryLink.innerHTML = `${category.cat_name}`; // Removed item count

          // Add event listener to toggle selected category
          categoryLink.addEventListener("click", () => {
            console.log(category.id);
            categoryId = category.id; // Update selected category ID
            currentPage = 1; // Reset to the first page
            itemsContainer.innerHTML = ""; // Clear previous items
            fetchItems();

            // Hide the modal
            $("#catmodal").modal("hide");
          });

          li.appendChild(categoryLink);
          ul.appendChild(li);
        });

        categoriesContainer.appendChild(ul);
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
              displayItems(data.data);
              currentPage++;
            }
          })
          .catch((error) => console.error("Error fetching items:", error));
      }
      // Add event listener for infinite scrolling
      window.addEventListener("scroll", () => {
        if (
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight
        ) {
          fetchItems();
        }
      });

      // Function to display items
      function displayItems(displayItems) {
        displayItems.forEach((item) => {
          const foodTypeLogo =
            item.item_food_type === "1"
              ? "image/veg-icon.png"
              : "image/non-veg-icon.png";
          let displayPrice = item.item_default_sell_price;
          if (!displayPrice) {
            // Fetch area price and calculate the price
            displayPrice = item.areaPrice1;
          }
          const itemHtml = ` <div class="shop-list-wrap mb-30px scroll-zoom">
                  <div class="list-product mt-5">
                      <div class="col-md-12">
                          <div class="row">
                              <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                                  <div class="left-img text-center">
                                      <div class="img-block" style="margin-top: 20px;">
                                          <a href="#" class="thumbnail">
                                              <img class="first-img" src="https://www.foodiesfeed.com/wp-content/uploads/2023/06/pouring-honey-on-pancakes.jpg" alt="${url}/storage/${item.item_name}" />
                                          </a>
                                      </div>
                                  </div>
                              </div>
                              <div class="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                                  <div class="product-desc-wrap">
                                      <div class="product-decs">

                                          <h2 class="mx-0"><a href="#" class="product-link">${item.item_name}</a></h2>
                                          <div class="pricing-meta">
                                              ₹<li class="price iprice">${displayPrice}</li>
                                              <li class="visually-hidden" id="item-id">${item.id}</li>
                                          </div>
                                      </div>
                                      <div class="add-to-link">
                                          <a class="cart-11" style="text-decoration:none;" href="#" data-variant-status="${item.variantStatus}" data-addon-status="${item.addOnStatus}">ADD TO CART</a>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="modal" id="cartModal1" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Cart</h5>
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

      function fetchAllItemsAndDisplay(categories) {
        var allItems = [];

        categories.forEach((category) => {
          if (category.items.length > 0) {
            const filteredItems = filterItemsByLocation(
              category.items,
              locationId
            );
            allItems.push(...filteredItems);
          }
        });
        console.log("All Items :", allItems);
        if (allItems.length > 0) {
          const defaultCategoryName = allItems[0].cat_name; // Use 'All Items' if no category name is found
          fetchItemsAndDisplay("ALL", allItems);
        }
      }
      function usingUserId(id) {
        userId = id;
        console.log("UserId set toiiiiiii:", userId);
      }

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

      $(document).on("click", "#continueButton", function (event) {
        event.preventDefault();
        sendCartDataToServer();
      });

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
    })
    .catch((error) => console.error("Error fetching env.json:", error));
});
