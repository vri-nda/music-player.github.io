//lets select all required tags and elemets

const section = document.querySelector(".section"),
  musicImg = section.querySelector(".img-area img"),
  musicName = section.querySelector(".song-details .name"),
  musicArtist = section.querySelector(".song-details .artist"),
  mainAudio = section.querySelector("#main-audio"),

  playPauseBtn = section.querySelector(".play-pause"),
  prevBtn = section.querySelector("#prev"),
  nextBtn = section.querySelector("#next"),

  progressArea = section.querySelector(".progress-area"),
  progressBar = section.querySelector(".progress-bar"),

  musicList = section.querySelector(".music-list"),
  showMoreBtn = section.querySelector("#more-music"),
  hideMusicBtn = musicList.querySelector("#close");




let musicIndex = Math.floor((Math.random() * allMusic.length) + 1); //when ever we refresh the page random song will play


window.addEventListener("load", () => {
  //calling load music function once the window is loaded
  loadMusic(musicIndex);
  //playingSong();
  playingNow();
})

//load music function
function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name; //name of song will get change when musicIndex value changes
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `images/${allMusic[indexNumb - 1].img}`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}`;
}


//playing songs
//play music btn event
playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = section.classList.contains("paused");
  //if isMusicPaused is true then call pauseMusic else call play
  isMusicPaused ? pauseMusic() : playMusic();

});

//play music function
function playMusic() {
  section.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause"; //pause sign changes to play sign on click
  mainAudio.play();
}

//pause music function
function pauseMusic() {
  section.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow"; //play sign changes to pause sign on click
  mainAudio.pause();
}

//next btn function
function nextMusic() {
  //we will just increment index by 1
  musicIndex++;
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex; //if musicIndex is greater than array length then musicIndex will be 1 so the first song will play
  loadMusic(musicIndex);
  playMusic();
}
//next btn event
nextBtn.addEventListener("click", () => {
  nextMusic(); //calling next music function
});


//previous btn function
function prevMusic() {
  //we will just decrement index by 1
  musicIndex--;
  //if musicIndex is samller than 1 then musicIndex will be array length so the last song will play
  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
}
//next btn event
prevBtn.addEventListener("click", () => {
  prevMusic(); //calling next music function
});


//updating width of progress bar according to music time
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime; //shows current time of song
  const duration = e.target.duration; //shows total duration of song
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;


  //updating the current time and total time of timer--------------------

  let musicCurrentTime = section.querySelector(".current"),
    musicDuration = section.querySelector(".duration");

  mainAudio.addEventListener("loadeddata", () => {
    //updating total duration time of songs
    let audioDuration = mainAudio.duration;
    musicDuration.innerText = audioDuration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);
    //adding 0 if sec is less than 10;
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });

  //updating playing song current time.
  // let audioDuration=mainAudio.currentTime;
  // musicDuration.innerText=audioDuration;
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  //adding 0 if sec is less than 10;
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//lets update playing song current time according to the progress bar width
//if we click anywhere on bar song lyrics and time will get change

progressArea.addEventListener("click", (e) => {
  //getting the width of progress bar
  let progressWidthvalue = progressArea.clientWidth;
  //getting offsetX value
  let clickedOffSetX = e.offsetX;
  //getting song total duration
  let songDuration = mainAudio.duration;

  mainAudio.currentTime = (clickedOffSetX / progressWidthvalue) * songDuration;
  playMusic(); //if music is paused and user click on progress bar then music will play
});



//repeat icon , shuffle icon ,looped icon
const repeatBtn = section.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  //first get the innerText of the icon then do changes accordingly
  let getText = repeatBtn.innerText; //getting innerText of icon

  //different changes on different icons using switch
  switch (getText) {
    case "repeat": //if this icon is repeat then change it to repeat_one
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "song looped");
      break;
    case "repeat_one": //if icon is repeat_one then change it to shuffle
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "playback shuffle");
      break;
    case "shuffle": //if icon is shuffle then change it to repeat
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "playlist looped");
      break;
  }

});

//working--- after the song ends
mainAudio.addEventListener("ended", () => {

  let getText = repeatBtn.innerText; //getting innerText of icon
  //if icon is set to loop songs then repeat the current song-------

  switch (getText) {
    case "repeat": //if the icon is repeat then simply we call the nextMusic function so that next song will play
      nextMusic();
      break;
    case "repeat_one": //if icon is repeat_one then change the current playing song current time to 0 so that song will start from beginning
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle": //if icon is shuffle then change it to repeat and play random song
      //generate random index bw the max range of array length
      let randomIndex = Math.floor((Math.random() * allMusic.length) + 1);
      do {
        randomIndex = Math.floor((Math.random() * allMusic.length) + 1);
      }
      while (musicIndex == randomIndex); //this loop runs until the next random number wont be the same of current music index
      musicIndex = randomIndex; //passing randomIndex to musicIndex so the random song will play
      loadMusic(musicIndex); //calling loadMusic function
      playMusic();
      break;
  }

});

//show or hide of music list panel-----------

showMoreBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
  showMoreBtn.click();
});


const ulTag = section.querySelector("ul");
//create li according to array length
for (let i = 0; i < allMusic.length; i++) {
  //pass the song name,artist from array to li
  let liTag = `<li li-index="${i+1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}"></audio>
                <span id="${allMusic[i].src}"  class="audio-duration">3:40</span>
              </li>`;

  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

//to set the total duration of the song    (abhi 3:40 hi dikha raha koi error hai yeah)

// liAudioTag.addEventListener("loadeddata", () => { //loadeddata event is used to get audio total duration without playing it
//   let audioDuration = liAudioTag.duration;
//   let totalMin = Math.floor(audioDuration / 60);
//   let totalSec = Math.floor(audioDuration % 60);
//   //adding 0 if sec is less than 10;
//   if (totalSec < 10) {
//     totalSec = `0${totalSec}`;
//   }
//   liAudioDuration.innerText = `${totalMin}:${totalSec}`;
// });
}

//playing particular song on click------ working
const allLiTags = ulTag.querySelectorAll("li");

function playingNow() {
  for (let j = 0; j < allLiTags.length; j++) {
    //remove playing class from all other li except the last one which is in run
    if (allLiTags[j].classList.contains("playing")) {
      allLiTags[j].classList.remove("playing");
    }
    //if their is an li tag which li index is equal to music index then this music is playing now
    if (allLiTags[j].getAttribute("li-index") == musicIndex) {
      allLiTags[j].classList.add("playing");
    }
    allLiTags[j].setAttribute("onclick", "clicked(this)"); //adding oneclick attribute to all li tags
  }

}


//play song on li click
function clicked(element) {
  let getLiIndex = element.getAttribute("li-index"); //getting li index of particular clicked li tag
  musicIndex = getLiIndex; //passing that li index to musicIndex
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}








//.......
