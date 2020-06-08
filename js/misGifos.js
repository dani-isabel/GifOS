//Variables
const apiKey = "u5MxvUvtwc9acidnSviI4nlHRNOIHx44";
var getLocalGifs = localStorage.getItem("misGifos");
const queryCreate = "?action=create-gifs";
let btnCreate = document.querySelector(".btn1");
let btnMyGifs = document.querySelector(".btn4");
let backHome = document.querySelector(".arrow");
let createSection = document.querySelector("#crearGifos");
let btnStyles = document.getElementById("menuGrey");
var state = false;
let logoDay = document.getElementById("logoDay");
let logoDark = document.getElementById("logoDark");
//Init myGifs visualization
window.onload = function() {
  changeDom();
  getMyGifs(getLocalGifs);
};
//Change DOM acording with button
function changeDom() {
  const queryString = window.location.search;
  let cancelCreate = document.getElementById("cancelCreate");
  if(queryString == queryCreate) {
    btnCreate.setAttribute("class","hide");
    btnMyGifs.setAttribute("class","hide");
    btnStyles.classList.add("menuCreate");
    cancelCreate.addEventListener("click",()=> {
      window.location.assign("index.html");
    })
  }
  else {
    backHome.setAttribute("class","hide");
    logoDay.addEventListener("click",()=> {
      window.location.assign("index.html");
    })
    logoDark.addEventListener("click",()=> {
      window.location.assign("index.html");
    })
    createSection.setAttribute("class","hide");
    btnCreate.addEventListener("click",()=> {
      window.location.assign("captura.html?action=create-gifs");
    })
  }
}
//Come back to index
backHome.addEventListener("click",()=> {
  window.location.assign("index.html");
})
//Open validation record window 
let myGifs = document.getElementById("ownGifs");
let seCreate = document.getElementById("createGifs");
let secValidate = document.getElementById("recordGif");
let btnStart = document.getElementById("btnStart");
btnStart.addEventListener("click",()=> {
  secValidate.classList.toggle("hide");
  seCreate.classList.toggle("hide");
  myGifs.classList.toggle("hide");
  showVideo();
})
//Open recording window 
let btnRecord = document.getElementById("record");
let divStart = document.getElementById("startRecord");
btnRecord.addEventListener("click",()=> {
  divStart.classList.toggle("hide");
  secValidate.classList.toggle("hide");
  startVideo();
})
//Open preview window 
let btnReady = document.getElementById("ready");
let divPreview = document.getElementById("preview");
btnReady.addEventListener("click",()=> {
  divStart.classList.toggle("hide");
  divPreview.classList.toggle("hide");
  stopVideo ();
})
//Open upload gif window 
let btnUpload = document.getElementById("btnUpload");
let divUpload = document.getElementById("upload");
btnUpload.addEventListener("click",()=> {
  divUpload.classList.toggle("hide");
  divPreview.classList.toggle("hide");
  uploadGif ();
  for (let i = 0; i < 5; i++) {
    load();
  };
})
//Success upload gif window
let btnCancel = document.getElementById("cancel");
let divSuccess = document.getElementById("success");
function startUpload() {
    divUpload.classList.toggle("hide");
    divSuccess.classList.toggle("hide");
    myGifs.classList.toggle("hide");
  };
//Repeate gif
let btnRepeat = document.getElementById("repeat");
btnRepeat.addEventListener("click", () => {
  divPreview.classList.toggle("hide");
  seCreate.classList.toggle("hide");
  myGifs.classList.toggle("hide");
})
//Ready final button
let readyEnd = document.getElementById("readyEnd");
readyEnd.addEventListener("click", () => {
  divSuccess.classList.toggle("hide");
  seCreate.classList.toggle("hide");
})
//Menu desplegable
let button = document.getElementById("btn3");
button.addEventListener('click',function() {
    btnStyles.classList.toggle("active");
})
//Save gif 
let btnLoad = document.getElementById("download");
function downloadGif (blob) {
  btnLoad.addEventListener("click", () => {
    invokeSaveAsDialog(blob);
  })
}
//Check camera
var constraints = { audio: false, video: {width: 838}} ;
function preVideo() {
const stream = navigator.mediaDevices.getUserMedia(constraints)
.then(function(mediaStream) {
    return mediaStream;
})
.catch(function(err) {
    return err;
});
return stream
};
//Show preview
async function showVideo() {
let getStream = await preVideo();
var video = document.getElementById("preVideo");
  video.srcObject = getStream;
  video.onloadedmetadata = function(e) {
  video.play();
}
var startVideo = document.getElementById("startVideo");
  startVideo.srcObject = getStream;
  startVideo.onloadedmetadata = function(e) {
  startVideo.play();
}
};
//Start record 
async function startVideo () {
  let getStream = await preVideo();
  recorder = RecordRTC(getStream, {
    type: 'gif',
    frameRate: 1,
    quality: 10,
    width: 360,
    hidden: 240,
    onGifRecordingStarted: function() {
     console.log('started')
   },
  }); 
recorder.startRecording();
};
//Stop record
function stopVideo () {
  recorder.stopRecording ( () => {
    let blob = recorder.getBlob();
    let gifUrl = URL.createObjectURL(blob);
    showPreview (gifUrl);
    downloadGif (blob)
  });
}
//Previous sreen
function showPreview (gifUrl) {
  var preview = document.getElementById("previewVideo");
  preview.src = gifUrl;
  preview.onloadedmetadata = function(e) {
  preview.play();
}
}
//Upload GIF 
let form = new FormData();
var url = "https://upload.giphy.com/v1/gifs";
async function uploadGif () {
  form.append("file",recorder.getBlob(),"myGif.gif");
  form.append("api_key",apiKey);
  form.append("username","dboliva7");
  let dataGif = await postGifs(form);
  saveLocal(dataGif);
};
// Post gifs
function postGifs (form) {
  const infoGif = fetch(url, {
    method: "POST",
    body: form
  })
  .then(res => res.json())
  .then((response) => {
    return response
  })
  .catch(error => console.error('Error:', error))
  return infoGif
  };
