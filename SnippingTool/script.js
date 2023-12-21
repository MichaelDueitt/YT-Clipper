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

            // Extract video details using the YouTube Data API
            getVideoDetailsFromAPI(videoId);
        } else {
            // For other cases, you may need to implement additional handling
            alert('Unsupported video URL. Please enter a valid YouTube video URL.');
        }
    }

    function getVideoDetailsFromAPI(videoId) {
        // Include your API key
        const apiKey = 'YOUR_API_KEY';

        // Example API request to get video details
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;

        // Make the API request
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                // Handle the response data
                console.log(data);

                // Extract relevant information and find popular moments
                if (data.items && data.items.length > 0) {
                    var videoDetails = data.items[0];
                    var viewCount = videoDetails.statistics.viewCount;
                    var likeCount = videoDetails.statistics.likeCount;
                    var commentCount = videoDetails.statistics.commentCount;

                    // You can use these metrics to identify popular moments
                    console.log('View Count:', viewCount);
                    console.log('Like Count:', likeCount);
                    console.log('Comment Count:', commentCount);
                    
                    // You can implement your logic to identify popular moments based on the metrics.
                    // For example, consider segments with high like counts or high view counts.
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

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


// https://www.youtube.com/watch?v=jObOjhUkf50