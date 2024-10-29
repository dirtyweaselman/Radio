const display = document.getElementById('station-info') as HTMLElement;
const playPauseBtn = document.getElementById('play-pause') as HTMLButtonElement;
const powerBtn = document.getElementById('power') as HTMLButtonElement;
const presets = document.querySelectorAll('.preset-button') as NodeListOf<HTMLButtonElement>;

let currentStation: HTMLAudioElement | null = null;
let isPlaying = false;
let isPoweredOn = false;
let currentVolume = 0.5; // Set initial volume

// Set the initial volume on the volume slider
const volumeSlider = document.getElementById('volume-slider') as HTMLInputElement;
volumeSlider.value = currentVolume.toString();

// Helper to update display without removing the volume control
function updateDisplay(message: string) {
    const stationInfoText = document.getElementById('station-info-text');
    if (stationInfoText) {
        stationInfoText.innerText = isPoweredOn ? message : 'OFF';
    }
}

// Toggle Power
powerBtn.addEventListener('click', () => {
    isPoweredOn = !isPoweredOn;
    if (!isPoweredOn && currentStation) {
        currentStation.pause();
        currentStation = null;
        isPlaying = false;
    }
    updateDisplay('Select a station');
});

// Play or Pause the current station
playPauseBtn.addEventListener('click', () => {
    if (!isPoweredOn || !currentStation) return;

    if (isPlaying) {
        currentStation.pause();
        updateDisplay('Paused');
    } else {
        currentStation.play();
        updateDisplay('Playing');
    }
    isPlaying = !isPlaying;
});

// Preset Buttons
presets.forEach((preset) => {
    preset.addEventListener('click', () => {
        if (!isPoweredOn) return;

        const stationUrl = preset.getAttribute('data-station') as string;

        // Stop current station if a new one is selected
        if (currentStation) {
            currentStation.pause();
        }

        // Check if the URL is "empty"
        if (stationUrl === 'empty') {
            currentStation = new Audio('/static.mp3'); // Fallback to static sound
            currentStation.loop = true; // Set to loop
        } else {
            currentStation = new Audio(stationUrl); // Use the provided station URL
        }

        currentStation.volume = currentVolume; // Set volume to current slider value
        currentStation.play();
        isPlaying = true;
        updateDisplay(`${preset.innerText}`);
    });
});

// Adjust volume based on slider
volumeSlider.addEventListener('input', () => {
    currentVolume = parseFloat(volumeSlider.value);
    if (currentStation) {
        currentStation.volume = currentVolume; // Adjust volume for current station
    }
});
