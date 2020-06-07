//Variables
const apiKey = "u5MxvUvtwc9acidnSviI4nlHRNOIHx44";
//Tending endpoint
const initialTrend = "https://api.giphy.com/v1/gifs/trending?api_key=";
const endTrend = "&limit=30&rating=G";
//Search endpoint
let initialUrl = "https://api.giphy.com/v1/gifs/search?q="; 
//Autocomplete tags
let initialTag = "https://api.giphy.com/v1/gifs/search/tags?api_key=";
//Open catura window
let captura = document.querySelector(".btn1");
captura.addEventListener("click",()=> {
  window.location.assign("captura.html?action=create-gifs"); //Window.location.assign permite abrir una nueva ventana en el index
})
let seeGifos = document.querySelector(".btn4");
seeGifos.addEventListener("click",()=> {
  window.location.assign("captura.html?action=see-gifs");
})
//Menu desplegable
let button = document.getElementById("btn3");
button.addEventListener('click',function() {
    document.getElementById("menuGrey").classList.toggle("active");
})
//Ocultar menu cuando seleccione una opcion
let btnDay = document.getElementById("day");
btnDay.addEventListener('click', ()=> {
    document.getElementById("menuGrey").classList.remove("active");
})
let btnNight = document.getElementById("night");
btnNight.addEventListener('click', ()=> {
    document.getElementById("menuGrey").classList.remove("active");
})
//Mostrar menu sugerencias cuando se comienza la busqueda
let inputSearch = document.getElementById("enterGif");
let searchBtn = document.getElementById("searchGif");
inputSearch.addEventListener("keyup",searchGif);
let suggestMenu = document.getElementById("menuSuggest");
let buttonsMore = document.getElementsByClassName("tagMore");
async function searchGif() {
  if (inputSearch.value.length > 2) {
    createTags()
    searchBtn.classList.add("btnActive");
    suggestMenu.classList.add("suggestMenu");
    suggestMenu.classList.remove("hide");
    searchBtn.addEventListener("click",() => {
      suggestMenu.classList.add("hide");
      getSearch(inputSearch.value);
      searchBtn.classList.remove("btnActive");
      setTimeout(createTagsBtn,1000);
    });
  }
  else {
    searchBtn.classList.remove("btnActive");
    suggestMenu.classList.add("hide");
    tagsDiv.setAttribute("class","initialSize");
    deleteTags()
  }
};
function deleteTags() {
  if (buttonsMore.length > 0) {
    for (let i=0;i <= buttonsMore.length; i++) {
      tagsDiv.removeChild(buttonsMore[i]);
    }
  }
}
// Call suggestions and trenddings
window.onload = function() {
  getSuggestions();
  setTimeout(getTrendings,500);
};
//General function trends ans suggestions
function getInfo (limit=0,offset=0) {
  const trends = fetch(initialTrend + apiKey + `&limit=${limit}`+ `&offset=${offset}` + "&rating=G")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;  
    })
    return trends
  }
