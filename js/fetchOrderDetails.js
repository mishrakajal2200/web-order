// // fetchOrderDetails.js

// document.addEventListener("DOMContentLoaded", async function () {
//   var url = "";
//   var restaurant_id = "";
//   const token = sessionStorage.getItem("token");

//   if (token == null) {
//     window.location.href = "login.html";
//   }

//   fetch("/env.json")
//     .then((response) => response.json())
//     .then(async (data) => {
//       url = data.URL;
//       // restaurant_id = data.RESTAURANT_ID;
//       restaurant_id = localStorage.getItem("urlSegment");

//       console.log("API URL:", url);
//       console.log("Restaurant ID:", restaurant_id);

//       const urlParams = new URLSearchParams(window.location.search);
//       var tableId = urlParams.get("tableId");
//       await fetchOrderDetails(tableId);

//       // cancelButton(tableId);
//       async function fetchOrderDetails(tableId) {
//         const token = sessionStorage.getItem("token");

//         if (token == null) {
//           window.location.href = "login.html";
//         }
//         const apiUrl = url + `/api/getOrderDetails?tableId=${tableId}`;
//         console.log("Url :", apiUrl);

//         fetch(apiUrl, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + token,
//           },
//         })
//           .then((response) => response.json())
//           .then(async (data) => {
//             // Update the content on the success page with order details
//             console.log("Data", data);
//             await updateOrderDetails(data);
//             // return "Done";
//           })
//           .catch((error) => {
//             console.error("Error fetching order details:", error);
//           });
//       }

//       async function updateOrderDetails(orderDetails) {
//         const orderDetailsContainer = document.getElementById("orderDetails");
//          const appContainer = document.getElementById("app");

//         // Clear previous content
//         orderDetailsContainer.innerHTML = "";
//         // appContainer.innerHTML = '';

//         // Check if there are any orders
//         if (orderDetails.orderDetails.length > 0) {
//           // Display shared order details only once for the same bill_no
//           const firstOrder = orderDetails.orderDetails[0];
//           var customerAddress = "";
//           if (firstOrder.delivery_address_id != null) {
//             customerAddress = await getAddressDetailsById(
//               firstOrder.delivery_address_id
//             );
//           }
   
// //     const sharedOrderDetailsHtml = `
// //   ${
// //     firstOrder.areaName === "Delivery"
// //       ? `<p><strong>Delivering To :</strong> ${customerAddress.address}, ${customerAddress.pincode}, ${customerAddress.city}.</p>`
// //       : `<h2><strong>Order Number : </strong>${orderDetails.orderNumber}</h2>`
// //   }
// //   <div class="shared-order-details mt-3 mb-4 shadow">
// //     <h2 class="mt-2 pt-4 mb-3">Order Details
// //       <input id="timer_expired" type="hidden" value="${firstOrder.timer_expired}" />
// //       <button class="btn btn-danger rounded px-5 py-2 mb-1" style="margin-left: 60px; margin-right: 60px; display:none;" onclick="cancelOrder()" id="cancelOrderBtn">Cancel Order</button>
// //       <span id="timer"></span>
// //     </h2>
// //     <table class="table table-bordered table-striped table-hover">
// //       <tbody>
// //         <tr><td><strong>Area:</strong></td><td>${firstOrder.areaName}</td></tr>
// //         <tr><td><strong>Bill No:</strong></td><td>${firstOrder.bill_no}</td></tr>
// //         <tr><td><strong>Cover Count:</strong></td><td>${firstOrder.cover_count}</td></tr>
// //         <tr><td><strong>Grand Total:</strong></td><td>${calculateGrandTotal(orderDetails)}</td></tr>
// //       </tbody>
// //     </table>
// //   </div>
// // `;


