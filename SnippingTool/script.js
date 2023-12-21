document.addEventListener('DOMContentLoaded', function () {
    var dropZone = document.getElementById('drop-zone');
    var fileInput = document.getElementById('file-input');
    var videoContainer = document.getElementById('video-container');
    var uploadedVideo = document.getElementById('uploaded-video');
    var pasteInput = document.getElementById('paste-input');
    var pasteButton = document.getElementById('paste-button');

    dropZone.addEventListener('click', function () {
        fileInput.click();
    });

    fileInput.addEventListener('change', function () {
        handleFile(fileInput.files[0]);
    });

    dropZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        dropZone.style.border = '2px dashed #333';
    });

    dropZone.addEventListener('dragleave', function () {
        dropZone.style.border = '2px dashed #ccc';
    });

    dropZone.addEventListener('drop', function (e) {
        e.preventDefault();
        dropZone.style.border = '2px dashed #ccc';

        handleFile(e.dataTransfer.files[0]);
    });

    pasteButton.addEventListener('click', function () {
        var videoUrl = pasteInput.value.trim();
        if (videoUrl) {
            handleUrl(videoUrl);
        } else {
            alert('Please enter a valid video URL.');
        }
    });

    function handleFile(file) {
        if (file && file.type.startsWith('video/')) {
            var reader = new FileReader();

            reader.onload = function (e) {
                uploadedVideo.src = e.target.result;
                videoContainer.style.display = 'block';

                // Extract video details using the YouTube Data API
                getVideoDetailsFromAPI(getYouTubeVideoId(videoUrl));
            };

            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid video file.');
        }
    }

    function handleUrl(url) {
        // Directly use the getYouTubeVideoId function without URL validation
        var videoId = getYouTubeVideoId(url);

        if (videoId) {
            // If it's a YouTube URL, use the YouTube iframe API
            var embedUrl = 'https://www.youtube.com/embed/' + videoId;

            // Create an iframe element
            var iframe = document.createElement('iframe');

            // Set attributes for the iframe
            iframe.setAttribute('width', '560');
            iframe.setAttribute('height', '315');
            iframe.setAttribute('src', embedUrl);
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allowfullscreen', 'true');

            // Replace the video container content with the iframe
            videoContainer.innerHTML = '';
            videoContainer.appendChild(iframe);

            videoContainer.style.display = 'block';


        }
    }

// script.js

async function fetchVideoData() {
    const apiKey = '068d0ffb05msh67bc2d25ae27f55p117387jsnf4aef62f3f23';
  
    // Get user input from the input box
    const videoUrlInput = document.getElementById('paste-input');
    const youtubeVideoUrl = videoUrlInput.value;
  
    // Extract video ID from the URL
    const videoId = extractVideoId(youtubeVideoUrl);
  
    if (!videoId) {
      console.error('Invalid YouTube video URL');
      return;
    }
  
    const apiUrl = `https://youtube138.p.rapidapi.com/video/details/?id=${videoId}&hl=en&gl=US`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'youtube138.p.rapidapi.com',
      },
    };
  
    try {
      const response = await fetch(apiUrl, options);
  
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        // You can parse and handle the response here
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  function extractVideoId(videoUrl) {
    const url = new URL(videoUrl);
    const videoId = url.searchParams.get('v');
    return videoId;
  }
  
  document.getElementById('paste-button').addEventListener('click', fetchVideoData);
  
      

      
      
    function isValidUrl(url) {
        // A simple URL validation function
        var pattern = /^(https?:\/\/)?([\w.]+)\.([a-z]{2,6}\.?)(\/[\w\.-]*)*\/?$/;
        return pattern.test(url);
    }

    function getYouTubeVideoId(url) {
        try {
            var urlObject = new URL(url);
            if (urlObject.hostname === 'www.youtube.com' || urlObject.hostname === 'youtu.be') {
                var searchParams = new URLSearchParams(urlObject.search);
                return searchParams.get('v') || urlObject.pathname.substring(1);
            }
        } catch (error) {
            console.error('Error parsing YouTube URL:', error);
        }
        return null;
    }
});