/*
            dddddddd
            d::::::d                          tttt
            d::::::d                       ttt:::t
            d::::::d                       t:::::t
            d:::::d                        t:::::t
    ddddddddd:::::d   aaaaaaaaaaaaa  ttttttt:::::ttttttt      aaaaaaaaaaaaa
  dd::::::::::::::d   a::::::::::::a t:::::::::::::::::t      a::::::::::::a
 d::::::::::::::::d   aaaaaaaaa:::::at:::::::::::::::::t      aaaaaaaaa:::::a
d:::::::ddddd:::::d            a::::atttttt:::::::tttttt               a::::a
d::::::d    d:::::d     aaaaaaa:::::a      t:::::t              aaaaaaa:::::a
d:::::d     d:::::d   aa::::::::::::a      t:::::t            aa::::::::::::a
d:::::d     d:::::d  a::::aaaa::::::a      t:::::t           a::::aaaa::::::a
d:::::d     d:::::d a::::a    a:::::a      t:::::t    tttttta::::a    a:::::a
d::::::ddddd::::::dda::::a    a:::::a      t::::::tttt:::::ta::::a    a:::::a
 d:::::::::::::::::da:::::aaaa::::::a      tt::::::::::::::ta:::::aaaa::::::a
  d:::::::::ddd::::d a::::::::::aa:::a       tt:::::::::::tt a::::::::::aa:::a
   ddddddddd   ddddd  aaaaaaaaaa  aaaa         ttttttttttt    aaaaaaaaaa  aaaa


   */
 //data values used in app

 let SAMPLE_DATA = null;
//  const sampleDataJSON = getData();
//  sampleDataJSON.then((result) => {
//      SAMPLE_DATA = result;
//      ELAC_DATA.reading = true;
//  });
 async function getData() {
     try {
         const response = await fetch('data.json');
         return response.json();
     } catch (err) {
         console.error('failed to load sample data: ', err);
     }
 }

 //placement object holds all data
 const PLACEMENT = {};

function buildVideoList(sheetData) {
    const videos = {};
    for(const row of sheetData.data) {
        for(const field in row) {
            const formattedField = formatValue(field);
            const value = typeof row[field] == 'string' && row[field].length > 0 ? row[field] : false;

            if(!value) continue; //skip if empty

            if(!videos.hasOwnProperty(formattedField)) {
                videos[formattedField] = [];
            }

            videos[formattedField].push(row[field].trim());
        }
    }
    return videos;
}

const videoList = new GoogleSheet(config.sheet, 2);
let listeningVideos = null;
// videoList.load(buildVideoList).then(videos => {
//     console.log('videos', videos);
//     listeningVideos = videos;
//     loadYoutubeAPI();
// });

function buildLogicRules(sheetData) {
    // console.log('sheetData', sheetData);
    const logic = {};
    for(let row of sheetData.data) {
        const readingKey = "R" + row.reading.trim();
        const listeningKey ="L" + row.listening.trim();
        const level = formatValue(row.level);
        const readingCourse = formatValue(row.course1);
        const listeningCourse = formatValue(row.course2);
        //check if reading key exists
        if(!logic.hasOwnProperty(readingKey)) {
            // add reading key
            logic[readingKey] = {};
        }
        // add value
        logic[readingKey][listeningKey] = {level, readingCourse, listeningCourse};
    }
    console.log('logic', logic);
    return logic;
}

function formatValue(value) {
    let formattedValue = removeSpaces(value).toUpperCase();
    return formattedValue;
}

function removeSpaces(string) {
    return string.replace(/\s/g, '');
}

//load and parse elac logic google sheet in the background
const elacLogic = new GoogleSheet(config.sheet);
let logicRules = null;
// elacLogic.load(buildLogicRules).then(logic => {
//     logicRules = logic
//     ELAC_DATA.logic = true;
// });

function loadAllData() {

    if(SAMPLE_DATA == null) {
        const sampleDataJSON = getData();
        sampleDataJSON.then((result) => {
            SAMPLE_DATA = result;
        });
    }
    if(listeningVideos == null) {
        videoList.load(buildVideoList).then(videos => {
            console.log('videos', videos);
            listeningVideos = videos;
            loadYoutubeAPI();
        });
    }
    if(logicRules == null) {
        elacLogic.load(buildLogicRules).then(logic => {
            logicRules = logic
        });
    }
}
loadAllData();




