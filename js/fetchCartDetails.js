var url = "";
var restaurantId = "";
document.addEventListener("DOMContentLoaded", function () {
  fetch("/env.json")
    .then((response) => response.json())
    .then((data) => {
      url = data.URL;
      // restaurantId = data.RESTAURANT_ID;
      restaurantId = localStorage.getItem("urlSegment");
      // const locationId = sessionStorage.getItem('selectedLocationId');

      console.log("API URL:", url);
      console.log("Restaurant ID:", restaurantId);

      // Get the tableId from the query parameters or other sources
      const urlParams = new URLSearchParams(window.location.search);
      const tableId = urlParams.get("tableId");

      // Fetch order details based on the tableId
      fetchOrderDetails(tableId);
    })
    .catch((error) => console.error("Error fetching env.json:", error));
});

function fetchOrderDetails(tableId) {
  const token = sessionStorage.getItem("token");

  if (token == null) {
    window.location.href = "login.html";
  }
  const apiUrl = url + `/api/getCartItems?tableId=${tableId}`;

  fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      updateOrderDetails(data);
    })
    .catch((error) => {
      console.error("Error fetching order details:", error);
    });
}

// function updateOrderDetails(data) {
//   const orderDetailsContainer = document.getElementById("orderDetails");
//   orderDetailsContainer.innerHTML = "";
//   console.log("ordered data", data);
//   if (data.data.length > 0) {
//     const firstOrder = data.data[0];

//     const sharedOrderDetailsHtml = `
//           <table class="table table-fixed mb-0">
//                       <tbody>
//                           <tr>
//                               <td><strong>Order Id : </strong></td>
//                               <td>${firstOrder.table_id}</td>
//                           </tr>
//                           <tr>
//                               <td><strong>Order Type : </strong></td>
//                               <td>${firstOrder.areaName}</td>
//                           </tr>
//                           ${
//                             firstOrder.areaName == "Dine-In"
//                               ? `<tr>
//                               <td><strong>Cover Count:</strong></td>
//                               <td>${firstOrder.cover_count}</td>
//                           </tr>`
//                               : ""
//                           }
//                       </tbody>
//                 </table>
//           `;
//     orderDetailsContainer.innerHTML += sharedOrderDetailsHtml;
//     // Group items by product name
//     const groupedItems = {};
//     data.data.forEach((order) => {
//       if (!groupedItems[order.product_name]) {
//         groupedItems[order.product_name] = {
//           quantity: 0,
//           unit_price: order.unit_price,
//           product_total: 0,
//         };
//       }
//       groupedItems[order.product_name].quantity += order.quantity;
//       groupedItems[order.product_name].product_total += parseFloat(
//         order.product_total
//       );
//     });
//     var count = 1;
   
//   const orderItemsTableHtml = `
//   <div class="card-body pt-0">
//     <div class="table-responsive">
//       <table class="table mb-0">
//         <thead>
//           <tr>
//             <th>Sr</th>
//             <th scope="col">Product Name</th>
//             <th>Quantity</th>
//             <th>Unit Price</th>
//             <th>Total</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${Object.keys(groupedItems)
//             .map((product) => {
//               const item = groupedItems[product];
//               return `
//                 <tr>
//                   <td>${count++}</td>
//                   <td class="text-truncate">${product}</td>
//                   <td class="text-center">${item.quantity}</td>
//                   <td class="text-right"> ₹${item.unit_price}</td>
//                   <td> ₹${item.product_total.toFixed(2)}</td>
//                 </tr>
//               `;
//             })
//             .join("")}
//         </tbody>
//         <tfoot>
//           <tr>
//             <th colspan="5" class="text-right" id="GrandTotal">
//               SubTotal: ₹${calculateMainTotal(data.data)} <br/>
//               SGST(@2.5%): ₹${taxCalculate(data.data)} <br/>
//               CGST(@2.5%): ₹${taxCalculate(data.data)} <br/>
//               <strong>Grand Total:</strong> ₹${calculateGrandTotal(data.data)}
//             </th>
//           </tr>
//           <tr>
//             ${
//               data.data[0].areaName == "Delivery"
//                 ? `<th colspan="5" id="placeOrderContainer" style="display: none;">`
//                 : `<th colspan="5" id="placeOrderContainer">`
//             }
//               <div class="text-center">
//                 <button id="placeOrderButton" type="button" class="btn btn-danger shadow p-3"
//                         style="border-radius: 15px; width:100%; white-space: nowrap;"> Place Order <i class="bi bi-arrow-right"></i></button>
//               </div>
//             </th>
//           </tr>
//         </tfoot>
//       </table>
//     </div>
//   </div>
// `;







