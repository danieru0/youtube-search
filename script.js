(function () {

    const favBtn = document.getElementById('favorites'),
          searchBar = document.getElementById('search'),
          container = document.getElementById('container');
    let nextToken, searchValue,
        iframe = document.getElementById('ytplayer'),
        player = document.getElementById('player'),
        playerClose = document.getElementById('player-close'),
        playerFavorite = document.getElementById('player-favorite'),
        favorites = [],
        FavId, FavName, favImg, inFavorites;
    
    //search input
    searchBar.addEventListener('keydown', function(e) {
        if(e.keyCode == 13) {
            getFirstVideos(this.value);
            container.innerHTML = '';
            searchValue = this.value;
            inFavorites = false;
        }
    });
    
    //listener for all videos
    container.addEventListener('click', function(e) {
        //video watch
        if(e.target.className == 'video-overlay' || e.target.className == 'video-title') {
            iframe.src = 'https://www.youtube.com/embed/'+e.target.parentNode.id+'?autoplay=1';
            player.classList.remove('off');
            FavId = e.target.parentNode.id;
            FavName = e.target.parentNode.childNodes[2].textContent;
            FavImg = e.target.parentNode.childNodes[1].src;
        }
        //favorites remove
        if(e.target.className == 'fa fa-times remove') {
            e.target.parentNode.remove();
            favorites = [ ];
            let videoElements = document.querySelectorAll('.video');
            if(videoElements.length == 0) {
                localStorage.removeItem('favorites');
            } else {
                for (let i = 0; i < videoElements.length; i++) {
                    favorites.push({
                        title: videoElements[i].childNodes[2].textContent,
                        img: videoElements[i].childNodes[1].src,
                        id: videoElements[i].id
                    });
                    console.log(favorites);
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                }
            }
        }
    }, false);
    
    //favorites button
    favBtn.addEventListener('click', function() {
        let favoritesLoad = JSON.parse(localStorage.getItem('favorites'));
        if(favoritesLoad != null && favoritesLoad != undefined) {
            container.innerHTML = '';
            inFavorites = true;
            for (let i = 0; i < favoritesLoad.length; i++) {
                generateVideos(favoritesLoad[i].title, favoritesLoad[i].img, favoritesLoad[i].id, i);
            }
        }
    });
    
    //heart button
    playerFavorite.addEventListener('click', function(e) {
        favorites.push({
            title: FavName,
            img: FavImg,
            id: FavId
        });
        localStorage.setItem('favorites', JSON.stringify(favorites));
    });
    
    //close iframe
    playerClose.addEventListener('click', function() {
        iframe.src = ' ';
        player.classList.add('off');
    });
    
    //ifninite scroll
    window.addEventListener('scroll', function() {
        let scrollPosition = document.body.scrollHeight - pageYOffset;
        if(scrollPosition.toFixed(0) == document.body.clientHeight && inFavorites == false) {
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
    function generateVideos(videoTitle, videoThumbnail, videoId, favoriteNumber) {
        let btnVideo = document.createElement('div'),
            btnOverlay = document.createElement('div'),
            btnImage = document.createElement('img'),
            btnTitle = document.createElement('span');
        btnVideo.id = videoId;
        btnVideo.className = 'video ';
        btnOverlay.className = 'video-overlay';
        btnVideo.appendChild(btnOverlay);
        btnImage.src = videoThumbnail;
        btnVideo.appendChild(btnImage);
        btnTitle.className = 'video-title';
        btnTitle.textContent = videoTitle;
        btnVideo.appendChild(btnTitle);
        if(inFavorites == true) {
            btnRemove = document.createElement('span');
            btnRemove.className = 'fa fa-times remove';
            btnVideo.appendChild(btnRemove);
        }
        container.appendChild(btnVideo);
    }
    
})();