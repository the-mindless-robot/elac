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

 let SAMPLE_DATA;
 const sampleDataJSON = getData();
 sampleDataJSON.then((result) => {
     SAMPLE_DATA = result;
 });
 async function getData() {
     try {
         const response = await fetch('data.json');
         return response.json();
     } catch (err) {
         console.log('failed to load sample data: ', err);
     }
 }

 //placement object holds all data
 const PLACEMENT = {};

 //course options
 const RW_COURSES = [
     "ELAC15",
     "ELAC25",
     "ELAC35",
     "ELAC145",
     "ENGL101X"
 ];
 const LS_COURSES = [
     "ELAC15",
     "ELAC23",
     "ELAC33",
     "ELAC145",
     "ENGL101X"
 ];

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
        if(logic.hasOwnProperty(readingKey)) {
            // add listening key with value
            logic[readingKey][listeningKey] = {level, readingCourse, listeningCourse};
        } else {
            // add reading key
            logic[readingKey] = {};
            // add listening key with value
            logic[readingKey][listeningKey] = {level, readingCourse, listeningCourse};
        }
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
elacLogic.load(buildLogicRules).then(logic => logicRules = logic);

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
 const WAIT_TIME = 0.01;

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
     console.log('videos', videos, 'id', video_id);
        let player = videos['video'+video_id];
        player.stopVideo();
     });
 }

 let next_panel_btns = document.getElementsByClassName('next');
 for (let i = 0; i < next_panel_btns.length; i++) {
     next_panel_btns[i].addEventListener('click', (e) => {
         console.log('NEXT_PANEL', ROUTER.NEXT_PANEL);
         checkArea(ROUTER.NEXT_PANEL);
         displayPanel(ROUTER.NEXT_PANEL);
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
             console.log('dropped level');
             level = 3;
         }

         let subj = getDataId(e.target);
         subj = subj.split("_")[0];

         console.log('subj', subj, 'lvl', level);
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
     console.log('PANEL:', panelIndex, 'ROUTER.AREA:', ROUTER.AREA);
     let [hasArea, area] = getPanelArea(panelIndex);
     console.log('hasArea', hasArea, 'area', area);
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
     console.log('checking panel', panel);
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
     console.log('type', type);
     if (index == ROUTER.PLACEMENT_PANEL && !type) {
         showLoader();
         console.log('EVAL!');
         setTimeout(function () {
             eval();
             saveDataToCaspio();
             swapPanelRouter(index);
             scrollToPlacement();
             hideLoader();
         }, 400)
     } else if (index == ROUTER.USER_PANEL && !type) {
         console.log('USER!');
         showLoader();
         setTimeout(function () {
             swapPanelRouter(index);
             hideLoader();
         }, 400)
     }
     else {
         console.log('default');
         swapPanelRouter(index, type)
     }
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
            //  startVideo(index);
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
             loadLayout();
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

 //show/hide CSID field based on student status
 function loadLayout() {
     //only show csid field if they are a student
     if (PLACEMENT.student && PLACEMENT.student == 'yes') {
         // console.log('show csid');
         CSID.style.display = 'block';
     }
     console.log('PLACEMENT', PLACEMENT.student)
 }

 function loadPanelData(type, panel) {
     console.log('data loaded', SAMPLE_DATA, 'type', type, 'panel', panel);
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
     console.log('got data', hasData);
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
     let version = getRandomInt(3);
     console.log('v', version);
     let hasData = await readingLoader(samples, version);
     console.log('got data', hasData);
     hideLoader();
 }

 function readingLoader(samples, version) {
     Object.keys(samples).forEach((key) => {
         document.getElementById('r-' + key).innerHTML = samples[key]["v" + version].text;
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
     console.log('timer', ROUTER.TIMER);

     ROUTER.TIMER = setInterval(function() {
         let now = new Date().getTime();

         let time = limit - now;
         let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
         let seconds = Math.floor((time % (1000 * 60)) / 1000);
         //format seconds
         if(seconds < 10) {
             seconds = "0"+seconds;
         }

         console.log('time', time);
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
     let timer = document.getElementById('countDown');
     timer.innerHTML = m + ':' + s;
 }

 function unlockBtns() {
     console.log('unlock btns! @ panel', ROUTER.ACTIVE_SUB_PANEL);
     let panel = document.querySelector('.sub-panel-listen[data-index="'+ROUTER.ACTIVE_SUB_PANEL+'"]');

     let options = panel.querySelector('.options');
     ROUTER.LISTEN_PANELS_VISITED.push(ROUTER.ACTIVE_SUB_PANEL);

     let buttons = options.querySelectorAll('.btn');
     console.log('btns', buttons);

     for(let btn of buttons) {
         console.log('btn a', btn.attributes);
         btn.removeAttribute('disabled');
         console.log('btn b', btn.attributes);
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
         console.log('getting value');
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

 function eval() {
     // convert selected values to numbers
     const readingScore = Number(PLACEMENT.reading);
     // let writing = Number(PLACEMENT.writing);
     const listeningScore = Number(PLACEMENT.listen);

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

 }

 function evaluateScores(readingScore, listeningScore) {

     const values = logicRules["R"+readingScore]["L"+listeningScore];
     console.log('values', values);
     const readingCourse = typeof values.readingCourse == 'string' && values.readingCourse.length > 0 ? values.readingCourse : values.listeningCourse;
     const listeningCourse = typeof values.listeningCourse == 'string' && values.listeningCourse.length > 0 ? values.listeningCourse : values.readingCourse;
     console.log('r_course:', readingCourse, 'l_course', listeningCourse);
     const level = typeof values.level == 'string' && values.level.length > 0 ? values.level : false;
     return {level, readingCourse, listeningCourse};
 }

 function displayRecos(results) {
    //highlight courses on screen (left side)
    document.getElementById(results.readingCourse).classList.add('active');
    document.getElementById(results.listeningCourse).classList.add('active');

    //show details for each reco (right side)
    setDetails(results.readingCourse, results.listeningCourse);

    //testing purposes
    const readingContainer = document.getElementById('reading');
    const listeningContainer = document.getElementById('listening');

 }


 function setPlacementLevel(rw_course, reading, ls_course, listening) {
     let reading_container = document.getElementById('reading');
     // let writing_container = document.getElementById('writing');
     let listening_container = document.getElementById('listening');

     console.log('courses', rw_course, ls_course);

     //highlight courses on screen (left side)
     document.getElementById(rw_course).classList.add('active');
     document.getElementById(ls_course).classList.add('active');

     //show details for each reco (right side)
     setDetails(rw_course, ls_course);

     //show selected values - TESTING ONLY
     reading_container.innerHTML = reading;
     // writing_container.innerHTML = writing;
     listening_container.innerHTML = listening;
 }

 function setDetails(reading, listening) {
     if (reading != listening) {
         const courses = sort(reading, listening); // returns ordered array
         for (const course of courses) {
             showCourseDetails(course, true);
         }
     } else {
         // course recos are the same
         showCourseDetails(reading, true);
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
     return courseId.substring(4);
 }

//  function displayApply() {
//      // build intro text
//      let intro = document.createElement('p');
//      let introMsg = `Hi <span id="userName">${PLACEMENT.first+','}</span><br/>It doesn't look like you are a student yet, don't forget to apply to SDCCD.`
//      intro.innerHTML = introMsg;

//      //build button
//      let button = document.createElement('a');
//      button.classList.add('waves-effect', 'waves-light', 'btn-large');
//      button.href = "https://www.opencccapply.net/uPortal/f/u63l1s1000/normal/render.uP";
//      button.target = "_blank";
//      button.innerHTML = "Apply to SDCCD";

//      //display
//      let applyContainer = document.getElementById('apply');
//      applyContainer.appendChild(intro);
//      applyContainer.appendChild(button);
//      applyContainer.style.display = 'block';
//  }

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
         reset();

         let course_id = getCourseId(e.target);
         flagSelected(course_id);

         if (course_id != PLACEMENT.ls_course && course_id != PLACEMENT.rw_course) {
             showCourseDetails(course_id);
         } else {
             reset();
         }
     });
 };

 function showCourseDetails(course, reco = false) {

     let courseHTML = buildCourse(course);
     let courseContainer = buildCourseContainer(course);
     courseContainer.innerHTML = courseHTML;

     //if recommeded course do not add close btn to details
     if (reco) {
         addReco(courseContainer);
     } else {
         addCourse(courseContainer);
         addClearBtn();
     }
 }

 function buildCourseContainer(course) {
     let container = document.createElement('div');
     container.classList.add('course-details');
     container.dataset.course = course;
     return container;
 }

 function buildCourse(course) {
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
         console.log('it is undefined');
         return "";
     }
     console.log('url', url);
     return `<a href="${url}" target="_blank"><i class="material-icons">open_in_new</i>View More Details</a>`;
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
     <a id="clearCourse" class="btn-floating btn-large waves-effect waves-light red" onClick="clearCourse()">
         <i class="material-icons">close</i>
     </a>`;
 }

 function addCourse(courseNode) {
     document.getElementById('selected').appendChild(courseNode);
 }

 function addReco(courseNode) {
     document.getElementById('course_recos').appendChild(courseNode);
 }

 function getCourseId(target) {
     if (target.classList.contains('course')) {
         console.log('showCourse', target.id);
         return target.id;
     } else {
         console.log('showCourse', target.parentElement.id);
         return target.parentElement.id;
     }
 }

 function flagSelected(id) {
     document.getElementById(id).classList.add('selected-course');
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
     console.log('selected', SELECTED_COURSE);
     if (SELECTED_COURSE != "none") {
         document.getElementById(SELECTED_COURSE).classList.remove('selected-course');
     }
 }

 function clearDetails() {
     document.getElementById('selected').innerHTML = "";
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

     if (hasErrors) {
         console.log('fail', errors);
         displayErrors(errors);
     } else {
         setUserValues(first, last, email, csid, phone, goals, campus);
         console.log('placement', PLACEMENT);
         checkArea(ROUTER.NEXT_PANEL);
         displayPanel(ROUTER.NEXT_PANEL);
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
     console.log('text value: ', value);
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
 hhhhhhh                                lllllll
 h:::::h                                l:::::l
 h:::::h                                l:::::l
 h:::::h                                l:::::l
  h::::h hhhhh           eeeeeeeeeeee    l::::lppppp   ppppppppp
  h::::hh:::::hhh      ee::::::::::::ee  l::::lp::::ppp:::::::::p
  h::::::::::::::hh   e::::::eeeee:::::eel::::lp:::::::::::::::::p
  h:::::::hhh::::::h e::::::e     e:::::el::::lpp::::::ppppp::::::p
  h::::::h   h::::::he:::::::eeeee::::::el::::l p:::::p     p:::::p
  h:::::h     h:::::he:::::::::::::::::e l::::l p:::::p     p:::::p
  h:::::h     h:::::he::::::eeeeeeeeeee  l::::l p:::::p     p:::::p
  h:::::h     h:::::he:::::::e           l::::l p:::::p    p::::::p
  h:::::h     h:::::he::::::::e         l::::::lp:::::ppppp:::::::p
  h:::::h     h:::::h e::::::::eeeeeeee l::::::lp::::::::::::::::p
  h:::::h     h:::::h  ee:::::::::::::e l::::::lp::::::::::::::pp
  hhhhhhh     hhhhhhh    eeeeeeeeeeeeee llllllllp::::::pppppppp
                                                p:::::p
                                                p:::::p
                                               p:::::::p
                                               p:::::::p
                                               p:::::::p
                                               ppppppppp
 */
 //help descriptions for skills buttons

 let helpers = document.querySelectorAll('.help');
 for(const helper of helpers) {
     helper.addEventListener("mouseover", (ev)=>{
         let level = ev.target.dataset.value;
         let containerId = ev.target.parentElement.dataset.id;
         let textContainer = document.getElementById(containerId+'_help');
         console.log('data in', level, containerId, textContainer);
         textContainer.innerHTML = helpMessages[containerId][level];
     });
     helper.addEventListener("mouseout", (ev)=>{
         let containerId = ev.target.parentElement.dataset.id;
         let textContainer = document.getElementById(containerId+'_help');
         console.log('data out', containerId, textContainer);
         textContainer.innerHTML = "";
     });
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
 function saveDataToCaspio() {
     console.log('SAVE', PLACEMENT);
     saveField(PLACEMENT.first, 'first');
     saveField(PLACEMENT.last, 'last');
     saveField(PLACEMENT.email, 'email');
     saveField(PLACEMENT.csid, 'csid');
     saveField(PLACEMENT.phone, 'phone');
     saveField(PLACEMENT.student, 'student');
     saveField(Number(PLACEMENT.listen_lvl), 'ls_self_selected');
     saveField(Number(PLACEMENT.listen), 'ls_sample_selected');
     saveField(Number(PLACEMENT.ls_score), 'ls_score');
     saveField(PLACEMENT.ls_course, 'ls_course');
     saveField(Number(PLACEMENT.reading_lvl), 'rw_self_selected');
     saveField(Number(PLACEMENT.reading), 'rw_sample_selected');
     saveField(Number(PLACEMENT.rw_score), 'rw_score');
     saveField(PLACEMENT.rw_course, 'rw_course');
     if(PLACEMENT.campus.hasValues) {
         saveField(PLACEMENT.campus.toString, 'campus');
         saveObj(PLACEMENT.campus.obj, 'campus');
     }
     if(PLACEMENT.goals.hasValues) {
         saveField(PLACEMENT.goals.toString, 'goals');
         saveObj(PLACEMENT.goals.obj, 'goals');
     }

     let form = document.getElementById('caspioform');
     form.target = "frame";
     form.submit();

 }

 function saveField(value, caspioFieldName) {
     let fieldName = 'InsertRecord'+ caspioFieldName;
     console.log(`${fieldName} : ${value}`);
     document.getElementById(fieldName).value = value;
 }

 function saveObj(obj, fieldNamePrefix) {
     // caspio fields must match object keys
     Object.keys(obj).forEach(key =>{
         let field = fieldNamePrefix + '_' + key.toLowerCase();
         console.log(String(obj[key]), typeof(obj[key]));
         saveField(String(obj[key]), field);
     });
 }