/*


                                               tttt
                                            ttt:::t
                                            t:::::t
                                            t:::::t
     ssssssssss       eeeeeeeeeeee    ttttttt:::::ttttttt    uuuuuu    uuuuuu ppppp   ppppppppp
   ss::::::::::s    ee::::::::::::ee  t:::::::::::::::::t    u::::u    u::::u p::::ppp:::::::::p
 ss:::::::::::::s  e::::::eeeee:::::eet:::::::::::::::::t    u::::u    u::::u p:::::::::::::::::p
 s::::::ssss:::::se::::::e     e:::::etttttt:::::::tttttt    u::::u    u::::u pp::::::ppppp::::::p
  s:::::s  ssssss e:::::::eeeee::::::e      t:::::t          u::::u    u::::u  p:::::p     p:::::p
    s::::::s      e:::::::::::::::::e       t:::::t          u::::u    u::::u  p:::::p     p:::::p
       s::::::s   e::::::eeeeeeeeeee        t:::::t          u::::u    u::::u  p:::::p     p:::::p
 ssssss   s:::::s e:::::::e                 t:::::t    ttttttu:::::uuuu:::::u  p:::::p    p::::::p
 s:::::ssss::::::se::::::::e                t::::::tttt:::::tu:::::::::::::::uup:::::ppppp:::::::p
 s::::::::::::::s  e::::::::eeeeeeee        tt::::::::::::::t u:::::::::::::::up::::::::::::::::p
  s:::::::::::ss    ee:::::::::::::e          tt:::::::::::tt  uu::::::::uu:::up::::::::::::::pp
   sssssssssss        eeeeeeeeeeeeee            ttttttttttt      uuuuuuuu  uuuup::::::pppppppp
                                                                               p:::::p
                                                                               p:::::p
                                                                              p:::::::p
                                                                              p:::::::p
                                                                              p:::::::p
                                                                              ppppppppp
 */
 //initial page setup


 //get elements to show/hide
 const CSID = document.getElementById('csid-container');
 const LOADER = document.getElementById('loader');

 //hold all panel data
 const PANELS = {};

 //get all panels
 //each panel has an index (data-index)
 PANELS.MAIN = document.getElementsByClassName('panel');
 PANELS.WRITING_PANELS = document.getElementsByClassName('sub-panel-writing');
 PANELS.READING_PANELS = document.getElementsByClassName('sub-panel-reading');
 PANELS.LISTEN_PANELS = document.getElementsByClassName('sub-panel-listen');
 PANELS.practice = false;
 PANELS.userForm = false;

 //sets indexes (data-index attribute); based on the total number of panels
 //hides all panels
 setPanelIndex(PANELS.MAIN);
 setPanelIndex(PANELS.WRITING_PANELS);
 setPanelIndex(PANELS.READING_PANELS);
 setPanelIndex(PANELS.LISTEN_PANELS);

 //hold all router data
 const ROUTER = {};

 //set default panel index to show
 ROUTER.ACTIVE_PANEL = 0;
 ROUTER.ACTIVE_SUB_PANEL = null;

 //default indexes of special panels
 ROUTER.USER_PANEL = 2;
 ROUTER.PLACEMENT_PANEL = Number(PANELS.MAIN.length) - 1;
 ROUTER.AREA = 'welcome';

 //default nav variables
 ROUTER.PREV_PANEL = null;
 ROUTER.NEXT_PANEL = null;
 ROUTER.PREV_SUB_PANEL = null;
 ROUTER.NEXT_SUB_PANEL = null;

 //default timer variables
 ROUTER.ACTIVE_TIMER = false;
 ROUTER.TIMER = null;
 ROUTER.LISTEN_PANELS_VISITED = [];

 //default selected course
 var SELECTED_COURSE = "none";

 //wait time before youtube videos play
 const WAIT_TIME = Number(config.waitTime);

 //set starting area
 setActiveArea(ROUTER.AREA);
 //build navigation based on initial panel to show
 buildPanelPagination(ROUTER.ACTIVE_PANEL);
 //show first panel
 displayPanel(ROUTER.ACTIVE_PANEL);



 /*






 nnnn  nnnnnnnn      aaaaaaaaaaaaavvvvvvv           vvvvvvv
 n:::nn::::::::nn    a::::::::::::av:::::v         v:::::v
 n::::::::::::::nn   aaaaaaaaa:::::av:::::v       v:::::v
 nn:::::::::::::::n           a::::a v:::::v     v:::::v
   n:::::nnnn:::::n    aaaaaaa:::::a  v:::::v   v:::::v
   n::::n    n::::n  aa::::::::::::a   v:::::v v:::::v
   n::::n    n::::n a::::aaaa::::::a    v:::::v:::::v
   n::::n    n::::na::::a    a:::::a     v:::::::::v
   n::::n    n::::na::::a    a:::::a      v:::::::v
   n::::n    n::::na:::::aaaa::::::a       v:::::v
   n::::n    n::::n a::::::::::aa:::a       v:::v
   nnnnnn    nnnnnn  aaaaaaaaaa  aaaa        vvv


 */
 // all actions related to navigating from panel to panel

 // this MUST be first in the order of events that fire
 let stop_btns = document.getElementsByClassName('stop');
 for (let i = 0; i < stop_btns.length; i++) {
     stop_btns[i].addEventListener('click', (e) => {
        //@TODO change to click target to get ID
         let video_id = ROUTER.ACTIVE_SUB_PANEL;
     //    let player = videosArray[video_id];
     //    console.log('plyer', player);
    //  console.log('videos', videos, 'id', video_id);
        let player = videos['video'+video_id];
        player.stopVideo();
     });
 }

 let next_panel_btns = document.getElementsByClassName('next');
 for (let i = 0; i < next_panel_btns.length; i++) {
     next_panel_btns[i].addEventListener('click', (e) => {
         checkArea(ROUTER.NEXT_PANEL);
         displayPanel(ROUTER.NEXT_PANEL);
     });
 }

 let skip_btns = document.getElementsByClassName('skip');
 for (let i = 0; i < skip_btns.length; i++) {
     skip_btns[i].addEventListener('click', (e) => {
        let nextPanel = e.target.dataset.skip;
        checkArea(nextPanel);
        displayPanel(nextPanel);
     });
 }

 let next_subPanel_btns = document.getElementsByClassName('next-sub');
 for (let i = 0; i < next_subPanel_btns.length; i++) {
     next_subPanel_btns[i].addEventListener('click', (e) => {
         let subj = getDataId(e.target);
         displayPanel(ROUTER.NEXT_SUB_PANEL, subj);
     });
 }

 let prev_subPanel_btns = document.getElementsByClassName('prev-sub');
 for (let i = 0; i < prev_subPanel_btns.length; i++) {
     prev_subPanel_btns[i].addEventListener('click', (e) => {
         let subj = getDataId(e.target);
         displayPanel(ROUTER.PREV_SUB_PANEL, subj);
     });
 }

 let set_level_btns = document.getElementsByClassName('setLevel');
 for (let i = 0; i < set_level_btns.length; i++) {
     set_level_btns[i].addEventListener('click', (e) => {

         let level = Number(e.target.dataset.value) - 1;
         //adjust for no level 5 samples in reading or listening
         if(level == 4) {
             level = 3;
         }

         let subj = getDataId(e.target);
         subj = subj.split("_")[0];

         displayPanel(level, subj);
     });
 }

 let placement_btns = document.getElementsByClassName('placement');
 for (let i = 0; i < placement_btns.length; i++) {
     placement_btns[i].addEventListener('click', (e) => {
         ROUTER.ACTIVE_PANEL = ROUTER.PLACEMENT_PANEL;
         displayPanel(ROUTER.PLACEMENT_PANEL);
     });
 }

 let practice_btns = document.getElementsByClassName('practice');
 for (let i = 0; i < practice_btns.length; i++) {
     practice_btns[i].addEventListener('click', (e) => {

        PANELS.practice = true;
         const practiceContent = document.querySelectorAll('.practice-content');
         const liveContent = document.querySelectorAll('.live-content');

         for(const elem of practiceContent) {
             elem.style.display = 'block';
         }

         for(const elem of liveContent) {
             elem.style.display = 'none';
         }
     });
 }




 /*


                           tttt                                    tttt
                        ttt:::t                                 ttt:::t
                        t:::::t                                 t:::::t
                        t:::::t                                 t:::::t
     ssssssssss   ttttttt:::::ttttttt      aaaaaaaaaaaaa  ttttttt:::::ttttttt    uuuuuu    uuuuuu      ssssssssss
   ss::::::::::s  t:::::::::::::::::t      a::::::::::::a t:::::::::::::::::t    u::::u    u::::u    ss::::::::::s
 ss:::::::::::::s t:::::::::::::::::t      aaaaaaaaa:::::at:::::::::::::::::t    u::::u    u::::u  ss:::::::::::::s
 s::::::ssss:::::stttttt:::::::tttttt               a::::atttttt:::::::tttttt    u::::u    u::::u  s::::::ssss:::::s
  s:::::s  ssssss       t:::::t              aaaaaaa:::::a      t:::::t          u::::u    u::::u   s:::::s  ssssss
    s::::::s            t:::::t            aa::::::::::::a      t:::::t          u::::u    u::::u     s::::::s
       s::::::s         t:::::t           a::::aaaa::::::a      t:::::t          u::::u    u::::u        s::::::s
 ssssss   s:::::s       t:::::t    tttttta::::a    a:::::a      t:::::t    ttttttu:::::uuuu:::::u  ssssss   s:::::s
 s:::::ssss::::::s      t::::::tttt:::::ta::::a    a:::::a      t::::::tttt:::::tu:::::::::::::::uus:::::ssss::::::s
 s::::::::::::::s       tt::::::::::::::ta:::::aaaa::::::a      tt::::::::::::::t u:::::::::::::::us::::::::::::::s
  s:::::::::::ss          tt:::::::::::tt a::::::::::aa:::a       tt:::::::::::tt  uu::::::::uu:::u s:::::::::::ss
   sssssssssss              ttttttttttt    aaaaaaaaaa  aaaa         ttttttttttt      uuuuuuuu  uuuu  sssssssssss



 */
 //everything relating to updating the status breadcrumbs

 function setActiveArea(id) {
     let area = document.getElementById('area-' + id);
     area.classList.add('active');
     ROUTER.AREA = id;
 }

 function setCompletedArea(id) {
     let area = document.getElementById('area-' + id);
     area.classList.add('completed');
 }

 function checkArea(panelIndex) {
     let [hasArea, area] = getPanelArea(panelIndex);
     if (hasArea) {
         //set previous sections as completed
         setCompletedArea(ROUTER.AREA);
         //set new section as active
         setActiveArea(area);
         //if results panel set as completed
         if (area == 'results') {
             setCompletedArea(area);
         }
     }
 }

 function getPanelArea(index) {
     let panel = document.querySelector('.panel[data-index="' + index + '"]');
     if (panel.dataset.area) {
         return [true, panel.dataset.area];
     }
     return [false, null];
 }


 /*


                                                                           lllllll
                                                                           l:::::l
                                                                           l:::::l
                                                                           l:::::l
 ppppp   ppppppppp     aaaaaaaaaaaaa  nnnn  nnnnnnnn        eeeeeeeeeeee    l::::l     ssssssssss
 p::::ppp:::::::::p    a::::::::::::a n:::nn::::::::nn    ee::::::::::::ee  l::::l   ss::::::::::s
 p:::::::::::::::::p   aaaaaaaaa:::::an::::::::::::::nn  e::::::eeeee:::::eel::::l ss:::::::::::::s
 pp::::::ppppp::::::p           a::::ann:::::::::::::::ne::::::e     e:::::el::::l s::::::ssss:::::s
  p:::::p     p:::::p    aaaaaaa:::::a  n:::::nnnn:::::ne:::::::eeeee::::::el::::l  s:::::s  ssssss
  p:::::p     p:::::p  aa::::::::::::a  n::::n    n::::ne:::::::::::::::::e l::::l    s::::::s
  p:::::p     p:::::p a::::aaaa::::::a  n::::n    n::::ne::::::eeeeeeeeeee  l::::l       s::::::s
  p:::::p    p::::::pa::::a    a:::::a  n::::n    n::::ne:::::::e           l::::l ssssss   s:::::s
  p:::::ppppp:::::::pa::::a    a:::::a  n::::n    n::::ne::::::::e         l::::::ls:::::ssss::::::s
  p::::::::::::::::p a:::::aaaa::::::a  n::::n    n::::n e::::::::eeeeeeee l::::::ls::::::::::::::s
  p::::::::::::::pp   a::::::::::aa:::a n::::n    n::::n  ee:::::::::::::e l::::::l s:::::::::::ss
  p::::::pppppppp      aaaaaaaaaa  aaaa nnnnnn    nnnnnn    eeeeeeeeeeeeee llllllll  sssssssssss
  p:::::p
  p:::::p
 p:::::::p
 p:::::::p
 p:::::::p
 ppppppppp

 */
 //all actions relating to the panel navigation system

 // type is only used when naviagting sub panels
 function displayPanel(index, type=false) {
     if (index == ROUTER.PLACEMENT_PANEL && !type) {
         showLoader();
         console.log('EVAL!');
         setTimeout(function () {
             evalData();
             if(!PANELS.practice) {
                buildForm(config.evalForm, 'evalForm');
                saveDataToCaspio(true);
             }
             swapPanelRouter(index);
             scrollToPlacement();
             hideLoader();
         }, 400)
     } else if (index == ROUTER.USER_PANEL && !type) {
         console.log('USER!');
        //  showLoader();
        //  setTimeout(function () {
             swapPanelRouter(index);
             hideLoader();
        //  }, 400)
     }
     else {
         console.log('default');
         swapPanelRouter(index, type)
     }
     window.scrollTo(0,0);
 }

 function swapPanelRouter(index, type) {
     switch (type) {
         case 'writing':
             swapPanels(index, PANELS.WRITING_PANELS);
             break;
         case 'reading':
             swapPanels(index, PANELS.READING_PANELS);
             break;
         case 'listen':
             checkVisited(index);
             swapPanels(index, PANELS.LISTEN_PANELS);
             startVideo(index);
             break;
         default:
             swapPanels(index, PANELS.MAIN);
             break;
     }
     buildPanelPagination(index, type);
 }


 function checkVisited(index) {
     if(ROUTER.LISTEN_PANELS_VISITED.indexOf(index) == -1) {
         showTimer();
         // required time to wait before btns active in mins
         startTimer(WAIT_TIME);
     } else {
         hideTimer();
     }
 }

 function startVideo(id) {
     let player = videos['video'+id];
     player.playVideo();
 }

 function swapPanels(index, list) {
     for (let panel of list) {
         if (panel.dataset.index == index) {
             showPanel(panel);
         } else {
             hidePanel(panel);
         }
     }
 }

 function buildPanelPagination(index, type) {
     let prev, next;
     //if has type update sub panels nav for specific type
     //if has no type update nav for main list of panels
     if (type) {
         let limit = getLimit(type);
         ROUTER.ACTIVE_SUB_PANEL = Number(index);
         prev = Number(ROUTER.ACTIVE_SUB_PANEL - 1);
         next = Number(ROUTER.ACTIVE_SUB_PANEL + 1);

         ROUTER.PREV_SUB_PANEL = prev >= 0 ? Number(prev) : Number(-1);
         ROUTER.NEXT_SUB_PANEL = next <= limit ? Number(next) : Number(-1);
     } else {
         ROUTER.ACTIVE_PANEL = Number(index);
         prev = Number(ROUTER.ACTIVE_PANEL - 1);
         next = Number(ROUTER.ACTIVE_PANEL + 1);

         ROUTER.PREV_PANEL = prev >= 0 ? Number(prev) : Number(-1);
         ROUTER.NEXT_PANEL = next <= getLimit() ? Number(next) : Number(-1);
     }
 }

 function getLimit(type) {
     // return limit for specific subset of panels
     switch (type) {
         case 'writing':
             return PANELS.WRITING_PANELS.length;

         case 'reading':
             return PANELS.READING_PANELS.length;

         case 'listening':
             return PANELS.LISTEN_PANELS.length;

         default:
             return PANELS.MAIN.length;
     }
 }

 function showPanel(panel) {
     if (panel.dataset.sample) {
         loadPanelData(panel.dataset.sample, panel);
     } else {
         if (panel.dataset.layout) {
            //loadLayout();
         }
         panel.style.display = "block";
     }
 }

 function hidePanel(panel) {
     panel.style.display = "none";
 }

 function setPanelIndex(panels) {
     for (let i = 0; i < panels.length; i++) {
         panels[i].dataset.index = i;
         panels[i].style.display = "none";
     }
 }

 function loadPanelData(type, panel) {
     console.dir(panel);
     switch (type) {
         case 'writing':
             showLoader();
             loadWritingSamples();
             break;
         case 'reading':
             showLoader();
             loadReadingSamples();
             break;
         case 'listening':
             break;
     }
     panel.style.display = "block";
 }

 async function loadWritingSamples() {
     let samples = SAMPLE_DATA.writing;
     let hasData = await writingLoader(samples);
     hideLoader();
 }

 function writingLoader(samples) {
     Object.keys(samples).forEach((key) => {
         document.getElementById('w-' + key).innerHTML = samples[key];
     });
     return true;
 }

 async function loadReadingSamples() {
     let samples = SAMPLE_DATA.reading;
     console.debug("READING DATA", samples);
     let version = getRandomInt(3);
     const versions = {
        "elac15" : getRandomVersion(samples, "elac15"),
        "elac25" : getRandomVersion(samples, "elac25"),
        "elac35" : getRandomVersion(samples, "elac35"),
        "elac145" : getRandomVersion(samples, "elac145")
     }
     console.debug('versions', versions);
     logReadingVersions(versions);
     let hasData = await readingLoader(samples, versions);
     hideLoader();
 }

 function logReadingVersions(versions) {
    for(const level in versions) {
        const key = level + "R";
        PLACEMENT[key] = versions[level];
    }
 }

 function getRandomVersion(samples, level) {
    const numOptions = Object.keys(samples[level]).length;
    return getRandomInt(numOptions);
 }

 function readingLoader(samples, versions) {
     Object.keys(samples).forEach((key) => {
         let version = versions[key];
         console.debug('version', key, version);
         let versionData = samples[key]["v" + version];

         let title = versionData.hasOwnProperty('title') && versionData.title.length > 0 ? versionData.title : "";
         let intro = versionData.hasOwnProperty('intro') && versionData.intro.length > 0 ? versionData.intro : false;
         let text = versionData.hasOwnProperty('text') && versionData.text.length > 0 ? versionData.text : false;
         let source = versionData.hasOwnProperty('source') && versionData.source.length > 0 ? versionData.source : false;
         let imgSource = versionData.hasOwnProperty('imgSource') && versionData.imgSource.length > 0 ? versionData.imgSource : false;
         let image = versionData.hasOwnProperty('image') && versionData.image.length > 0 ? versionData.image : false;


         let content = "";
         if(title.length > 0) {
             content += `<h4 class="readingTitle">${title}</h4>`;
         }
         if(image) {
            content += `<img src="${image}" alt="${title}" class="reading-img"/>`;
         }
         if(imgSource) {
            content += `<span class="imgSource">${imgSource}</span>`
         }
         if(intro) {
             content += `<p class="readingIntro">${intro}</p>`;
         }
         if(text) {
             content += `<div class="readingText">${text}</div>`;
         }
         if(source) {
             content += `<p class="readingSource">${source}</p>`
         }
         document.getElementById('r-' + key).innerHTML = content;
     });
     return true;
 }

 function showLoader() {
     LOADER.style.display = 'block';
 }

 function hideLoader() {
     LOADER.style.display = 'none';
 }

 function scrollToPlacement() {
     let placement = document.getElementById('placement');
     let offset = placement.scrollTop;
     window.scroll(0, offset);
 }

 function getRandomInt(max) {
     return Math.floor(Math.random() * Math.floor(max));
 }

 /*


          tttt            iiii
       ttt:::t           i::::i
       t:::::t            iiii
       t:::::t
 ttttttt:::::ttttttt    iiiiiii    mmmmmmm    mmmmmmm       eeeeeeeeeeee    rrrrr   rrrrrrrrr
 t:::::::::::::::::t    i:::::i  mm:::::::m  m:::::::mm   ee::::::::::::ee  r::::rrr:::::::::r
 t:::::::::::::::::t     i::::i m::::::::::mm::::::::::m e::::::eeeee:::::eer:::::::::::::::::r
 tttttt:::::::tttttt     i::::i m::::::::::::::::::::::me::::::e     e:::::err::::::rrrrr::::::r
       t:::::t           i::::i m:::::mmm::::::mmm:::::me:::::::eeeee::::::e r:::::r     r:::::r
       t:::::t           i::::i m::::m   m::::m   m::::me:::::::::::::::::e  r:::::r     rrrrrrr
       t:::::t           i::::i m::::m   m::::m   m::::me::::::eeeeeeeeeee   r:::::r
       t:::::t    tttttt i::::i m::::m   m::::m   m::::me:::::::e            r:::::r
       t::::::tttt:::::ti::::::im::::m   m::::m   m::::me::::::::e           r:::::r
       tt::::::::::::::ti::::::im::::m   m::::m   m::::m e::::::::eeeeeeee   r:::::r
         tt:::::::::::tti::::::im::::m   m::::m   m::::m  ee:::::::::::::e   r:::::r
           ttttttttttt  iiiiiiiimmmmmm   mmmmmm   mmmmmm    eeeeeeeeeeeeee   rrrrrrr



 */
 // timer for youtube videos


 function setEndTime(mins) {
     let time = new Date();
     return new Date(time.getTime() + Number(mins) * 60000)
 }

 function startTimer(mins) {
     if(ROUTER.ACTIVE_TIMER) {
         clearInterval(ROUTER.TIMER);
     }
     ROUTER.ACTIVE_TIMER = true;

     var limit = setEndTime(mins);

     ROUTER.TIMER = setInterval(function() {
         let now = new Date().getTime();

         let time = limit - now;
         let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
         let seconds = Math.floor((time % (1000 * 60)) / 1000);
         //format seconds
         if(seconds < 10) {
             seconds = "0"+seconds;
         }

         if(time > 0) {
             updateTimer(minutes, seconds);
         } else {
             clearInterval(ROUTER.TIMER);
             ROUTER.ACTIVE = false;
             unlockBtns();
         }
     }, 1000);
 }


 function updateTimer(m, s) {
     const timer = document.getElementById('countDown');
     timer.innerHTML = m + ':' + s;
 }

 function unlockBtns() {
     let panel = document.querySelector('.sub-panel-listen[data-index="'+ROUTER.ACTIVE_SUB_PANEL+'"]');
     console.debug('practice?', PANELS.practice);
     console.debug('live options', panel.querySelector('.options.live-content'));
     console.debug('practice options', panel.querySelector('.options.practice-content'));
     let options = PANELS.practice ? panel.querySelector('.options.practice-content') : panel.querySelector('.options.live-content');
    //  let options = panel.querySelector('.options');
     console.debug('options', options);
    ROUTER.LISTEN_PANELS_VISITED.push(ROUTER.ACTIVE_SUB_PANEL);

     let buttons = options.querySelectorAll('.btn');
      console.debug('unlockBtns', options, buttons);
     for(let btn of buttons) {
         btn.removeAttribute('disabled');
     }
 }

 function showTimer() {
     document.getElementById('countDown').style.visibility = 'visible';
 }

 function hideTimer() {
     document.getElementById('countDown').style.visibility = 'hidden';
 }



 /*
                                          lllllll
                                          l:::::l
                                          l:::::l
                                          l:::::l
 vvvvvvv           vvvvvvvaaaaaaaaaaaaa    l::::l uuuuuu    uuuuuu      eeeeeeeeeeee        ssssssssss
  v:::::v         v:::::v a::::::::::::a   l::::l u::::u    u::::u    ee::::::::::::ee    ss::::::::::s
   v:::::v       v:::::v  aaaaaaaaa:::::a  l::::l u::::u    u::::u   e::::::eeeee:::::eess:::::::::::::s
    v:::::v     v:::::v            a::::a  l::::l u::::u    u::::u  e::::::e     e:::::es::::::ssss:::::s
     v:::::v   v:::::v      aaaaaaa:::::a  l::::l u::::u    u::::u  e:::::::eeeee::::::e s:::::s  ssssss
      v:::::v v:::::v     aa::::::::::::a  l::::l u::::u    u::::u  e:::::::::::::::::e    s::::::s
       v:::::v:::::v     a::::aaaa::::::a  l::::l u::::u    u::::u  e::::::eeeeeeeeeee        s::::::s
        v:::::::::v     a::::a    a:::::a  l::::l u:::::uuuu:::::u  e:::::::e           ssssss   s:::::s
         v:::::::v      a::::a    a:::::a l::::::lu:::::::::::::::uue::::::::e          s:::::ssss::::::s
          v:::::v       a:::::aaaa::::::a l::::::l u:::::::::::::::u e::::::::eeeeeeee  s::::::::::::::s
           v:::v         a::::::::::aa:::al::::::l  uu::::::::uu:::u  ee:::::::::::::e   s:::::::::::ss
            vvv           aaaaaaaaaa  aaaallllllll    uuuuuuuu  uuuu    eeeeeeeeeeeeee    sssssssssss
 */


 //adds value to placement object
 let values = document.getElementsByClassName('value');
 for (let i = 0; i < values.length; i++) {
     values[i].addEventListener('click', (e) => {
         // let field = e.target.dataset.id;
         let field = getDataId(e.target);
         PLACEMENT[field] = e.target.dataset.value;
         console.log('placement', PLACEMENT);
     });
 }

 //get data id for a specific set of options
 function getDataId(elem) {
     let options = elem.closest('div.options');
     let id = options.dataset.id;
     return id;
 }



 /*


                                                            lllllll
                                                            l:::::l
                                                            l:::::l
                                                            l:::::l
     eeeeeeeeeeee  vvvvvvv           vvvvvvvaaaaaaaaaaaaa    l::::l
   ee::::::::::::ee v:::::v         v:::::v a::::::::::::a   l::::l
  e::::::eeeee:::::eev:::::v       v:::::v  aaaaaaaaa:::::a  l::::l
 e::::::e     e:::::e v:::::v     v:::::v            a::::a  l::::l
 e:::::::eeeee::::::e  v:::::v   v:::::v      aaaaaaa:::::a  l::::l
 e:::::::::::::::::e    v:::::v v:::::v     aa::::::::::::a  l::::l
 e::::::eeeeeeeeeee      v:::::v:::::v     a::::aaaa::::::a  l::::l
 e:::::::e                v:::::::::v     a::::a    a:::::a  l::::l
 e::::::::e                v:::::::v      a::::a    a:::::a l::::::l
  e::::::::eeeeeeee         v:::::v       a:::::aaaa::::::a l::::::l
   ee:::::::::::::e          v:::v         a::::::::::aa:::al::::::l
     eeeeeeeeeeeeee           vvv           aaaaaaaaaa  aaaallllllll



 */
 //evaluation of data for course recommendations

 function evalData() {
     // convert selected values to numbers
     const readingScore = typeof PLACEMENT.reading == 'string' && PLACEMENT.reading.length > 0 ? PLACEMENT.reading : false;
     const listeningScore = typeof PLACEMENT.listen == 'string' && PLACEMENT.listen.length > 0 ? PLACEMENT.listen : false;
     let results = null;

     // if all values present
     if (readingScore && listeningScore) {
         //save scores
         PLACEMENT.readingScore = readingScore;
         PLACEMENT.listeningScore = listeningScore;
         //save results
         results = evaluateScores(readingScore, listeningScore);
         PLACEMENT.readingCourse = results.readingCourse;
         PLACEMENT.listeningCourse = results.listeningCourse;
         PLACEMENT.level = results.level;

         console.log('PLACEMENT Eval', PLACEMENT);
     } else {
         // need to display error to user
         console.error('missing scores');
     }
     displayRecos(results);
     //for testing purposes
     if(config.testingVersion) {
        displayLevels(results, readingScore, listeningScore);
     }


 }

 function displayLevels(results, reading, listening) {
    //testing purposes
    const readingContainer = document.getElementById('reading');
    const listeningContainer = document.getElementById('listening');
    const levelContainer = document.getElementById('milestone');

    readingContainer.innerHTML = reading;
    listeningContainer.innerHTML = listening;
    levelContainer.innerHTML = results.level;

    const userValues = document.querySelector('.user-values');
    userValues.style.display = 'block';
 }

 function evaluateScores(readingScore, listeningScore) {

     const values = logicRules["R"+readingScore]["L"+listeningScore];
     const readingCourse = typeof values.readingCourse == 'string' && values.readingCourse.length > 0 ? values.readingCourse : values.listeningCourse;
     const listeningCourse = typeof values.listeningCourse == 'string' && values.listeningCourse.length > 0 ? values.listeningCourse : values.readingCourse;
     const level = typeof values.level == 'string' && values.level.length > 0 ? values.level : false;
     return {level, readingCourse, listeningCourse};
 }

 function displayRecos(results) {
     console.debug('results', results);
    //highlight courses on screen (left side)
    if(results.readingCourse != "CE")
    document.getElementById(results.readingCourse).classList.add('active');

    if(results.listeningCourse != "CE")
    document.getElementById(results.listeningCourse).classList.add('active');

    //show details for each reco (right side)
    setDetails(results);
 }

 function setDetails(results) {
     // if level has a P tag but it is not PLA -> return true
     const passed = results.level.indexOf('P') != -1 && results.level.indexOf('PLA') == -1 ? true : false;

     if (results.readingCourse != results.listeningCourse) {
         const courses = sort(results.readingCourse, results.listeningCourse); // returns ordered array
         for (let course of courses) {
            const eligible = course == "ELAC23" || course == "ELAC33" ? true : false;
            if(passed && eligible) {
                course += "P";
            }
            showCourseDetails(course, true);
         }
     } else {
         // course recos are the same
         showCourseDetails(results.readingCourse, true);
     }
 }

 function sort(reading, listening) {
     let rNum = reading == 'PLA' ? 1000 : getCourseNumber(reading);
     let lNum = listening == 'PLA' ? 1000 : getCourseNumber(listening);

     if (Number(lNum) > Number(rNum)) {
         return [reading, listening];
     }

     return [listening, reading];

 }

 function getCourseNumber(courseId) {
     if(courseId == "CE")
        return -1;
     return courseId.substring(4);
 }
 /*






     cccccccccccccccc   ooooooooooo   uuuuuu    uuuuuu rrrrr   rrrrrrrrr       ssssssssss       eeeeeeeeeeee        ssssssssss
   cc:::::::::::::::c oo:::::::::::oo u::::u    u::::u r::::rrr:::::::::r    ss::::::::::s    ee::::::::::::ee    ss::::::::::s
  c:::::::::::::::::co:::::::::::::::ou::::u    u::::u r:::::::::::::::::r ss:::::::::::::s  e::::::eeeee:::::eess:::::::::::::s
 c:::::::cccccc:::::co:::::ooooo:::::ou::::u    u::::u rr::::::rrrrr::::::rs::::::ssss:::::se::::::e     e:::::es::::::ssss:::::s
 c::::::c     ccccccco::::o     o::::ou::::u    u::::u  r:::::r     r:::::r s:::::s  ssssss e:::::::eeeee::::::e s:::::s  ssssss
 c:::::c             o::::o     o::::ou::::u    u::::u  r:::::r     rrrrrrr   s::::::s      e:::::::::::::::::e    s::::::s
 c:::::c             o::::o     o::::ou::::u    u::::u  r:::::r                  s::::::s   e::::::eeeeeeeeeee        s::::::s
 c::::::c     ccccccco::::o     o::::ou:::::uuuu:::::u  r:::::r            ssssss   s:::::s e:::::::e           ssssss   s:::::s
 c:::::::cccccc:::::co:::::ooooo:::::ou:::::::::::::::uur:::::r            s:::::ssss::::::se::::::::e          s:::::ssss::::::s
  c:::::::::::::::::co:::::::::::::::o u:::::::::::::::ur:::::r            s::::::::::::::s  e::::::::eeeeeeee  s::::::::::::::s
   cc:::::::::::::::c oo:::::::::::oo   uu::::::::uu:::ur:::::r             s:::::::::::ss    ee:::::::::::::e   s:::::::::::ss
     cccccccccccccccc   ooooooooooo       uuuuuuuu  uuuurrrrrrr              sssssssssss        eeeeeeeeeeeeee    sssssssssss




 */
 //UI for display of courses on results screen

 let coursesBtns = document.getElementsByClassName('course');
 for (let i = 0; i < coursesBtns.length; i++) {
     coursesBtns[i].addEventListener('click', (e) => {

         let course_id = getCourseId(e.target);
         handleCourseEvent(course_id);
     });

     coursesBtns[i].addEventListener('keydown', (e) => {
        if(e.code == 'Space' || e.code == 'Enter') {
            e.preventDefault();
            console.log('action');

            let course_id = getCourseId(e.target);
            handleCourseEvent(course_id)
        }
    });
 };

 function handleCourseEvent(course_id) {

    const isSelected = hasClass(course_id, 'selected-course');
    console.log('course id', course_id, isSelected);
    reset();

    if(!isSelected) {
        if (course_id != PLACEMENT.listeningCourse && course_id != PLACEMENT.readingCourse) {
            flagSelected(course_id);
            showCourseDetails(course_id);
        }
    }

 }

 function hasClass(elem_id, value) {
    return document.getElementById(elem_id).classList.contains(value);
 }


 function showCourseDetails(course, reco = false) {

     let courseHTML = buildCourse(course);
     let courseContainer = buildCourseContainer(course);
     courseContainer.innerHTML = courseHTML;

     //if recommeded course do not add close btn to details
     if (reco) {
         addReco(courseContainer);
     } else {
         addClearBtn();
         addCourse(courseContainer);
         setTimeout(setFocus('clearCourse'), 0);
     }
 }

 function buildCourseContainer(course) {
     let container = document.createElement('div');
     container.classList.add('course-details');
     container.dataset.course = course;
     return container;
 }

 function buildCourse(course) {
     console.debug('build', course);
     let data = SAMPLE_DATA.courses[course];
     if (data) {
         return `
     <h4>${data.label}</h4>
     <div class="course-content">
     <p class="title">${data.title}</p>
     <p>${data.desc}</p>
     ${buildLink(data.link)}
     </div>`;
     }
     return `<p>No course data</p>`;
 }

 function buildLink(url) {
     if(url == null) {
         console.log('course link not provided');
         return "";
     }
     return `<a href="${url}" target="_blank"><i class="material-icons">open_in_new</i>Learn More</a>`;
 }

 function addClearBtn() {
     let btnHMTL = buildClearBtn();
     let btnContainer = document.createElement('div');
     btnContainer.id = 'clear';
     btnContainer.innerHTML = btnHMTL;
     addCourse(btnContainer);
 }

 function buildClearBtn() {
     return `
     <a id="clearCourse" class="btn-floating btn-large waves-effect waves-light red" onkeydown="handleCloseEvent(event)" onClick="clearCourse()"
         role="button"
         tabindex="0"
         aria-label="close selected course"
         aria-controls="selected"
         aria-expanded="true">
         <i class="material-icons" aria-hidden="true">close</i>
     </a>`;
 }

 function handleCloseEvent(e) {
     console.log('a11y', e.code);
    if(e.code == 'Space' || e.code == 'Enter') {
        e.preventDefault();
        clearCourse();
    }
 }

 function addCourse(courseNode) {
     const selected = document.getElementById('selected');
     selected.appendChild(courseNode);
     selected.setAttribute('aria-hidden', 'false');
 }

 function setFocus(focusTarget = false) {
    console.log('focusTarget', focusTarget);
    if(focusTarget) {
         if(document.getElementById(focusTarget) == 'object') {
            // window.setTimeout(()=>{
            //     document.getElementById(focusTarget).focus();
            // }, 20)
            setTimeout(()=>{document.getElementById(focusTarget).focus()},50);
            console.log('set focus');

         }
     }
 }

 function addReco(courseNode) {
     document.getElementById('course_recos').appendChild(courseNode);
 }

 function getCourseId(target) {
     if (target.classList.contains('course')) {
         return target.id;
     } else {
         return target.parentElement.id;
     }
 }

 function flagSelected(id) {
     const courseBtn = document.getElementById(id);
     courseBtn.classList.add('selected-course');
     courseBtn.setAttribute('aria-expanded', 'true');
     courseBtn.setAttribute('aria-selected', 'true');
     courseBtn.setAttribute('aria-owns', 'selected');
     SELECTED_COURSE = id;
 }

 function clearCourse() {
     reset();
 }

 function reset() {
     clearDetails();
     clearSelected();
 }

 function clearSelected() {
     if (SELECTED_COURSE != "none") {
         const courseBtn = document.getElementById(SELECTED_COURSE);
         courseBtn.classList.remove('selected-course');
         courseBtn.setAttribute('aria-expanded', 'false');
         courseBtn.setAttribute('aria-selected', 'false');
         courseBtn.removeAttribute('aria-owns');
         setTimeout(setFocus('ELAC15'), 0);
     }
 }

 function clearDetails() {
     const selected = document.getElementById('selected');
     selected.innerHTML = "";
     selected.setAttribute('aria-hidden', 'true');
 }



 /*



 uuuuuu    uuuuuu      ssssssssss       eeeeeeeeeeee    rrrrr   rrrrrrrrr
 u::::u    u::::u    ss::::::::::s    ee::::::::::::ee  r::::rrr:::::::::r
 u::::u    u::::u  ss:::::::::::::s  e::::::eeeee:::::eer:::::::::::::::::r
 u::::u    u::::u  s::::::ssss:::::se::::::e     e:::::err::::::rrrrr::::::r
 u::::u    u::::u   s:::::s  ssssss e:::::::eeeee::::::e r:::::r     r:::::r
 u::::u    u::::u     s::::::s      e:::::::::::::::::e  r:::::r     rrrrrrr
 u::::u    u::::u        s::::::s   e::::::eeeeeeeeeee   r:::::r
 u:::::uuuu:::::u  ssssss   s:::::s e:::::::e            r:::::r
 u:::::::::::::::uus:::::ssss::::::se::::::::e           r:::::r
  u:::::::::::::::us::::::::::::::s  e::::::::eeeeeeee   r:::::r
   uu::::::::uu:::u s:::::::::::ss    ee:::::::::::::e   r:::::r
     uuuuuuuu  uuuu  sssssssssss        eeeeeeeeeeeeee   rrrrrrr


 */
 //all user data values gathered by the app


 let multiValues = document.getElementsByClassName('getValues');
 for (let i = 0; i < multiValues.length; i++) {
     multiValues[i].addEventListener('click', (e) => {
         getUserValues();
     });
 }

 function getUserValues() {
     showLoader();
     let hasErrors = false;
     let errors = {
         first: false,
         last: false,
         email: false,
         csid: false
     };
     let first = FormGrunt.getTextInputValue('first').trim();
     let last = FormGrunt.getTextInputValue('last').trim();
     let email = FormGrunt.getTextInputValue('email').trim();
     let phone = FormGrunt.getTextInputValue('phone').trim();
     let csid = FormGrunt.getTextInputValue('csid');
     let goals = FormGrunt.getSelectInputValues('goal');
     let campus = FormGrunt.getSelectInputValues('campus');

     if (!validText(first)) {
         hasErrors = true;
         errors.first = true;
     }
     if (!validText(last)) {
         hasErrors = true;
         errors.last = true;
     }
     if (!validEmail(email)) {
         hasErrors = true;
         errors.email = true;
     }
     if (!validCsid(csid)) {
         hasErrors = true;
         errors.csid = true;
     }
     errors.unique = false;

     if (hasErrors) {

         console.log('fail', errors);
         displayErrors(errors);
         window.scrollTo(0,0);
         hideLoader();
     } else {

         clearErrors(errors);
         setUserValues(first, last, email, csid, phone, goals, campus);
         console.log('placement', PLACEMENT);

         checkIfUserExists();

     }
 }

 function checkIfUserExists() {
     // submit capsio form
     // load form from cb
     buildForm(config.userForm, 'userForm');
     saveDataToCaspio();
 }

 function checkMe() {
     console.log('iframe loaded');

     if(PANELS.userForm) {
        const errors = {"unique": true};
        try {
            const iframe = document.querySelector('#empty iframe');
            const elem = iframe.contentWindow.document.getElementsByTagName('h1')[0];
            console.log('highlight error', errors);
            displayErrors(errors);
            window.scrollTo(0,0);
            hideLoader();
         } catch(error){
             console.debug('failed', error);
             console.log('success');
             checkArea(ROUTER.NEXT_PANEL);
             displayPanel(ROUTER.NEXT_PANEL);
             hideLoader();
         }

     }

 }


 function displayErrors(errors) {
     clearErrors(errors);
     let errorValues = document.getElementById('errors');
     errorValues.style.display = 'block';

     Object.keys(errors).forEach((error) => {
         if (errors[error]) {
             document.getElementById('e-' + error).style.display = 'block';
         }
     });
 }

 function clearErrors(errors) {
     let errorValues = document.getElementById('errors');
     errorValues.style.display = 'none';

     Object.keys(errors).forEach((error) => {
         document.getElementById('e-' + error).style.display = 'none';
     });
 }

 function setUserValues(first, last, email, csid, phone, goals, campus) {
     PLACEMENT.first = first.toLowerCase();
     PLACEMENT.last = last.toLowerCase();
     PLACEMENT.email = email.toLowerCase();
     PLACEMENT.csid = csid;
     PLACEMENT.phone = phone;
     PLACEMENT.goals = goals;
     PLACEMENT.campus = campus;
 }

 function validText(value) {
     if (value == "" || value == undefined || !value) {
         return false;
     }
     return true;
 }

 function validEmail(email) {
     if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
         return true;
     }
     return false;
 }

 function validCsid(csid) {
     if (/^[0-9]*$/.test(csid) && csid.length == 10) {
         return true;
     }
     return false;
 }

 /*
                                                                             iiii
                                                                            i::::i
                                                                             iiii

     cccccccccccccccc  aaaaaaaaaaaaa      ssssssssss   ppppp   ppppppppp   iiiiiii    ooooooooooo
   cc:::::::::::::::c  a::::::::::::a   ss::::::::::s  p::::ppp:::::::::p  i:::::i  oo:::::::::::oo
  c:::::::::::::::::c  aaaaaaaaa:::::ass:::::::::::::s p:::::::::::::::::p  i::::i o:::::::::::::::o
 c:::::::cccccc:::::c           a::::as::::::ssss:::::spp::::::ppppp::::::p i::::i o:::::ooooo:::::o
 c::::::c     ccccccc    aaaaaaa:::::a s:::::s  ssssss  p:::::p     p:::::p i::::i o::::o     o::::o
 c:::::c               aa::::::::::::a   s::::::s       p:::::p     p:::::p i::::i o::::o     o::::o
 c:::::c              a::::aaaa::::::a      s::::::s    p:::::p     p:::::p i::::i o::::o     o::::o
 c::::::c     ccccccca::::a    a:::::assssss   s:::::s  p:::::p    p::::::p i::::i o::::o     o::::o
 c:::::::cccccc:::::ca::::a    a:::::as:::::ssss::::::s p:::::ppppp:::::::pi::::::io:::::ooooo:::::o
  c:::::::::::::::::ca:::::aaaa::::::as::::::::::::::s  p::::::::::::::::p i::::::io:::::::::::::::o
   cc:::::::::::::::c a::::::::::aa:::as:::::::::::ss   p::::::::::::::pp  i::::::i oo:::::::::::oo
     cccccccccccccccc  aaaaaaaaaa  aaaa sssssssssss     p::::::pppppppp    iiiiiiii   ooooooooooo
                                                        p:::::p
                                                        p:::::p
                                                       p:::::::p
                                                       p:::::::p
                                                       p:::::::p
                                                       ppppppppp
 */
 // save data to caspio form and submit

 // *_lvl -> "choose the option that is true" -> *_self_selected
 // reading/listen -> selected value based on samples -> *_sample_selected
 // *_score -> computed score by logic based on user inputs -> *_score

 // in reality this should be done with a backend script


 function saveDataToCaspio(eval = false) {
     // saveField(value, nameOfFieldInCaspio)
     // user details

     const ready = checkLoaded();

     if(ready){

        console.log('SAVE', ready, PLACEMENT);
        if(eval) {
            saveRecord();
        } else {
            /* flags user form has been loaded
             * in case iframe loads first and triggers
             * onload logic-> checkMe() before form is ready
             */
            PANELS.userForm = true;
            logUser();
        }
     } else {
        window.setTimeout(()=>{
            saveDataToCaspio(eval);
        }, 100);
     }
 }

