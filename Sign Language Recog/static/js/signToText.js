// Get references to the HTML elements
const videoCam = document.getElementById('initialImg');
const translatedField = document.getElementById('translated_field');
const changeModelButton = document.getElementById('changeModel');
const clearButton = document.getElementById('clearButton');
const selectModel = document.getElementById('modelName');

// Set up the webcam feed
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(stream => {
    videoCam.srcObject = stream;
    videoCam.play();
  })
  .catch(error => {
    console.error('Error accessing webcam:', error);
  });

// Handle model change
changeModelButton.addEventListener('click', () => {
  const selectedModel = selectModel.value;
  // Send a request to the Django view to update the model
  fetch(`/set-model/${selectedModel}`)
    .then(response => response.json())
    .then(data => {
      console.log(`Model changed to ${selectedModel}`);
    })
    .catch(error => {
      console.error('Error changing model:', error);
    });
});

// Handle clear button click
clearButton.addEventListener('click', () => {
  // Send a request to the Django view to clear the text
  fetch('/clear-sentence')
    .then(response => response.json())
    .then(data => {
      translatedField.textContent = '';
    })
    .catch(error => {
      console.error('Error clearing text:', error);
    });
});

// Set up WebSocket connection for real-time updates
const socket = new WebSocket(`ws://${window.location.host}/ws/sign-to-text/`);

socket.onmessage = event => {
  const data = JSON.parse(event.data);
  translatedField.textContent = data.translated_text;
};

socket.onclose = () => {
  console.log('WebSocket connection closed');
};

socket.onerror = error => {
  console.error('Error with WebSocket connection:', error);
};

// Handle model info button click
const infoButton = document.querySelector(".iconInfo");
const sectionInfo = document.querySelector(".modelInfo");
const overlay = document.querySelector(".overlay");
const modelName = document.getElementById("modelName");
const modelWords = document.querySelector(".modelWords");

const model100Words = "..."; // define model100Words
const model300Words = "..."; // define model300Words
const model1000Words = "..."; // define model1000Words
const model2000Words = "..."; // define model2000Words

infoButton.addEventListener("click", () => {
  sectionInfo.classList.remove("hiddenDisplay");
  overlay.classList.remove("hiddenDisplay");
  const dropdown_value = document.getElementById("modelName").value;
  if (dropdown_value == "model100") {
    sectionInfo.style.overflow = "hidden";
    sectionInfo.style.height = "auto";
    modelWords.textContent = model100Words;
  } else if (dropdown_value == "model300") {
    sectionInfo.style.overflow = "hidden";
    sectionInfo.style.height = "auto";
    modelWords.textContent = model300Words;
  } else if (dropdown_value == "model1000") {
    sectionInfo.style.overflow = "hidden";
    sectionInfo.style.height = "auto";
    modelWords.textContent = model1000Words;
  } else {
    sectionInfo.style.height = "80vh";
    sectionInfo.style.marginTop = "100px";
    sectionInfo.style.overflow = "hidden";
    sectionInfo.style.overflowY = "scroll";
    modelWords.textContent = model2000Words;
  }
});

overlay.addEventListener("click", () => {
  sectionInfo.classList.add("hiddenDisplay");
  overlay.classList.add("hiddenDisplay");
});

modelName.addEventListener("click", () => {
  const dropdown_value = document.getElementById("modelName").value;
  console.log(dropdown_value);
});