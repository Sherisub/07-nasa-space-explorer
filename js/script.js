document.addEventListener('DOMContentLoaded', () => {
  // Find our date picker inputs on the page
  const startInput = document.getElementById('startDate');
  const endInput = document.getElementById('endDate');

  // Call the setupDateInputs function from dateRange.js
  setupDateInputs(startInput, endInput);

  // Get references to DOM elements
  const fetchBtn = document.getElementById('fetchBtn');
  const gallery = document.getElementById('gallery');
  const loading = document.getElementById('loading');
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDate = document.getElementById('modalDate');
  const modalImage = document.getElementById('modalImage');
  const modalExplanation = document.getElementById('modalExplanation');
  const closeModalBtn = document.getElementById('closeModal');

  // NASA API Key — replace 'DEMO_KEY' with your own for higher limits
  const apiKey = 'nhxE5Y4ePSHa0fvbuvL6sWVqbdTrYZ7JkHsVjuhV';

  // Event listener for the "Get Space Images" button
  fetchBtn.addEventListener('click', async () => {
    const startDate = startInput.value;
    const endDate = endInput.value;

    // Validate date input
    if (!startDate || !endDate) {
      alert("Please select both dates.");
      return;
    }

    // Clear previous results and show loading message
    gallery.innerHTML = '';
    loading.classList.remove('hidden');

    try {
      // Fetch data from NASA APOD API
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`
      );
      const data = await response.json();

      // Check if data is an array (successful fetch)
      if (Array.isArray(data)) {
        data.forEach(item => {
          const card = document.createElement('div');
          card.classList.add('gallery-item');

          // Handle image type
          if (item.media_type === 'image') {
            card.innerHTML = `
              <img src="${item.url}" alt="${item.title}" />
              <h3>${item.title}</h3>
              <p>${item.date}</p>
            `;
            card.addEventListener('click', () => {
              showModal(item);
            });
          }

          // Handle video type
          else if (item.media_type === 'video') {
            card.innerHTML = `
              <h3>${item.title} (Video)</h3>
              <a href="${item.url}" target="_blank">Watch Video</a>
              <p>${item.date}</p>
            `;
          }

          // Append the card to the gallery
          gallery.appendChild(card);
        });
      } else {
        gallery.innerHTML = '<p>No results found for this date range.</p>';
      }
    } catch (error) {
      // Error handling
      console.error("Failed to fetch NASA data:", error);
      gallery.innerHTML = '<p>Error loading images. Please try again later.</p>';
    } finally {
      // Hide loading message
      loading.classList.add('hidden');
    }
  });

  // Show modal with image details
  function showModal(item) {
    modalTitle.textContent = item.title;
    modalDate.textContent = item.date;
    modalImage.src = item.hdurl || item.url;
    modalExplanation.textContent = item.explanation;
    modal.classList.remove('hidden');
  }

  // Close the modal when X is clicked
  closeModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });
});