// const sharedOrderDetailsHtml = `
//   ${
//     firstOrder.areaName === "Delivery"
//       ? `<p><strong>Delivering To :</strong> ${customerAddress.address}, ${customerAddress.pincode}, ${customerAddress.city}.</p>`
//       : `<h6 class="fs-2">Order Number :${orderDetails.orderNumber}</h6>` // Adjusted font size for Order Number
//   }
//   <div class="shared-order-details mt-3 mb-4 shadow">
//     <h6 class="mt-2 pt-4 mb-3 fs-1 text-center justify-content-center">Order Details <!-- Adjusted font size for Order Details -->
//       <input id="timer_expired" type="hidden" value="${firstOrder.timer_expired}" />
//       <button class="btn btn-danger rounded px-5 py-2 mb-1" style="margin-left: 60px; margin-right: 60px; display:none;" onclick="cancelOrder()" id="cancelOrderBtn">Cancel Order</button>
//       <span id="timer"></span>
//     </h6>
//     <table class="table table-bordered table-striped table-hover">
//       <tbody>
//         <tr><td><strong>Area:</strong></td><td>${firstOrder.areaName}</td></tr>
//         <tr><td><strong>Bill No:</strong></td><td>${firstOrder.bill_no}</td></tr>
//         <tr><td><strong>Cover Count:</strong></td><td>${firstOrder.cover_count}</td></tr>
//         <tr><td><strong>Grand Total:</strong></td><td>${calculateGrandTotal(orderDetails)}</td></tr>
//       </tbody>
//     </table>
//   </div>
// `;



//           // Append the HTML for shared order details to the container
//           orderDetailsContainer.innerHTML += sharedOrderDetailsHtml;
//           var count = 1;
//           // Build HTML for order items table
// //           const orderItemsTableHtml = `
// //        <div class="table-responsive">
// // <table class="table table-bordered table-striped table-hover shadow">
// //     <thead>
// //         <tr>
// //             <th> Sr. No</th>
// //             <th>Product Name</th>
// //             <th>Quantity</th>
// //             <th>Unit Price</th>
// //             <th>Total</th>
// //          </tr>
// //     </thead>
// //     <tbody>
// //         ${orderDetails.orderDetails
// //           .map(
// //             (order) => `
// //             <tr>
// //                 <td>${count++}</td>
// //                 <td>${order.product_name}</td>
// //                 <td>${order.quantity}</td>
// //                 <td>${order.unit_price}</td>
// //                 <td>${order.product_total}</td>
// //                 <!-- Add more table cells as needed -->
// //             </tr>
// //         `
// //           )
// //           .join("")}
// //     </tbody>
// // </table>
// // </div>

// //     `;
// const orderItemsTableHtml = `
//   <div class="table-responsive">
//     <table class="table table-bordered table-striped table-hover shadow">
//       <thead>
//         <tr>
//           <th>Sr. No</th>
//           <th>Product Name</th>
//           <th class="d-none d-sm-table-cell">Quantity</th> <!-- Hidden on extra-small screens -->
//           <th class="d-none d-sm-table-cell">Unit Price</th> <!-- Hidden on extra-small screens -->
//           <th>Total</th>
//         </tr>
//       </thead>
//       <tbody>
//         ${orderDetails.orderDetails
//           .map(
//             (order, index) => `
//             <tr>
//               <td>${index + 1}</td>
//               <td>${order.product_name}</td>
//               <td class="d-none d-sm-table-cell">${order.quantity}</td> <!-- Hidden on extra-small screens -->
//               <td class="d-none d-sm-table-cell">${order.unit_price}</td> <!-- Hidden on extra-small screens -->
//               <td>${order.product_total}</td>
//             </tr>
//           `
//           )
//           .join("")}
//       </tbody>
//     </table>
//   </div>
// `;


//           // Append the HTML for the order items table to the container
//           orderDetailsContainer.innerHTML += orderItemsTableHtml;
//         } else {
//           // Display a message if there are no orders
//           orderDetailsContainer.innerHTML =
//             '<p class="text-muted">No orders found.</p>';
//         }
//       }

//       function calculateGrandTotal(orderDetails) {
//         const grandTotal = orderDetails.orderDetails.reduce(
//           (total, order) =>
//             total +
//             (parseFloat(order.product_total) +
//               parseFloat(order.product_total) * 0.05),
//           0
//         );
//         return grandTotal.toFixed(2); // Format to two decimal places
//       }

//       async function getAddressDetailsById(addressId) {
//         const token = sessionStorage.getItem("token");

//         if (token == null) {
//           window.location.href = "login.html";
//         }

