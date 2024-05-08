const gridContainer = document.querySelector(".grid-container");
for (let i = 0; i < 28 * 28; i++) {
  const gridItem = document.createElement("div");
  gridItem.classList.add("grid-item");
  gridContainer.appendChild(gridItem);
}

let isShiftPressed = false; // Flag to indicate if Shift key is pressed

// Function to handle keydown event
function handleKeyDown(event) {
  if (event.key === "Shift") {
    isShiftPressed = true;
  }

  if (event.ctrlKey) {
    // Iterate over each grid item and set its background color to black
    gridItems.forEach((gridItem) => {
      gridItem.style.backgroundColor = "#000000";
    });
  }
}

// Function to handle keyup event
function handleKeyUp(event) {
  if (event.key === "Shift") {
    isShiftPressed = false;
  }
}

// Add event listeners for keydown and keyup events
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

const gridItems = document.querySelectorAll(".grid-item");
let isDrawing = false;

// Function to handle mouse events on grid items
function handleGridItemEvent(e) {
  if (isDrawing && isShiftPressed) {
    e.target.style.backgroundColor = "#000000";
  } else if (isDrawing) e.target.style.backgroundColor = "#FFFFFF";
}

// Add event listeners to grid items
gridItems.forEach((gridItem) => {
  gridItem.addEventListener("mousedown", () => {
    isDrawing = true;
  });

  gridItem.addEventListener("mouseenter", handleGridItemEvent);

  gridItem.addEventListener("mouseup", () => {
    isDrawing = false;
  });
});

// Disable context menu on right-click to prevent it from interfering with drawing
gridContainer.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

// Function to generate a 28x28 matrix from the grid items
function generateMatrix(gridItems) {
  const matrix = [];
  for (let i = 0; i < 28; i++) {
    const row = [];
    for (let j = 0; j < 28; j++) {
      const index = i * 28 + j;
      const gridItem = gridItems[index];
      if (gridItem.style.backgroundColor === "rgb(255, 255, 255)") {
        row.push(1);
      } else {
        row.push(0);
      }
    }
    matrix.push(row);
  }
  return matrix;
}

const button = document.querySelector(".guess-button");
const buttonContainer = document.querySelector(".button-container");

button.addEventListener("click", () => {
  const matrix = generateMatrix(gridItems);
  console.log(matrix);
});
var loginButton = document.querySelector(".login-button");
var registerButton = document.querySelector(".register-button");
var h2login = document.querySelector(".logi");
var h2regis = document.querySelector(".regis");
var loginaccount = document.querySelector(".login_account");
var createaccount = document.querySelector(".create_account");
var backButton = document.querySelector(".back-login");
loginButton.addEventListener("click", () => {
  displayElement(loginaccount, "block", "static");
  displayElement(h2login, "block", "static");
  displayElement(loginButton, "none", "absolute");
  displayElement(registerButton, "none", "absolute");
});

registerButton.addEventListener("click", () => {
  displayElement(createaccount, "block", "static");
  displayElement(h2regis, "block", "static");
  displayElement(loginButton, "none", "absolute");
  displayElement(registerButton, "none", "absolute");
});

function onBack() {
  displayElement(createaccount, "none", "absolute");
  displayElement(h2regis, "none", "absolute");
  displayElement(loginaccount, "none", "absolute");
  displayElement(h2login, "none", "absolute");
  displayElement(loginButton, "inline-block", "static");
  displayElement(registerButton, "inline-block", "static");
}

fetch("/users/login")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    console.log(response);
    return response.json();
  })
  .then((data) => {
    if (data.validate === true) {
      console.log("Validation successful");
      displayElement(loginButton, "none", "absolute");
      displayElement(registerButton, "none", "absolute");
    } else {
      console.log("Validation failed");
    }
  })
  .catch((error) => {
    console.log("error: ", error);
  });

function displayElement(element, dislay, position) {
  element.style.display = dislay;
  element.style.position = position;
}

document
  .querySelector(".login_account")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(this);

    // Convert FormData to URL-encoded string
    const urlEncodedFormData = new URLSearchParams(formData).toString();

    fetch("/users/login", {
      method: "POST",
      body: urlEncodedFormData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => {
        if (!response.ok) {
          console.log("Login unsuccessful");
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === "Login successful") {
          console.log("Login successful!");
          onBack();
          displayElement(loginButton, "none", "absolute");
          displayElement(registerButton, "none", "absolute");
          buttonContainer.innerHTML += `<h2 style="display: block; position: static">
          Login successful!
        </h2>`;
          console.log(data);
        } else {
        }
      });
  });