//     orderDetailsContainer.innerHTML += orderItemsTableHtml;
//     document
//       .getElementById("placeOrderButton")
//       .addEventListener("click", function () {
//         handleRazorpayPayment(data);
//       });
//   } else {
//     // Display a message if there are no orders
//     orderDetailsContainer.innerHTML =
//       '<p class="text-muted text-red">No orders found.</p>';
//   }
// }

function updateOrderDetails(data) {
  const orderDetailsContainer = document.getElementById("orderDetails");
  orderDetailsContainer.innerHTML = "";
  console.log("ordered data", data);
  
  if (data.data.length > 0) {
    const firstOrder = data.data[0];

    // Shared order details (Order ID, Order Type, Cover Count)
    const sharedOrderDetailsHtml = `
          <div class="order-details">
            <p><strong>Order Id: </strong>${firstOrder.table_id}</p>
            <p><strong>Order Type: </strong>${firstOrder.areaName}</p>
            ${
              firstOrder.areaName == "Dine-In"
                ? `<p><strong>Cover Count:</strong> ${firstOrder.cover_count}</p>`
                : ""
            }
          </div>
    `;
    
    orderDetailsContainer.innerHTML += sharedOrderDetailsHtml;

    // Group items by product name
    const groupedItems = {};
    data.data.forEach((order) => {
      if (!groupedItems[order.product_name]) {
        groupedItems[order.product_name] = {
          quantity: 0,
          unit_price: order.unit_price,
          product_total: 0,
        };
      }
      groupedItems[order.product_name].quantity += order.quantity;
      groupedItems[order.product_name].product_total += parseFloat(order.product_total);
    });

    let orderItemsHtml = '<div class="order-items d-flex flex-column" style="gap: 10px;">';
let count = 1;

Object.keys(groupedItems).forEach((product) => {
  const item = groupedItems[product];
  orderItemsHtml += `
    <div class="d-flex justify-content-between align-items-center" style="border: 1px solid #ddd; padding: 10px; border-radius: 8px;">
      <div class="flex-grow-1" style=" font-size: 20px; color:#e3351f">
        ${product}
      </div>
      <div style="font-size: 15px;">
        <p style="margin: 0; color:black">Qty: ${item.quantity}</p>
        <p style="margin: 0; color:black">Total: ₹${item.product_total.toFixed(2)}</p>
      </div>
    </div>
  `;
});

orderItemsHtml += '</div>';


    orderItemsHtml += '</ul></div>';

    orderDetailsContainer.innerHTML += orderItemsHtml;

    // Order Summary Section
    const orderSummaryHtml = `
          <div class="order-summary">
            <p><strong>SubTotal:</strong> ₹${calculateMainTotal(data.data)}</p>
            <p><strong>SGST (@2.5%):</strong> ₹${taxCalculate(data.data)}</p>
            <p><strong>CGST (@2.5%):</strong> ₹${taxCalculate(data.data)}</p>
            <p><strong>Grand Total:</strong> ₹${calculateGrandTotal(data.data)}</p>
          </div>
    `;
    orderDetailsContainer.innerHTML += orderSummaryHtml;

    // Optionally, add a 'Place Order' button for Delivery orders
    if (data.data[0].areaName == "Delivery") {
      const placeOrderHtml = `
        <div class="place-order justify-content-center d-flex ">
          <button id="placeOrderButton" type="button" class="btn btn-danger shadow p-3 w-lg-25 w-50"
                  style="border-radius: 15px; white-space: nowrap;"> 
            Place Order <i class="bi bi-arrow-right"></i>
          </button>
        </div>
      `;
      orderDetailsContainer.innerHTML += placeOrderHtml;

      document
        .getElementById("placeOrderButton")
        .addEventListener("click", function () {
          handleRazorpayPayment(data);
        });
    }
  } else {
    // Display a message if there are no orders
    orderDetailsContainer.innerHTML = '<p class="text-muted text-red">No orders found.</p>';
  }
}