function logUser() {
    console.log('checking user');
    saveField(PLACEMENT.first, 'first');
    saveField(PLACEMENT.last, 'last');
    saveField(PLACEMENT.email, 'email');
    saveField(PLACEMENT.csid, 'csid');

    // submission frame already exists no need to build the frame
    submitCbForm();
}

function buildSubmissionFrame() {
    const frameContainer = document.getElementById('empty');
    frameContainer.innerHTML = "";
    const frameHTML = buildFrameHTML();
    frameContainer.innerHTML = frameHTML;
    console.log('frame built');
    return;
}

function submitCbForm() {
    const form = document.getElementById('caspioform');
    form.target = "frame";
    form.submit();
    return;
}

function saveRecord() {
        console.log('submitting');
        saveField(PLACEMENT.first, 'first');
        saveField(PLACEMENT.last, 'last');
        saveField(PLACEMENT.email, 'email');
        saveField(PLACEMENT.csid, 'csid');
        saveField(PLACEMENT.phone, 'phone');
        if (PLACEMENT.campus.hasValues) {
            saveField(PLACEMENT.campus.toString, 'campus');
            saveObj(PLACEMENT.campus.obj, 'campus');
        }
        if (PLACEMENT.goals.hasValues) {
            saveField(PLACEMENT.goals.toString, 'goals');
            saveObj(PLACEMENT.goals.obj, 'goals');
        }
        // user selected scores and results
        saveField(Number(PLACEMENT.listen_lvl), 'listening_self_selected');
        saveField(Number(PLACEMENT.listen), 'listening_score');
        saveField(PLACEMENT.listeningCourse, 'listening_course');
        saveField(Number(PLACEMENT.reading_lvl), 'reading_self_selected');
        saveField(Number(PLACEMENT.reading), 'reading_score');
        saveField(PLACEMENT.readingCourse, 'reading_course');
        saveField(PLACEMENT.level, 'level');
        // content shown to user
        saveField(PLACEMENT.elac15R, 'r_elac15');
        saveField(PLACEMENT.elac25R, 'r_elac25');
        saveField(PLACEMENT.elac35R, 'r_elac35');
        saveField(PLACEMENT.elac145R, 'r_elac145');
        saveField(PLACEMENT.elac15L, 'l_elac15');
        saveField(PLACEMENT.elac23L, 'l_elac23');
        saveField(PLACEMENT.elac33L, 'l_elac33');
        saveField(PLACEMENT.elac145L, 'l_elac145');

        // erase current iframe and build new one for form submission
        buildSubmissionFrame();
        submitCbForm();
}



