let mediaRecorder;
let recordedChunks = [];

const recordButton = document.getElementById('record-button');
const stopButton = document.getElementById('stop-button');
const recordStatus = document.getElementById('record-status');
const recordedVideo = document.getElementById('recorded-video');

recordButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: { mediaSource: 'screen' } });

        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            recordedVideo.src = url;
        };

        mediaRecorder.start();
        recordButton.style.display = 'none';
        stopButton.style.display = 'inline-block';
        recordStatus.textContent = 'Recording...';
    } catch (error) {
        console.error('Error starting recording:', error);
    }
}