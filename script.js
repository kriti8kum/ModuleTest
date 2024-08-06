const API_KEY = 'iTa2G45r1IIUkhl7otur3YJD2kcekAgJXSmh26Uc'; 
const API_URL = 'https://api.nasa.gov/planetary/apod';

async function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    try {
        const response = await fetch(`${API_URL}?date=${currentDate}&api_key=${API_KEY}`);
        if (!response.ok) throw new Error(`Failed to fetch the current image. Status: ${response.status} - ${response.statusText}`);
        const data = await response.json();
        displayImage(data);
    } catch (error) {
        displayError(error.message);
    }
}

async function getImageOfTheDay(date) {
    try {
        const response = await fetch(`${API_URL}?date=${date}&api_key=${API_KEY}`);
        if (!response.ok) throw new Error(`Failed to fetch the image for the selected date. Status: ${response.status} - ${response.statusText}`);
        const data = await response.json();
        displayImage(data);
        saveSearch(date);
        addSearchToHistory();
    } catch (error) {
        displayError(error.message);
    }
}

function displayImage(data) {
    const imageContent = document.getElementById('image-content');
    const dateOverlay = `<div class="date-overlay">Picture on ${data.date}</div>`;
    imageContent.innerHTML = `
        ${dateOverlay}
        <img src="${data.url}" alt="${data.title}">
        <h3>${data.title}</h3>
        <p>${data.explanation}</p>
    `;
}

function displayError(message) {
    const imageContent = document.getElementById('image-content');
    imageContent.innerHTML = `<p class="error">Error: ${message}</p>`;
}

function saveSearch(date) {
    const searches = JSON.parse(localStorage.getItem('searches')) || [];
    if (!searches.includes(date)) {
        searches.push(date);
        localStorage.setItem('searches', JSON.stringify(searches));
    }
}

function addSearchToHistory() {
    const searches = JSON.parse(localStorage.getItem('searches')) || [];
    const searchHistory = document.getElementById('search-history');
    searchHistory.innerHTML = searches.map(date => `<li><a href="#" onclick="searchForDate('${date}')">${date}</a></li>`).join('');
}

document.getElementById('search-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const date = document.getElementById('search-input').value;
    if (date) {
        getImageOfTheDay(date);
    }
});

function searchForDate(date) {
    getImageOfTheDay(date);
}

getCurrentImageOfTheDay();
addSearchToHistory();