function buildForm(id, name) {
        const container = document.getElementById('caspioEmbeddedForm');
        // clear container
        container.innerHTML = '';
        const cbContainer = document.createElement('div');
        cbContainer.id = name;
        const cbForm = document.createElement('script');
        const src = 'https://c2eib679.caspio.com/dp/'+id+'/emb';
        cbForm.setAttribute('src', src);
        cbContainer.appendChild(cbForm);
        container.appendChild(cbContainer);
        return;
 }

 function buildFrameHTML() {
    return `<iframe name="frame"></iframe>`;
 }

 function checkLoaded() {

        if(document.body.contains(document.getElementById('caspioform'))) {
            console.log('form loaded');
             return true;
        }
        console.log('waiting on form');
        return false;
 }

 function saveField(value, caspioFieldName) {

    fieldName = 'InsertRecord'+ caspioFieldName;
     console.log(`${fieldName} : ${value}`);
    document.getElementById(fieldName).value = value;
 }

 function saveObj(obj, fieldNamePrefix) {
     // caspio fields must match object keys
     Object.keys(obj).forEach(key =>{
         let field = fieldNamePrefix + '_' + key.toLowerCase();
        //  console.log(String(obj[key]), typeof(obj[key]));
         saveField(String(obj[key]), field);
     });
 }