//         try {
//           const response = await fetch(
//             url + `/api/customerAddress/${addressId}`,
//             {
//               method: "GET",
//               headers: {
//                 Authorization: "Bearer " + token,
//                 "Content-Type": "application/json",
//               },
//             }
//           );

//           const data = await response.json();
//           console.log("Individual Address:", data);
//           // tableId = data;

//           return data.data;
//         } catch (error) {
//           console.error("Error fetching TableId:", error);
//           throw error;
//         }
//       }

//       var sessionStorageKey = "timerShown_" + tableId;
//       // console.log(sessionStorageKey);

//       var timer_value = document.getElementById("timer_expired");
//       console.log("Timer_value:", timer_value);

//       if (!sessionStorage.getItem(sessionStorageKey)) {
//         var seconds = sessionStorage.getItem("timerShown_" + tableId) || 60; //1200

//         var cancelOrderBtn = document.getElementById("cancelOrderBtn");
//         console.log("cancelOrderBtn", cancelOrderBtn);

//         function updateTimer() {
//           document.getElementById("cancelOrderBtn").style.display = "inline";
//           document.getElementById("timer").innerHTML = seconds + " seconds";
//           seconds--;

//           if (seconds < 0) {
//             clearInterval(timerInterval);
//             document.getElementById("cancelOrderBtn").style.display = "none";
//             document.getElementById("timer").innerHTML = "Time's up!";
//             setTimeout(function () {
//               document.getElementById("timer").innerHTML = "";
//             }, 1000);
//             sessionStorage.setItem(sessionStorageKey, true);
//           }
//         }
//         var timerInterval = setInterval(updateTimer, 1000);

//         // Save the remaining seconds in sessionStorage
//         window.addEventListener("beforeunload", function () {
//           sessionStorage.setItem("timerSeconds", seconds);
//         });
//       } else {
//         // If the timer has already been shown, display a message or perform any other desired action
//         // document.getElementById('cancelOrderBtn').style.display = 'none';
//         // document.getElementById("timer").innerHTML = "Timer already shown for this table_id";
//       }
//     })
//     .catch((error) => console.error("Error fetching env.json:", error));
// });

// function cancelOrder() {
//   const urlParams = new URLSearchParams(window.location.search);
//   var tableId = urlParams.get("tableId"); // Replace with the actual table_id

//   const token = sessionStorage.getItem("token");

//   if (token == null) {
//     window.location.href = "index.html";
//   }

//   fetch("/env.json")
//     .then((response) => response.json())
//     .then((data) => {
//       url = data.URL;
//       // const locationId = data.LOCATION;
//       // restaurant_id = data.RESTAURANT_ID;
//       restaurant_id = localStorage.getItem("urlSegment");

//       const apiUrl = url + `/api/cancelOrder?tableId=${tableId}`;

//       fetch(apiUrl, {
//         method: "PUT", // Assuming you use PUT method for updating the column
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: "Bearer " + token,
//         },
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           var order_status = document.getElementById("Order_status");
//           console.log("Hii");
//           order_status.textContent = "Order Cancelled";

//           // Handle the response as needed
//         })
//         .catch((error) => {
//           console.error("Error updating timer_expired column:", error);
//         });
//     })
//     .catch((error) => console.error("Error fetching env.json:", error));
// }

// function updateTimerExpiredColumn(tableId) {
//   // Assuming you have a function to make an API call to update the database

//   const apiUrl = url + `/api/updateTimerExpired?tableId=${tableId}`;

//   fetch(apiUrl, {
//     method: "PUT", // Assuming you use PUT method for updating the column
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: "Bearer " + token,
//     },
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       // Handle the response as needed
//     })
//     .catch((error) => {
//       console.error("Error updating timer_expired column:", error);
//     });
// }

// async function cancelButton(tableId) {
//   // var data15 = await fetchOrderDetails(tableId);
// }

// document.addEventListener("DOMContentLoaded", async function () {
//   let url = "";
//   let restaurant_id = "";
//   const token = sessionStorage.getItem("token");

//   if (!token) {
//     window.location.href = "login.html";
//   }

//   try {
//     const response = await fetch("/env.json");
//     const data = await response.json();
//     url = data.URL;
//     restaurant_id = localStorage.getItem("urlSegment");

