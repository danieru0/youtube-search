(function () {
    
    const favBtn = document.getElementById('favorites'),
          searchBar = document.getElementById('search'),
          container = document.getElementById('container');
    let nextToken, searchValue,
        iframe = document.getElementById('ytplayer'),
        player = document.getElementById('player'),
        playerClose = document.getElementById('player-close'),
        playerFavorite = document.getElementById('player-favorite');
    
    searchBar.addEventListener('keydown', function(e) {
        if(e.keyCode == 13) {
            getFirstVideos(this.value);
            container.innerHTML = '';
        }
    });
    
    container.addEventListener('click', function(e) {
        if(e.target.className == 'video-overlay' || e.target.className == 'video-title') {
            iframe.src = 'http://www.youtube.com/embed/'+e.target.parentNode.id+'?autoplay=1';
            player.classList.remove('off');
        }
    }, false);
    
    playerClose.addEventListener('click', function() {
        iframe.src = ' ';
        player.classList.add('off');
    });
    
    function getFirstVideos(search) {
        fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&type=video&q='+search+'&key=AIzaSyAt-Br2DTEGJ8D05QL0ssEVNZhkMGyjSKo')
        .then(resp => resp.json())
        .then(resp => {
            nextToken = resp.nextPageToken;
            for(let i = 0; i < resp.items.length; i++) {
                generateVideos(resp.items[i].snippet.title, resp.items[i].snippet.thumbnails.medium.url, resp.items[i].id.videoId);
            }
        });
    }
    
    function generateVideos(videoTitle, videoThumbnail, videoId) {
        let btnVideo = document.createElement('button'),
            btnOverlay = document.createElement('div'),
            btnImage = document.createElement('img'),
            btnTitle = document.createElement('span');
        btnVideo.id = videoId;
        btnVideo.className = 'video';
        btnOverlay.className = 'video-overlay';
        btnVideo.appendChild(btnOverlay);
        btnImage.src = videoThumbnail;
        btnVideo.appendChild(btnImage);
        btnTitle.className = 'video-title';
        btnTitle.textContent = videoTitle;
        btnVideo.appendChild(btnTitle);
        container.appendChild(btnVideo);
    }
    
})();