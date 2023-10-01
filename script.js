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

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      recordButton.style.display = 'inline-block';
      stopButton.style.display = 'none';
      recordStatus.textContent = 'Recording stopped. Uploading...';
  
      // Convert recordedChunks to a Blob
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
  
      // Create a FormData object and append the video blob
      const formData = new FormData();
      formData.append('video', blob, 'recorded-video.webm');
  
      // Make a POST request to your backend API endpoint
      fetch('http://localhost:5006/videos/upload', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          recordStatus.textContent = 'Recording stopped. Upload complete.';
        })
        .catch((error) => {
          console.error('Error uploading video:', error);
          recordStatus.textContent = 'Recording stopped. Upload failed.';
        });
    }
  }
  