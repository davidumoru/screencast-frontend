// Function to start recording
function startRecording() {

    document.getElementById('record-status').textContent = 'Recording...';
}

document.getElementById('record-button').addEventListener('click', () => {
    startRecording();
});
