
// scripts/app.js
document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('upload-form');
  const imageInput = document.getElementById('image-input');
  const uploadSpinner = document.getElementById('upload-spinner');
  const uploadBox = document.getElementById('upload-box');

  const API_BASE_URL = 'http://localhost:8080/similarity'; // Replace with your actual API base URL

  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const celebrityImage = document.querySelector('.celebrity-image');
  const celebrityDisplay = document.querySelector('.celebrity-display');

  var celebrities = [];

  let currentCelebrityIndex = 0;

  // Function to update Celebrity Display with Sliding Animation
  function updateCelebrity(index, direction) {

    // Ensure index is within bounds
    if (index < 0) {
      currentCelebrityIndex = celebrities.length - 1;
    } else if (index >= celebrities.length) {
      currentCelebrityIndex = 0;
    } else {
      currentCelebrityIndex = index;
    }

    celebrityImage.src = celebrities[currentCelebrityIndex];
  }

  // Function to handle image upload
  async function uploadImage(file) {
    if (!file) {
      showAlert('Please select an image to upload.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      uploadSpinner.style.display = 'flex'; // Show spinner
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        showAlert('Image uploaded successfully!', 'success');
        imageInput.value = ''; // Clear the input
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showAlert(`Error uploading image: ${error.message}`, 'error');
    } finally {
      uploadSpinner.style.display = 'none'; // Hide spinner
    }
  }

  // Function to show alert messages
  function showAlert(message, type) {
    // Create a message element
    const messageElement = document.createElement('div');
    if (type === 'success') {
      messageElement.className = 'bg-green-500 text-white p-3 rounded mb-4 w-4/5 max-w-4xl';
    } else if (type === 'error') {
      messageElement.className = 'bg-red-500 text-white p-3 rounded mb-4 w-4/5 max-w-4xl';
    }
    messageElement.textContent = message;
    uploadForm.prepend(messageElement);

    // Remove the message after a certain time
    const duration = type === 'success' ? 3000 : 5000;
    setTimeout(() => {
      messageElement.remove();
    }, duration);
  }

  // Click Event to Trigger File Input
  uploadBox.addEventListener('click', () => {
    imageInput.click();
  });

  // Keyboard Accessibility: Trigger File Input on Enter or Space
  uploadBox.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      imageInput.click();
    }
  });

  // Drag and Drop Functionality
  uploadBox.addEventListener('dragover', (event) => {
    event.preventDefault();
    uploadBox.classList.add('border-indigo-500', 'bg-neutral-600');
  });

  uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('border-indigo-500', 'bg-neutral-600');
  });

  uploadBox.addEventListener('drop', (event) => {
    event.preventDefault();
    uploadBox.classList.remove('border-indigo-500', 'bg-neutral-600');
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      uploadImage(file);
    }
  });

  // Change Event for File Input
  imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    uploadImage(file);
  });

  // Event Listeners for Navigation Buttons
  prevBtn.addEventListener('click', () => {
    updateCelebrity(currentCelebrityIndex - 1, 'left');
    console.log(currentCelebrityIndex)
  });

  nextBtn.addEventListener('click', () => {
    updateCelebrity(currentCelebrityIndex + 1, 'right');
    console.log(currentCelebrityIndex)
  });

  // Initial Display
  updateCelebrity(currentCelebrityIndex, null);

  // Function to handle image upload
  async function uploadImage(event) {

    const file = imageInput.files[0];
    if (!file) {
      alert('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      uploadSpinner.style.display = 'block'; // Show spinner
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Image uploaded successfully!');
        console.log("response is")
        celebrities = await response.json()
        updateCelebrity(0, null)
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Error uploading image: ${error.message}`);
    } finally {
      uploadSpinner.style.display = 'none'; // Hide spinner
    }
  }


  // Function to handle expandable list items
  function setupExpandableList() {
    const expandableButtons = document.querySelectorAll('.expandable-button');

    expandableButtons.forEach(button => {
      button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !expanded);

        const content = button.nextElementSibling;
        if (content) {
          if (expanded) {
            content.classList.add('hidden');
            content.classList.remove('block');
            // Rotate the icon back
            const icon = button.querySelector('svg');
            if (icon) {
              icon.classList.remove('rotate-180');
            }
          } else {
            content.classList.remove('hidden');
            content.classList.add('block');
            // Rotate the icon
            const icon = button.querySelector('svg');
            if (icon) {
              icon.classList.add('rotate-180');
            }
          }
        }
      });
    });
  }

  imageInput.addEventListener('submit', uploadImage);
  setupExpandableList();
});