//     console.log("API URL:", url);
//     console.log("Restaurant ID:", restaurant_id);

//     const urlParams = new URLSearchParams(window.location.search);
//     const tableId = urlParams.get("tableId");
//     console.log("Table ID:", tableId);

//     await fetchOrderDetails(tableId);
//   } catch (error) {
//     console.error("Error fetching environment data:", error);
//   }

//   async function fetchOrderDetails(tableId) {
//     const token = sessionStorage.getItem("token");

//     if (!token) {
//       window.location.href = "login.html";
//     }

//     const apiUrl = `${url}/api/getOrderDetails?tableId=${tableId}`;
//     console.log("Url :", apiUrl);

//     try {
//       const response = await fetch(apiUrl, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Data", data);
//       await updateOrderDetails(data);
//     } catch (error) {
//       console.error("Error fetching order details:", error);
//     }
//   }

//   async function updateOrderDetails(orderDetails,tableId) {
//     const orderDetailsContainer = document.getElementById("orderDetails");
//     const appContainer = document.getElementById("app");

//     // Clear previous content
//     orderDetailsContainer.innerHTML = "";

//     if (orderDetails.orderDetails.length > 0) {
//       const firstOrder = orderDetails.orderDetails[0];
//       let customerAddress = "";

//       if (firstOrder.delivery_address_id) {
//         customerAddress = await getAddressDetailsById(
//           firstOrder.delivery_address_id
//         );
//       }

//       const sharedOrderDetailsHtml = `
//         ${
//           firstOrder.areaName == "Delivery"
//             ? `<p><strong>Delivering To :</strong> ${customerAddress.address}, ${customerAddress.pincode}, ${customerAddress.city}.</p>`
//             : `<h2><strong>Order Number : </strong>${orderDetails.orderNumber}</h2>`
//         }
//         <div class="shared-order-details mt-3 mb-4 shadow">
//           <h2 class="mt-2 pt-4 mb-3">Order Details
//             <input id="timer_expired" type="hidden" value="${firstOrder.timer_expired}" />
//             <button class="btn btn-danger rounded px-5 py-2 mb-1" style="margin-left: 60px; margin-right: 60px; display:none;" onclick="cancelOrder()" id="cancelOrderBtn">Cancel Order</button>
//             <span id="timer"></span>
//           </h2>
//           <table class="table table-bordered table-striped table-hover">
//             <tbody>
//               <tr><td><strong>Area:</strong></td><td>${firstOrder.areaName}</td></tr>
//               <tr><td><strong>Bill No:</strong></td><td>${firstOrder.bill_no}</td></tr>
//               <tr><td><strong>Cover Count:</strong></td><td>${firstOrder.cover_count}</td></tr>
//               <tr><td><strong>Grand Total:</strong></td><td>${calculateGrandTotal(orderDetails)}</td></tr>
//             </tbody>
//           </table>
//         </div>
//       `;

//       orderDetailsContainer.innerHTML += sharedOrderDetailsHtml;
//       const orderItemsTableHtml = buildOrderItemsTable(
//         orderDetails.orderDetails
//       );
//       orderDetailsContainer.innerHTML += orderItemsTableHtml;

//       setupTimer(tableId, firstOrder.timer_expired);
//     } else {
//       orderDetailsContainer.innerHTML =
//         '<p class="text-muted">No orders found.</p>';
//     }
//   }

//   function buildOrderItemsTable(orderDetails) {
//     let count = 1;
//     return `
//       <div class="table-responsive">
//         <table class="table table-bordered table-striped table-hover shadow">
//           <thead>
//             <tr>
//               <th> Sr. No</th>
//               <th>Product Name</th>
//               <th>Quantity</th>
//               <th>Unit Price</th>
//               <th>Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${orderDetails
//               .map(
//                 (order) => `
//               <tr>
//                 <td>${count++}</td>
//                 <td>${order.product_name}</td>
//                 <td>${order.quantity}</td>
//                 <td>${order.unit_price}</td>
//                 <td>${order.product_total}</td>
//               </tr>
//             `
//               )
//               .join("")}
//           </tbody>
//         </table>
//       </div>
//     `;
//   }

