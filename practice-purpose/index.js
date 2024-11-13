// URL of the API
const apiURL = "https://jsonplaceholder.typicode.com/posts";

// Function to fetch data from the API
async function fetchData() {
  try {
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    displayData(data);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

// Function to display data in the HTML
function displayData(data) {
  const container = document.getElementById("data-container");
  // Assuming the API returns an array of objects
  container.innerHTML = data
    .map(
      (item) => `
        <div class="item">
            <h2>${item.title}</h2>
            <p>${item.description}</p>
        </div>
    `
    )
    .join("");
}

// Call the fetchData function when the page loads
window.onload = fetchData;
