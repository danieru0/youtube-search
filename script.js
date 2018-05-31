(function () {
    
    const favBtn = document.getElementById('favorites'),
          searchBar = document.getElementById('search'),
          container = document.getElementById('container');
    let nextToken, searchValue,
        iframe = document.getElementById('ytplayer'),
        player = document.getElementById('player'),
        playerClose = document.getElementById('player-close'),
        playerFavorite = document.getElementById('player-favorite');
    
    //search input
    searchBar.addEventListener('keydown', function(e) {
        if(e.keyCode == 13) {
            getFirstVideos(this.value);
            container.innerHTML = '';
            searchValue = this.value;
        }
    });
    
    //listener for all videos
    container.addEventListener('click', function(e) {
        if(e.target.className == 'video-overlay' || e.target.className == 'video-title') {
            iframe.src = 'https://www.youtube.com/embed/'+e.target.parentNode.id+'?autoplay=1';
            player.classList.remove('off');
        }
        //mozilla
        if(typeof InstallTrigger !== 'undefined') {
            if(e.target.className == 'video') {
                iframe.src = 'https://www.youtube.com/embed/'+e.target.id+'?autoplay=1';
                player.classList.remove('off');
            }
        }
    }, false);
    
    //close iframe
    playerClose.addEventListener('click', function() {
        iframe.src = ' ';
        player.classList.add('off');
    });
    
    //ifninite scroll
    window.addEventListener('scroll', function() {
        if((document.body.scrollHeight - pageYOffset) == document.body.clientHeight) {
            fetch('https://www.googleapis.com/youtube/v3/search?pageToken='+nextToken+'&part=snippet&maxResults=50&type=video&q='+searchValue+'&key=AIzaSyAt-Br2DTEGJ8D05QL0ssEVNZhkMGyjSKo')
            .then(resp => resp.json())
            .then(resp => {
                nextToken = resp.nextPageToken;
                for(let i = 0; i < resp.items.length; i++) {
                    generateVideos(resp.items[i].snippet.title, resp.items[i].snippet.thumbnails.medium.url, resp.items[i].id.videoId);
                }
            });
        }

    });
    
    //function for getting first videos
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
    
    //function for generating videos
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