//Save in localstorage
  function saveLocal (dataGif) {
  let id = dataGif.data.id;
  var infoLocal = localStorage.getItem("misGifos");
  if (infoLocal !== null) {
    var infoLocal = infoLocal ? infoLocal.split(',') : [];
    infoLocal.unshift(id);
    localStorage.setItem(("misGifos"),infoLocal.toString());
  }
  else {
    localStorage.setItem(("misGifos"),id);
  }
  showSuccess(id)
  };
//Obtain url myGifs
var urlGifos = "https://api.giphy.com/v1/gifs?api_key="
function getUrlGifs (ids='') {
  const myGifsUrl = fetch(urlGifos + apiKey + `&ids=${ids}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;  
    })
    return myGifsUrl
  }
//Show myGifs
let divMyGifs = document.querySelector("#showGifs");
async function getMyGifs(getLocalGifs) {
  let myGifs = await getUrlGifs (getLocalGifs);
  let myGifsData = myGifs.data;
  let html = "";
  myGifsData.forEach ((gif) => { 
    var clases = ["trendImg","trendImg","bigImg","trendImg","trendImg","trendImg","trendImg"];//Tiene que ser par porque el total es par, sino deja espacios vacios
    let random = clases[Math.floor( Math.random()*clases.length)];
    let myGifImg = gif.images.downsized_medium.url;
    html += 
    `<div class="trendContainer ${random}">
    <img class="trendGif" src="${myGifImg}" alt="trends">
    <div class="nameGif gradient trendTitle">
    <p class="bold" ># MisGifos</p>
    </div>
    </div>`;
  });
  divMyGifs.innerHTML = html;
}
//Show sucess gif
async function showSuccess(id) {
  let finalGif = document.getElementById("finalGif");
  let successGif = await getUrlGifs(id);
  let dataFirstGif = successGif.data;
  let firstGif = dataFirstGif[0];
  let urlFirstGif = firstGif.images.downsized_medium.url;
  finalGif.setAttribute("src",urlFirstGif);
  activeCopy(urlFirstGif);
  startUpload();
  state = true;
}
//Copy url gif
let btnCopy = document.getElementById("copy");
  function activeCopy(urlFirstGif) {
    btnCopy.addEventListener("click", () => {
      navigator.clipboard
          .writeText(urlFirstGif)
          .then(() => {
            // console.log(`Text copied to clipboard. ${urlFirstGif}`);
          })
          .catch((err) => {
            console.error(`Failed to copy text. ${err}`);
          });
    });
  }
//Load animation
function load() {
  let divUp = [...document.getElementsByClassName("up")];
  divUp.forEach((up,i) => {
    setTimeout(() => {
      up.style.backgroundColor = "#F7C9F3"
    }, i * 400);
    setTimeout(() => {
      up.style.backgroundColor = "#999999"
    }, 9200);
  })
}
//Change theme
let root = "./css/";
let styleDay = "mainFileDay";
let styleDark = "mainFileDark";
let type = ".css";
let linkThemes = document.getElementById("changeThemes");
let themeDay = document.getElementById("day");
let themeDark = document.getElementById("night");
function changeDay() {//Revisar porque solo me funciona con onclick
      linkThemes.setAttribute("href",""+root+""+styleDay+""+type+"");
      themeDay.setAttribute("class","themeActive");
      themeDark.setAttribute("class","btnGrey");
}
function changeDark() {//Revisar porque solo me funciona con onclick
      linkThemes.setAttribute("href",""+root+""+styleDark+""+type+"");
      themeDark.setAttribute("class","themeActive");
      themeDay.setAttribute("class","btnGrey");
}
themeDay.addEventListener("click",changeDay);
themeDark.addEventListener("click",changeDark);