//   function calculateGrandTotal(orderDetails) {
//     const grandTotal = orderDetails.orderDetails.reduce(
//       (total, order) =>
//         total +
//         (parseFloat(order.product_total) +
//           parseFloat(order.product_total) * 0.05),
//       0
//     );
//     return grandTotal.toFixed(2); // Format to two decimal places
//   }

//   async function getAddressDetailsById(addressId) {
//     const token = sessionStorage.getItem("token");

//     if (!token) {
//       window.location.href = "login.html";
//     }

//     try {
//       const response = await fetch(`${url}/api/customerAddress/${addressId}`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Individual Address:", data);
//       return data.data;
//     } catch (error) {
//       console.error("Error fetching address details:", error);
//       throw error;
//     }
//   }

//   function setupTimer(tableId, timerExpired) {
//     const sessionStorageKey = `timerShown_${tableId}`;
//     let seconds = sessionStorage.getItem(sessionStorageKey) || 60; // Default to 60 seconds

//     if (!sessionStorage.getItem(sessionStorageKey)) {
//       const cancelOrderBtn = document.getElementById("cancelOrderBtn");

//       function updateTimer() {
//         cancelOrderBtn.style.display = "inline";
//         document.getElementById("timer").textContent = `${seconds} seconds`;
//         seconds--;

//         if (seconds < 0) {
//           clearInterval(timerInterval);
//           cancelOrderBtn.style.display = "none";
//           document.getElementById("timer").textContent = "Time's up!";
//           sessionStorage.setItem(sessionStorageKey, true);
//         }
//       }

//       const timerInterval = setInterval(updateTimer, 1000);

//       window.addEventListener("beforeunload", () => {
//         sessionStorage.setItem("timerSeconds", seconds);
//       });
//     }
//   }
// });

// function cancelOrder() {
//   const urlParams = new URLSearchParams(window.location.search);
//   const tableId = urlParams.get("tableId"); // Replace with the actual table_id
//   const token = sessionStorage.getItem("token");

//   if (!token) {
//     window.location.href = "login.html";
//   }

//   fetch("/env.json")
//     .then((response) => response.json())
//     .then((data) => {
//       const apiUrl = `${data.URL}/api/cancelOrder?tableId=${tableId}`;

//       fetch(apiUrl, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       })
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//           }
//           return response.json();
//         })
//         .then((data) => {
//           const order_status = document.getElementById("Order_status");
//           order_status.textContent = "Order Cancelled";
//         })
//         .catch((error) => {
//           console.error("Error cancelling order:", error);
//         });
//     })
//     .catch((error) => console.error("Error fetching env.json:", error));
// }

