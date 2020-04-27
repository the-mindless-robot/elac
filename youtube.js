
console.log('scripting');
var tag = document.createElement('script');
tag.id = 'iframe-demo';
tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var videos = {};
function onYouTubeIframeAPIReady() {
    videos.video0 = new YT.Player('video-1', {
    height: '315',
    width: '560',
    videoId: 'hqh1MRWZjms',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
  videos.video1 = new YT.Player('video-2', {
    height: '315',
    width: '560',
    videoId: 'MMmOLN5zBLY',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
  videos.video2 = new YT.Player('video-3', {
    height: '315',
    width: '560',
    videoId: 'foLf5Bi9qXs',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
  videos.video3 = new YT.Player('video-4', {
    height: '315',
    width: '560',
    videoId: 'D9Ihs241zeg',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}


function onPlayerReady(event) {
    console.log('yt active');
}
function onPlayerStateChange(event) {
    console.log('video changed');
}
