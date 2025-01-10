
// scripts/app.js
document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('upload-form');
  const imageInput = document.getElementById('image-upload');
  const imagePreview = document.getElementById('image-preview');

  const uploadLabel = document.getElementById('upload-label');
  const spinner = document.getElementById('spinner');

  const API_BASE_URL = 'http://api.similarfaces2.me'; 
  const FRONTEND_BASE_URL = 'http://similarfaces2.me'; 

  var celebrities = [];
  let currentCelebrityIndex = 0;

  const scrollContainer = document.getElementById('scroll-container');

  let isDragging = false; // To track dragging state
  let startX; // Starting X position of the drag
  let scrollLeft; // Initial scroll position of the container

  // Mouse/Touch Down Event
  scrollContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    scrollContainer.classList.add('cursor-grabbing'); // Change cursor to grabbing
    startX = e.pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
  });

  scrollContainer.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
  });

  // Mouse/Touch Move Event
  scrollContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent selection/highlighting
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX); // Multiplier for faster scrolling
    scrollContainer.scrollLeft = scrollLeft - walk;
  });

  scrollContainer.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollContainer.offsetLeft;
    const walk = (x - startX);
    scrollContainer.scrollLeft = scrollLeft - walk;
  });

  // Mouse/Touch Up Event
  scrollContainer.addEventListener('mouseup', () => {
    isDragging = false;
    scrollContainer.classList.remove('cursor-grabbing');
  });

  scrollContainer.addEventListener('mouseleave', () => {
    isDragging = false;
    scrollContainer.classList.remove('cursor-grabbing');
  });

  scrollContainer.addEventListener('touchend', () => {
    isDragging = false;
  });


  // Click Event to Trigger File Input
  imageInput.addEventListener('click', () => {
    imageInput.click();
  });

  // Keyboard Accessibility: Trigger File Input on Enter or Space
  imageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      imageInput.click();
    }
  });

  // Drag and Drop Functionality
  uploadLabel.addEventListener('dragover', (event) => {
    console.log("dragging")
    event.preventDefault();
    uploadLabel.classList.add('border-teal-400');
  });

  uploadLabel.addEventListener('dragleave', () => {
    event.preventDefault();
    console.log("left")
    uploadLabel.classList.remove('border-teal-400');
  });

  imageInput.addEventListener('drop', (event) => {
    event.preventDefault();
    imageInput.classList.remove('border-teal-400');
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      uploadImage(file);
    }
  });

function populateResults(urls) {
  const scrollContainer = document.getElementById('scroll-container');
  const resultContainer = scrollContainer.querySelector('.flex'); // The flex container inside scroll-container

  // Clear any existing results
  resultContainer.innerHTML = '';

  // Loop through the URLs and generate result cards
  urls.forEach((url, index) => {
    // Create the card container
    const card = document.createElement('div');
    card.className =
      'w-36 bg-gray-800 p-4 rounded-md text-center transition-transform transform hover:-translate-y-1 flex-shrink-0';

    // Create the image container
    const imageDiv = document.createElement('div');
    imageDiv.className =
      'w-full h-24 bg-gray-700 rounded-md mb-2 bg-center bg-cover';
    imageDiv.style.backgroundImage = `url('${FRONTEND_BASE_URL}/${url}')`;

    // Append elements
    card.appendChild(imageDiv);
    resultContainer.appendChild(card);
  });

  // Make the results section visible
  scrollContainer.classList.remove('hidden');
}

function updatePreview(imageURL) {
    imagePreview.style.backgroundImage = `url("${imageURL}")`;
    imagePreview.classList.add('bg-cover', 'bg-center'); 
}

function drawFaceOutline(facialArea, originalWidth, originalHeight) {
  const preview = document.getElementById('image-preview');
  const previewWidth = preview.clientWidth;
  const previewHeight = preview.clientHeight;

  const scaleX = previewWidth / originalWidth;
  const scaleY = previewHeight / originalHeight;

  const boxX = facialArea.x * scaleX;
  const boxY = facialArea.y * scaleY;
  const boxW = facialArea.w * scaleX;
  const boxH = facialArea.h * scaleY;

  const oldOutline = document.getElementById('face-outline');
  if (oldOutline) {
    oldOutline.remove();
  }

  const faceOutline = document.createElement('div');
  faceOutline.id = 'face-outline';

  faceOutline.classList.add(
    'absolute',
    'border-2',
    'border-red-500',
    'pointer-events-none'
  );

  
  faceOutline.style.left = boxX + 'px';
  faceOutline.style.top = boxY + 'px';
  faceOutline.style.width = boxW + 'px';
  faceOutline.style.height = boxH + 'px';

  preview.appendChild(faceOutline);
}

  // Change Event for File Input
  imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    uploadImage(file);
    scrollContainer.classList.remove("hidden")
  });

   async function uploadImage(file) {
      const imageUrl = URL.createObjectURL(file);
      updatePreview(imageUrl)

      const formData = new FormData();
      formData.append('image', file);

      const tempImg = new Image();
      tempImg.src = imageUrl;

      tempImg.onload = async () => {
        const w = tempImg.naturalWidth
        const h = tempImg.naturalHeight

        spinner.classList.remove("hidden")
        const response = await fetch(`${API_BASE_URL}/similarity`, {
          method: 'POST',
          body: formData
        });
        spinner.classList.add("hidden")

         if (response.ok) {
         responseJson = await(response.json())

         celebrities = responseJson["similar_urls"]
         facialArea = responseJson["facial_area"]

         drawFaceOutline(facialArea, w, h)

         console.log(celebrities)
         populateResults(celebrities)
         } else {
         console.log("error with response")
         }
      };
    }
});

