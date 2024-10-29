var display = document.getElementById('station-info');
var playPauseBtn = document.getElementById('play-pause');
var powerBtn = document.getElementById('power');
var presets = document.querySelectorAll('.preset-button');
var currentStation = null;
var isPlaying = false;
var isPoweredOn = false;
var currentVolume = 0.5; // Set initial volume
// Set the initial volume on the volume slider
var volumeSlider = document.getElementById('volume-slider');
volumeSlider.value = currentVolume.toString();
// Helper to update display without removing the volume control
function updateDisplay(message) {
    var stationInfoText = document.getElementById('station-info-text');
    if (stationInfoText) {
        stationInfoText.innerText = isPoweredOn ? message : 'OFF';
    }
}
// Toggle Power
powerBtn.addEventListener('click', function () {
    isPoweredOn = !isPoweredOn;
    if (!isPoweredOn && currentStation) {
        currentStation.pause();
        currentStation = null;
        isPlaying = false;
    }
    updateDisplay('Select a station');
});
// Play or Pause the current station
playPauseBtn.addEventListener('click', function () {
    if (!isPoweredOn || !currentStation)
        return;
    if (isPlaying) {
        currentStation.pause();
        updateDisplay('Paused');
    }
    else {
        currentStation.play();
        updateDisplay('Playing');
    }
    isPlaying = !isPlaying;
});
// Preset Buttons
presets.forEach(function (preset) {
    preset.addEventListener('click', function () {
        if (!isPoweredOn)
            return;
        var stationUrl = preset.getAttribute('data-station');
        // Stop current station if a new one is selected
        if (currentStation) {
            currentStation.pause();
        }
        // Check if the URL is "empty"
        if (stationUrl === 'empty') {
            currentStation = new Audio('/static.mp3'); // Fallback to static sound
            currentStation.loop = true; // Set to loop
        }
        else {
            currentStation = new Audio(stationUrl); // Use the provided station URL
        }
        currentStation.volume = currentVolume; // Set volume to current slider value
        currentStation.play();
        isPlaying = true;
        updateDisplay("".concat(preset.innerText));
    });
});
// Adjust volume based on slider
volumeSlider.addEventListener('input', function () {
    currentVolume = parseFloat(volumeSlider.value);
    if (currentStation) {
        currentStation.volume = currentVolume; // Adjust volume for current station
    }
});
