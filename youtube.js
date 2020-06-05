
function loadYoutubeAPI() {
  console.log('loading youtube');
  var tag = document.createElement('script');
  tag.id = 'iframe-demo';
  tag.src = 'https://www.youtube.com/iframe_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function getVideoId(elacLevel) {
  const version = getRandomInt(listeningVideos[elacLevel].length);
  console.log('vid', elacLevel, version, listeningVideos[elacLevel][version]);
  logListeningVersion(elacLevel, version, listeningVideos[elacLevel][version]);
  return listeningVideos[elacLevel][version];
}

function logListeningVersion(level, version, id) {
  const key = level.toLowerCase() + "L";
  PLACEMENT[key] = version+"-"+id;
}

var videos = {};
function onYouTubeIframeAPIReady() {
  videos.video0 = new YT.Player('video-1', {
    height: '315',
    width: '560',
    videoId: getVideoId("ELAC15"),
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
  videos.video1 = new YT.Player('video-2', {
    height: '315',
    width: '560',
    videoId: getVideoId("ELAC23"),
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
  videos.video2 = new YT.Player('video-3', {
    height: '315',
    width: '560',
    videoId: getVideoId("ELAC33"),
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
  videos.video3 = new YT.Player('video-4', {
    height: '315',
    width: '560',
    videoId: getVideoId("ELAC145"),
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
  console.log('video players', videos);
}

function onPlayerReady(event) {
  console.log('yt active');
  event.target.unMute();
  event.target.setVolume(90);
}
function onPlayerStateChange(event) {
  console.log('video changed');
}
