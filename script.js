// Static weather data
const weatherData = [
    {
        location: "New York",
        temperature: "25°C",
        condition: "Sunny"
    },
    {
        location: "London",
        temperature: "18°C",
        condition: "Cloudy"
    },
    {
        location: "Tokyo",
        temperature: "22°C",
        condition: "Rainy"
    },
    {
        location: "Moscow",
        temperature: "-5°C",
        condition: "Snowy"
    },
    {
        location: "Sydney",
        temperature: "30°C",
        condition: "Sunny"
    },
    {
        location: "Paris",
        temperature: "20°C",
        condition: "Cloudy"
    },
    {
        location: "Mumbai",
        temperature: "32°C",
        condition: "Rainy"
    }
];

// DOM elements
const weatherCard = document.getElementById('weather-card');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const conditionElement = document.getElementById('condition');
const weatherIconElement = document.getElementById('weather-icon').querySelector('i');
const refreshButton = document.getElementById('refresh-btn');
const downloadButton = document.getElementById('download-btn');

// Current weather index
let currentWeatherIndex = 0;

// Function to update the weather card
function updateWeatherCard(index) {
    const weather = weatherData[index];
    
    // Update text content
    locationElement.textContent = weather.location;
    temperatureElement.textContent = weather.temperature;
    conditionElement.textContent = weather.condition;
    
    // Update weather icon
    weatherIconElement.className = ''; // Clear previous classes
    weatherIconElement.classList.add(`icon-${weather.condition.toLowerCase()}`);
    
    // Update card background based on condition
    weatherCard.className = 'weather-card'; // Reset class
    weatherCard.classList.add(weather.condition.toLowerCase());
}

// Function to handle refresh button click
function refreshWeather() {
    currentWeatherIndex = (currentWeatherIndex + 1) % weatherData.length;
    updateWeatherCard(currentWeatherIndex);
}

// Function to download weather report
function downloadWeatherReport() {
    const weather = weatherData[currentWeatherIndex];
    const reportContent = `Weather Report\n\nLocation: ${weather.location}\nTemperature: ${weather.temperature}\nCondition: ${weather.condition}`;
    
    // Create a blob with the report content
    const blob = new Blob([reportContent], { type: 'text/plain' });
    
    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `WeatherReport_${weather.location}.txt`;
    
    // Trigger download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Add event listeners
refreshButton.addEventListener('click', refreshWeather);
downloadButton.addEventListener('click', downloadWeatherReport);

// Initialize weather card with first weather data
updateWeatherCard(currentWeatherIndex);