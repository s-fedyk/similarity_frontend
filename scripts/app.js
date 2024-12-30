
// scripts/app.js

document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('upload-form');
  const imageInput = document.getElementById('image-input');
  const uploadSpinner = document.getElementById('upload-spinner');
  const uploadBox = document.getElementById('upload-box');

  const API_BASE_URL = 'https://your-api.com'; // Replace with your actual API base URL

  // Function to fetch and display images
  async function fetchImages() {
    try {
      const response = await fetch(`${API_BASE_URL}/images`);
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const images = await response.json();
      displayImages(images);
    } catch (error) {
      console.error('Error fetching images:', error);
      alert('Error fetching images. Please try again later.');
    }
  }

  // Function to display images in the gallery
  function displayImages(images) {
    // Assuming you have a #image-gallery element
    const imageGallery = document.getElementById('image-gallery');
    imageGallery.innerHTML = ''; // Clear existing images
    images.forEach(img => {
      const imgElement = document.createElement('img');
      imgElement.src = img.url; // Adjust based on your API's response structure
      imgElement.alt = 'Uploaded Image';
      imgElement.loading = 'lazy'; // Optimize image loading
      imgElement.classList.add('w-full', 'h-auto', 'rounded', 'shadow-md');
      imageGallery.appendChild(imgElement);
    });
  }

  // Function to handle image upload
  async function uploadImage(event) {
    event.preventDefault(); // Prevent form submission

    const file = imageInput.files[0];
    if (!file) {
      alert('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      uploadSpinner.style.display = 'block'; // Show spinner
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Image uploaded successfully!');
        imageInput.value = ''; // Clear the input
        fetchImages(); // Refresh the image gallery
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

  // Initialize expandable list functionality
  imageInput.addEventListener('submit', uploadImage);
  setupExpandableList();
  // Initial fetch of images when the page loads
  //fetchImages();
});

