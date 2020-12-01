let hh, clap, bass, oh; //INSTRUMENT Container
let hPat, cPat, bPat, oPat; //INSTRUMENT Pattern
let hPhrase, cPhrase, bPhrase, oPhrase; //INSTRUMENT Phrase
let iKick, iClap, iHat //ICONS
let drums; //PART
let bpmCTRL; //slider for bpm
let bpmText;
let beatLenth;
let cnv;
let sPat;
let cursorPos;
let bPlay;
let checkBox;


function setup() {
  cnv = createCanvas(380, 160);
  cnv.mousePressed(canvasPressed);
  beatLength = 9;
  cursorPos = 0;

  
  bpmText = document.getElementById("tempo");
  checkbox = document.querySelector("input[name=checkbox]");

  
  
  hh = loadSound('assets/closed-hi-hat-ghetto_130bpm_C_minor.wav', () => {});
  clap = loadSound('assets/clap-for-production-9_B_minor.wav', () => {});
  bass = loadSound('assets/bass-kick-logic.wav', () => {});
  oh = loadSound('assets/oHat.wav', () => {});
  
  //PATTERNS
  hPat = [0, 0, 1, 0, 0, 0, 1, 0];
  oPat = [0, 0, 0, 0, 0, 0, 0, 1];
  cPat = [0, 0, 0, 0, 1, 0, 0, 0];
  bPat = [1, 0, 0, 0, 1, 0, 0, 0];
  sPat = [1, 2, 3, 4, 5, 6, 7, 8];
   
  //PHRASHES
  hPhrase = new p5.Phrase('hh', (time) => 
                          {hh.play(time)
  }, hPat);

  oPhrase = new p5.Phrase('oh', (time) => {
    oh.play(time)
  }, oPat);
  
    cPhrase = new p5.Phrase('clap', (time) => {
    clap.play(time)
  }, cPat);
  
    bPhrase = new p5.Phrase('bass', (time) => {
    bass.play(time)
  }, bPat);

  drums = new p5.Part();

  drums.addPhrase(hPhrase);
  drums.addPhrase(oPhrase);
  drums.addPhrase(cPhrase);
  drums.addPhrase(bPhrase);
  drums.addPhrase('seq', sequence, sPat);
   
  bpmCTRL = createSlider(30, 300, 80, 1);
  bpmCTRL.style("margin-top:40px;")
  bpmCTRL.input(() => {
    drums.setBPM(bpmCTRL.value()) 
    bpmText.textContent = "BPM: " + bpmCTRL.value()
  });
  drums.setBPM('80');
  

  bPlay = createButton('▶ Play');
  bPlay.style("margin-top:10px; width:200px;")
  bPlay.mouseClicked(playLoop);
  drawMatrix();

  checkbox.addEventListener('change', function() {
    if (this.checked) {
      bpmCTRL.elt.step = 10;
    } else {
      bpmCTRL.elt.step = 1;
    }
  });

   
}




function playLoop() {
  if (!drums.isPlaying) {
    drums.loop();
    bPlay.html("❚❚ Pause")
  } else {
    drums.stop();
    bPlay.html("▶ Play")
  }
}

function touchStarted() {
  getAudioContext().resume()
  console.log('working');
}

function preload() {
  iKick = loadImage('assets/KICK.png');
  iOpen = loadImage('assets/OPEN.png')
  iClap = loadImage('assets/CLAP.png')
  iHat = loadImage('assets/HIHAT.png')
}


function canvasPressed() {
  let rowClicked = floor(4*mouseY/height)
  let indexClicked = floor(beatLength*mouseX/width)-1
  if (rowClicked == 0) {
    console.log('First Row ' + indexClicked);
    hPat[indexClicked] = +!hPat[indexClicked];
  }
  if (rowClicked == 1) {
    console.log('Second Row ' + indexClicked);
    oPat[indexClicked] = +!oPat[indexClicked];
  }
  if (rowClicked == 2) {
    console.log('Third Row ' + indexClicked);
    cPat[indexClicked] = +!cPat[indexClicked];
  }
  if (rowClicked == 3) {
    console.log('Fourth Row ' + indexClicked);
    bPat[indexClicked] = +!bPat[indexClicked];
  }
  
  drawMatrix();
}



function drawMatrix() {
  background(90);
  stroke('gray');
  strokeWeight(2);
  fill('white');
  
  for(let i = 0; i < beatLength+1; i++) {
    line(i*width/beatLength, 0, i*width/beatLength, height);
  }
  
  for(let i = 0; i < 5; i++) {
    line(0, i*height/4, width, i*height/4)
  }
  noStroke();
  
  image(iHat, 5, 5, 30,30)
  image(iOpen, 5, 45, 30, 30)
  image(iClap, 5, 85, 30, 30)
  image(iKick, 5, 125, 30, 30)
  
  for(let i = 1; i < beatLength+1; i++) {
    if (hPat[i-1] == 1) {
      ellipse(i*width/beatLength + 0.5*width/beatLength, height/4*0.5, 10);
    }
    if (oPat[i-1] == 1) {
      ellipse(i*width/beatLength + 0.5*width/beatLength, height/4*1.5, 10);
    }
    if (cPat[i-1] == 1) {
      ellipse(i*width/beatLength + 0.5*width/beatLength, height/4*2.5, 10);
    }
    if (bPat[i-1] == 1) {
      ellipse(i*width/beatLength + 0.5*width/beatLength, height/4*3.5, 10);
    }
  }
}


function sequence(time, beatIndex) {
  drawMatrix();
  stroke('red');
  fill(255, 0, 0, 30);
  rect(beatIndex*(width/beatLength), 0, width/beatLength, height);
}

