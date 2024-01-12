// script.js
const form = document.getElementById("form");
const nameInput = document.getElementById("name");
const maleRadio = document.getElementById("male");
const femaleRadio = document.getElementById("female");
const predictionParagraph = document.getElementById("prediction");
const savedParagraph = document.getElementById("saved");
const saveButton = document.getElementById("save");
const clearButton = document.getElementById("clear");

// Validate the name format
function isValidName(name) {
    const nameRegex = /^[a-zA-Z\s]{1,255}$/;
    return nameRegex.test(name);
}

// Send the request to the genderize.io service and display the response
async function predictGender(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the name and gender values from the input elements
    const name = nameInput.value;
    const gender = maleRadio.checked ? "male" : "female";

    // Check if the name is valid
    if (!isValidName(name)) {
        // Display an error message for invalid name format
        predictionParagraph.textContent = "Invalid name format. Please enter a valid name.";
        predictionParagraph.style.backgroundColor = "red";
        return;
    }

    // Continue with the API request
    const url = `https://api.genderize.io/?name=${name}`;
    try {
        // Use the fetch API to send the request and get the response with a timeout of 5 seconds
        const response = await Promise.race([
            fetch(url),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 5000))
        ]);

        const data = await response.json();

        // Display the predicted gender and probability in the prediction section
        predictionParagraph.textContent = `${data.name}: ${data.gender} (${(data.probability * 100).toFixed(2)}%)`;

        // Check if the predicted gender matches the selected gender
        if (data.gender.toLowerCase() === gender) {
            // Change the background color to green
            predictionParagraph.style.backgroundColor = "green";
        } else {
            // Change the background color to red
            predictionParagraph.style.backgroundColor = "red";
        }

        // Load and display saved data for the specified name
        loadSavedData(name);
    } catch (error) {
        // Display the error message in the prediction section
        predictionParagraph.textContent = error.message;
        // Change the background color to gray
        predictionParagraph.style.backgroundColor = "gray";
    }
}

// Save the current answer to the local storage
function saveAnswer(name, gender) {
    // Check if the name and gender are not empty
    if (name && gender) {
        // Construct the answer object with the name and gender properties
        const answer = { name, gender };
        // Convert the answer object to a JSON string
        const answerJSON = JSON.stringify(answer);
        // Save the answer JSON string to the local storage with the name as the key
        localStorage.setItem(name, answerJSON);
    }
}

// Load and display saved data for the specified name
function loadSavedData(name) {
    // Check if there is saved data for the specified name
    const savedData = localStorage.getItem(name);
    if (savedData) {
        // Display the saved data in the saved section
        savedParagraph.textContent = savedData;
    } else {
        // If no saved data, display a message in the saved section
        savedParagraph.textContent = "No saved data for this name.";
    }
}

// Clear the local storage and the saved section
function clearAnswer() {
    // Get the name from the input element
    const name = nameInput.value;

    // Clear the local storage for the specified name
    localStorage.removeItem(name);

    // Clear the saved section
    savedParagraph.textContent = "";
}

// Add event listener to the form using onsubmit
form.onsubmit = predictGender;

// Add event listeners to the save button and clear button
saveButton.addEventListener("click", function () {
    const name = nameInput.value;
    const gender = maleRadio.checked ? "male" : "female";
    saveAnswer(name, gender);
    // Load and display saved data for the specified name
    loadSavedData(name);
});
clearButton.addEventListener("click", clearAnswer);

// Add event listener for radio buttons to update saved data when gender is changed
maleRadio.addEventListener("change", function () {
    const name = nameInput.value;
    const gender = maleRadio.checked ? "male" : "female";
    saveAnswer(name, gender);
    // Load and display saved data for the specified name
    loadSavedData(name);
});
femaleRadio.addEventListener("change", function () {
    const name = nameInput.value;
    const gender = femaleRadio.checked ? "female" : "male";
    saveAnswer(name, gender);
    // Load and display saved data for the specified name
    loadSavedData(name);
});