// Load suggestions
let divSuggest = document.getElementsByClassName("sugGif");
let divNames = document.getElementsByClassName("nameGif");
async function getSuggestions() {
  let suggestions = await getInfo(4,0);
  let data = suggestions.data;
  let html = "";
  data.forEach ((sug,index) => {
    let cuTitle = sug.title.split("GIF")[0];
    let sugImg = sug.images.downsized_medium.url;
    html = `
    <p class="bold" ># ${cuTitle}</p> 
    <button class="btnClose"><img src="./assets/button3.svg" alt="close"></button>`;
    divNames[index].innerHTML = html;
    html = `
    <img class="sugImg" src="${sugImg}" alt="suggestion">
    <button class="btnMore seeMore" data-tag="${cuTitle}">Ver más…</button>`;
    
    divSuggest[index].innerHTML = html;
    divSuggest[index].addEventListener("click", (e) => {
      if (e.target && e.target.classList.contains("seeMore")) {
        e.preventDefault();
        let btnTitle = e.target.getAttribute("data-tag");
        getSearch(btnTitle);
      }
    })
  });
}
// Load trends
let divTrends = document.querySelector("#trends");
async function getTrendings() {
  let trends = await getInfo(20,4);
  let trendsData = trends.data;
  changeTitle.innerText = "Tendencias:";
  let html = "";
  trendsData.forEach ((trend) => { //¿Cómo automatizar este forEach?
    var clases = ["trendImg","trendImg","bigImg","trendImg","trendImg","trendImg","trendImg"];//Tiene que ser par porque el total es par, sino deja espacios vacios
    let random = clases[Math.floor( Math.random()*clases.length)];
    let trendImg = trend.images.downsized_medium.url;
    let trendTitle = trend.title.split("GIF")[0];
    html += 
    `<div class="trendContainer ${random}">
    <img class="trendGif" src="${trendImg}" alt="trends">
    <div class="nameGif gradient trendTitle">
    <p class="bold" ># ${trendTitle}</p>
    </div>
    </div>`;
  });
  divTrends.innerHTML = html;
}
//General function search
let changeTitle = document.querySelector("#changeTitle");
function getSearch (search='') {
  const found = fetch(initialUrl + search + '&api_key=' + apiKey + '&limit=32')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let results = data.data
      let html = "";
      changeTitle.innerText = "Resultados de la búsqueda";
      window.location.href = "#changeTitle";
      results.forEach ((result) => {
        var clases = ["trendImg","trendImg","bigImg","trendImg","trendImg","trendImg","trendImg"];//Tiene que ser par porque el total es par, sino deja espacios vacios
        let random = clases[Math.floor( Math.random()*clases.length)];
        let resultImg = result.images.downsized_medium.url;
        let resultTitle = result.title.split("GIF")[0];
        html += 
        `<div class="trendContainer ${random}">
        <img class="trendGif" src="${resultImg}" alt="trends">
        <div class="nameGif gradient trendTitle">
        <p class="bold" ># ${resultTitle}</p>
        </div>
        </div>`;
    })
    divTrends.innerHTML = html;
  })
    return found
  }
//Autocomplete search
function autocomplete(limit=0) {
  const tags = fetch(initialTag + apiKey + `&q=${inputSearch.value}` + `&limit=${limit}`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    return data;
  })
  return tags
}
//Create tags list
async function createTags() {
  let getNames = await autocomplete(3);
  let listNames = getNames.data;
  let html = "";
  listNames.forEach((list) => {
    let lisTitle = list.name;
    html += `
    <li class="btnGrey listName" data-li=${lisTitle}>${lisTitle}</li>`;
  })
  suggestMenu.innerHTML = html;
  suggestMenu.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("listName")) {
      e.preventDefault();
      let dataList = e.target.getAttribute("data-li");
      getSearch(dataList);
      searchBtn.classList.remove("btnActive");
      suggestMenu.classList.add("hide");
    }
  })
}
//Create tags buttons
let tagsDiv = document.getElementById("tags");
async function createTagsBtn() {
  let getBtnNames = await autocomplete(5);
  let btnNames = getBtnNames.data;
  let html = "";
  tagsDiv.setAttribute("class","tags")
  btnNames.forEach((btnName) => {
    let btnTitle = btnName.name;
    html += `
    <button class="btnMore tagMore" data-btn="${btnTitle}">#${btnTitle}</button>`;
  })
  tagsDiv.innerHTML = html;
  tagsDiv.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("tagMore")) {
      e.preventDefault();
      let dataBtn = e.target.getAttribute("data-btn");
      getSearch(dataBtn);
    }
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
      themeDay.setAttribute("class","themeActiveDay");
      themeDark.setAttribute("class","btnGrey");
}
function changeDark() {//Revisar porque solo me funciona con onclick
  console.log(linkThemes.href);
      linkThemes.setAttribute("href",""+root+""+styleDark+""+type+"");
      themeDark.setAttribute("class","themeActive");
      themeDay.setAttribute("class","btnGrey");
}
themeDay.addEventListener("click",changeDay);
themeDark.addEventListener("click",changeDark);