async function handleRazorpayPayment(data) {
  const grandTotal = calculateGrandTotal(data.data);
  const options = {
    key: "rzp_test_tum0cwIoU0JwTK", //"rzp_live_4QTPtvuLyjnJzo",<- This is Live Key
    //secret of test key : "fs6wI1P2fl5Mkv4EVnrdG7LT"
    amount: grandTotal * 100, // Convert amount to paise
    currency: "INR",
    name: "Extraaazpos.com",
    description: "RazorPay",
    image:
      "https://extraaazpos.com/wp-content/uploads/2023/11/cropped-Extraswaadpos-logo-e1699955802191.webp",
    prefill: {
      name: data.data[0].areaName, // Replace with the appropriate name
      email: data.data[0].table_id, // Replace with the appropriate email
    },
    theme: {
      color: "#FF7529",
    },
    handler: async function (response) {
      console.log("Payment Id :", response);
      if (response.razorpay_payment_id) {
        storeToOrderKOtPayments(response, data, grandTotal);
      } else {
        handlePaymentFailure(response);
      }
    },
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

async function storeToOrderKOtPayments(response, data, grandTotal) {
  console.log("Store DAta", data);

  var tableId = data.data[0].table_id;
  var restaurantId = data.data[0].restaurant_id;
  var loc_id = data.data[0].loc_id;
  var areaName = data.data[0].areaName;
  var bill_amount = grandTotal;
  const token = sessionStorage.getItem("token");
  const selectedAddressId = sessionStorage.getItem("selectedAddressId");
  const razorPayId = response.razorpay_payment_id;

  console.log("RazorPay Id", razorPayId);
  // return;

  if (token == null) {
    window.location.href = "index.html";
  }

  const apiUrl = url + `/api/storeToKot`;

  const requestBody = {
    table_id: tableId,
    location_id: loc_id,
    restaurant_id: restaurantId,
    sectionName: tableId, // "AC / 3", // Same as TabeId if not Dine-in
    areaName: areaName, // "Dine-In", // Delivery
    kitchenInstruction: null,
    billNote: null,
    internal_note: null,
    bill_amount: grandTotal,
    selectedAddressId: selectedAddressId,
    razorPayId: razorPayId,
  };

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((data2) => {
      console.log("Main data : ", data2);
      // return;
      if (data2.success) {
        sessionStorage.setItem("cart", null);
        window.location.href =
          "success-page.html?tableId=" + JSON.stringify(data.data[0].table_id);
      } else {
        window.alert("Problem is processing the Order!");
      }
      // return data;
    })
    .catch((error) => {
      console.error("Error fetching order details:", error);
    });
}

function taxCalculate(data) {
  const grandTotal = data.reduce(
    (total, order) => total + parseFloat(order.product_total) * 0.025,
    0
  );
  return grandTotal.toFixed(3);
}

function calculateMainTotal(data) {
  const grandTotal = data.reduce(
    (total, order) => total + parseFloat(order.product_total),
    0
  );
  return grandTotal.toFixed(2); // Format to two decimal places
}

function calculateGrandTotal(data) {
  const grandTotal = data.reduce(
    (total, order) =>
      total +
      (parseFloat(order.product_total) +
        parseFloat(order.product_total) * 0.05),
    0
  );
  return grandTotal.toFixed(2); // Format to two decimal places
}