document.addEventListener("DOMContentLoaded", async function () {
  var url = "";
  var restaurant_id = "";
  const token = sessionStorage.getItem("token");

  if (token == null) {
    window.location.href = "login.html";
  }

  fetch("/env.json")
    .then((response) => response.json())
    .then(async (data) => {
      url = data.URL;
      restaurant_id = localStorage.getItem("urlSegment");

      console.log("API URL:", url);
      console.log("Restaurant ID:", restaurant_id);

      const urlParams = new URLSearchParams(window.location.search);
      var tableId = urlParams.get("tableId");
      await fetchOrderDetails(tableId);

      async function fetchOrderDetails(tableId) {
        const token = sessionStorage.getItem("token");

        if (token == null) {
          window.location.href = "login.html";
        }
        const apiUrl = `${url}/api/getOrderDetails?tableId=${tableId}`;
        console.log("Url:", apiUrl);

        fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then(async (data) => {
            console.log("Data", data);
            await updateOrderDetails(data);
          })
          .catch((error) => {
            console.error("Error fetching order details:", error);
          });
      }

      async function updateOrderDetails(orderDetails) {
        const orderDetailsContainer = document.getElementById("orderDetails");

        orderDetailsContainer.innerHTML = ""; // Clear previous content

        if (orderDetails.orderDetails.length > 0) {
          const firstOrder = orderDetails.orderDetails[0];
          let customerAddress = "";

          if (firstOrder.delivery_address_id != null) {
            customerAddress = await getAddressDetailsById(
              firstOrder.delivery_address_id
            );
          }

          const sharedOrderDetailsHtml = `
            ${
              firstOrder.areaName === "Delivery"
                ? `<p><strong>Delivering To:</strong> ${customerAddress.address}, ${customerAddress.pincode}, ${customerAddress.city}.</p>`
                : `<h6 class="fs-2">Order Number: ${orderDetails.orderNumber}</h6>`
            }
            <div class="shared-order-details mt-3 mb-4 shadow">
              <h6 class="mt-2 pt-4 mb-3 fs-1 text-center">Order Details
                <input id="timer_expired" type="hidden" value="${firstOrder.timer_expired}" />
                <button class="btn btn-danger rounded px-5 py-2 mb-1" style="margin-left: 60px; margin-right: 60px; display:none;" onclick="cancelOrder()" id="cancelOrderBtn">Cancel Order</button>
                <span id="timer"></span>
              </h6>
              <table class="table table-bordered table-striped table-hover">
                <tbody>
                  <tr><td><strong>Area:</strong></td><td>${firstOrder.areaName}</td></tr>
                  <tr><td><strong>Bill No:</strong></td><td>${firstOrder.bill_no}</td></tr>
                  <tr><td><strong>Cover Count:</strong></td><td>${firstOrder.cover_count}</td></tr>
                  <tr><td><strong>Grand Total:</strong></td><td>${calculateGrandTotal(orderDetails)}</td></tr>
                </tbody>
              </table>
            </div>
          `;

          const orderItemsTableHtml = `
            <div class="table-responsive">
              <table class="table table-bordered table-striped table-hover shadow">
                <thead>
                  <tr>
                    <th>Sr. No</th>
                    <th>Product Name</th>
                    <th class="d-none d-sm-table-cell">Quantity</th>
                    <th class="d-none d-sm-table-cell">Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${orderDetails.orderDetails
                    .map(
                      (order, index) => `
                      <tr>
                        <td>${index + 1}</td>
                        <td>${order.product_name}</td>
                        <td class="d-none d-sm-table-cell">${order.quantity}</td>
                        <td class="d-none d-sm-table-cell">${order.unit_price}</td>
                        <td>${order.product_total}</td>
                      </tr>
                    `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          `;

          orderDetailsContainer.innerHTML += sharedOrderDetailsHtml;
          orderDetailsContainer.innerHTML += orderItemsTableHtml;
        } else {
          orderDetailsContainer.innerHTML =
            '<p class="text-muted">No orders found.</p>';
        }
      }

      function calculateGrandTotal(orderDetails) {
        const grandTotal = orderDetails.orderDetails.reduce(
          (total, order) =>
            total +
            (parseFloat(order.product_total) +
              parseFloat(order.product_total) * 0.05),
          0
        );
        return grandTotal.toFixed(2);
      }

      async function getAddressDetailsById(addressId) {
        const token = sessionStorage.getItem("token");

        if (token == null) {
          window.location.href = "login.html";
        }

        try {
          const response = await fetch(
            `${url}/api/customerAddress/${addressId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();
          console.log("Individual Address:", data);

          return data.data;
        } catch (error) {
          console.error("Error fetching address:", error);
          throw error;
        }
      }

      var sessionStorageKey = "timerShown_" + tableId;
      var timer_value = document.getElementById("timer_expired");

      if (!sessionStorage.getItem(sessionStorageKey)) {
        var seconds = sessionStorage.getItem("timerShown_" + tableId) || 60;

        function updateTimer() {
          document.getElementById("cancelOrderBtn").style.display = "inline";
          document.getElementById("timer").innerHTML = seconds + " seconds";
          seconds--;

          if (seconds < 0) {
            clearInterval(timerInterval);
            document.getElementById("cancelOrderBtn").style.display = "none";
            document.getElementById("timer").innerHTML = "Time's up!";
            setTimeout(function () {
              document.getElementById("timer").innerHTML = "";
            }, 1000);
            sessionStorage.setItem(sessionStorageKey, true);
          }
        }
        var timerInterval = setInterval(updateTimer, 1000);

        window.addEventListener("beforeunload", function () {
          sessionStorage.setItem("timerShown_" + tableId, seconds);
        });
      }
    });
});
