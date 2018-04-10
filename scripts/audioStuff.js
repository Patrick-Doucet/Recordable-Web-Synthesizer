let audioCtx = new (AudioContext || webkitAudioContext)(); // audiocontext object for different browsers
let masterGainNode = null;
let oscillatorList = [];
let noteFreq = null;
let qwertyDivMap = {};

// TEMPORARY FUNCTION, should store values in db and fetch them at page load
// @jean
function createNoteTable() {
    let noteFreq = [];
    for (let i=0; i< 9; i++) {
        noteFreq[i] = [];
    }
  
    noteFreq[0][9] = 27.500000000000000;
    noteFreq[0][10] = 29.135235094880619;
    noteFreq[0][11] = 30.867706328507756;
  
    noteFreq[1][0] = 32.703195662574829; //C
    noteFreq[1][1] = 34.647828872109012; //C#
    noteFreq[1][2] = 36.708095989675945; //D
    noteFreq[1][3] = 38.890872965260113; //D#
    noteFreq[1][4] = 41.203444614108741; //E
    noteFreq[1][5] = 43.653528929125485; //F
    noteFreq[1][6] = 46.249302838954299; //F#
    noteFreq[1][7] = 48.999429497718661; //G
    noteFreq[1][8] = 51.913087197493142; //G#
    noteFreq[1][9] = 55.000000000000000; //A
    noteFreq[1][10] = 58.270470189761239;//A#
    noteFreq[1][11] = 61.735412657015513;//B
    
    noteFreq[2][0] = 65.406391325149658;
    noteFreq[2][1] = 69.295657744218024;
    noteFreq[2][2] = 73.416191979351890;
    noteFreq[2][3] = 77.781745930520227;
    noteFreq[2][4] = 82.406889228217482;
    noteFreq[2][5] = 87.307057858250971;
    noteFreq[2][6] = 92.498605677908599;
    noteFreq[2][7] = 97.998858995437323;
    noteFreq[2][8] = 103.826174394986284;
    noteFreq[2][9] = 110.000000000000000;
    noteFreq[2][10] = 116.540940379522479;
    noteFreq[2][11] = 123.470825314031027;
  
    noteFreq[3][0] = 130.812782650299317;
    noteFreq[3][1] = 138.591315488436048;
    noteFreq[3][2] = 146.832383958703780;
    noteFreq[3][3] = 155.563491861040455;
    noteFreq[3][4] = 164.813778456434964;
    noteFreq[3][5] = 174.614115716501942;
    noteFreq[3][6] = 184.997211355817199;
    noteFreq[3][7] = 195.997717990874647;
    noteFreq[3][8] = 207.652348789972569;
    noteFreq[3][9] = 220.000000000000000;
    noteFreq[3][10] = 233.081880759044958;
    noteFreq[3][11] = 246.941650628062055;
  
    noteFreq[4][0] = 261.625565300598634;
    noteFreq[4][1] = 277.182630976872096;
    noteFreq[4][2] = 293.664767917407560;
    noteFreq[4][3] = 311.126983722080910;
    noteFreq[4][4] = 329.627556912869929;
    noteFreq[4][5] = 349.228231433003884;
    noteFreq[4][6] = 369.994422711634398;
    noteFreq[4][7] = 391.995435981749294;
    noteFreq[4][8] = 415.304697579945138;
    noteFreq[4][9] = 440.000000000000000;
    noteFreq[4][10] = 466.163761518089916;
    noteFreq[4][11] = 493.883301256124111;
  
    noteFreq[5][0] = 523.251130601197269;
    noteFreq[5][1] = 554.365261953744192;
    noteFreq[5][2] = 587.329535834815120;
    noteFreq[5][3] = 622.253967444161821;
    noteFreq[5][4] = 659.255113825739859;
    noteFreq[5][5] = 698.456462866007768;
    noteFreq[5][6] = 739.988845423268797;
    noteFreq[5][7] = 783.990871963498588;
    noteFreq[5][8] = 830.609395159890277;
    noteFreq[5][9] = 880.000000000000000;
    noteFreq[5][10] = 932.327523036179832;
    noteFreq[5][11] = 987.766602512248223;
  
    noteFreq[6][0] = 1046.502261202394538;
    noteFreq[6][1] = 1108.730523907488384;
    noteFreq[6][2] = 1174.659071669630241;
    noteFreq[6][3] = 1244.507934888323642;
    noteFreq[6][4] = 1318.510227651479718;
    noteFreq[6][5] = 1396.912925732015537;
    noteFreq[6][6] = 1479.977690846537595;
    noteFreq[6][7] = 1567.981743926997176;
    noteFreq[6][8] = 1661.218790319780554;
    noteFreq[6][9] = 1760.000000000000000;
    noteFreq[6][10] = 1864.655046072359665;
    noteFreq[6][11] = 1975.533205024496447;

    noteFreq[7][0] = 2093.004522404789077;
    noteFreq[7][1] = 2217.461047814976769;
    noteFreq[7][2] = 2349.318143339260482;
    noteFreq[7][3] = 2489.015869776647285;
    noteFreq[7][4] = 2637.020455302959437;
    noteFreq[7][5] = 2793.825851464031075;
    noteFreq[7][6] = 2959.955381693075191;
    noteFreq[7][7] = 3135.963487853994352;
    noteFreq[7][8] = 3322.437580639561108;
    noteFreq[7][9] = 3520.000000000000000;
    noteFreq[7][10] = 3729.310092144719331;
    noteFreq[7][11] = 3951.066410048992894;
  
    noteFreq[8][0] = 4186.009044809578154;
    return noteFreq;
}

function setup(){
    volumeValue = 0.5; // (float between 0 and 1) // TODO get volume from slider
    masterGainNode = audioCtx.createGain();
    masterGainNode.connect(audioCtx.destination);
    masterGainNode.gain.value = volumeValue;
    
    noteFreq = createNoteTable();

    // Initialise an oscillator for each piano key
    var numOfKeys = $('div', $('.PianoComponent')).length;
    for (i=0; i<numOfKeys; i++) {
        oscillatorList[i] = [];
    }

    $('div', $('.PianoComponent')).each(function () { // For each child div of the PianoComponent class
        // Deal with mouse clicks on the piano keys
        $(this).on("mousedown mouseover", notePressed);
        $(this).on("mouseup mouseleave", noteReleased);

        qwertyDivMap[$(this).attr('value')] = $(this).attr('id');
    });

    // Deal with qwerty keyboard clicks
    $(document).keydown(userPressedAKey);
    $(document).keyup(userReleasedAKey);
};

function record(){
    // TODO
    // add helper functions for events
    // @Jean : Calls for saving stuff to db would go here or in helper scripts
};

//VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
//V############################################################V
//V######## BELOW ARE FUNCTIONS WHICH DEAL WITH PIANO #########V
//V############# KEY CLICKS AND PLAYBACK ######################V
//V############################################################V
//VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
function userPressedAKey(e){
    console.log("pressing");
    var c = String.fromCharCode(e.keyCode).toLowerCase();
    if(c==';'){c='semiColon';}
    let dataset = e.target.dataset;
    dataset["value"] = $("#"+c).attr('value');
    notePressed(e);
};

function userReleasedAKey(e){
    var c = String.fromCharCode(e.keyCode).toLowerCase();
    if(c==';'){c='semiColon';}
    let dataset = e.target.dataset;
    dataset["value"] = $("#"+c).attr('value');
    noteReleased(e);
};

function playTone(freq){
    let osc = audioCtx.createOscillator();
    osc.connect(masterGainNode);

    var type = $('#waveSlider option:selected').val();
    if(type == "custom"){
        // osc.setPeriodicWave(customWaveForm) // TODO
    }else{
        osc.type = type;
    }

    osc.frequency.value = freq;
    osc.start(); // Doesn't actually start playing yet [only in notePressed()]

    return osc;
};
function notePressed(e){
    if(e.buttons & 1) { // left mouse click
        let dataset = e.target.dataset;
        var tone = e.target.attributes.value.value;
        var octave = 3;
        if(tone < 12){
            // 12 notes from the current octave
            var freq = noteFreq[octave][tone];
        }else{
            // 6 ish from the next octave
            var freq = noteFreq[octave+1][tone%12];
        }
        if(!dataset["pressed"]){
            oscillatorList[tone] = playTone(freq);
            dataset["pressed"] = "yes";
        }
    }else if(e.type == "keydown"){
        let dataset = e.target.dataset;
        var tone = dataset["value"];
        var octave = 3;
        if(tone < 12){
            // 12 notes from the current octave
            var freq = noteFreq[octave][tone];
        }else{
            // 6 ish from the next octave
            var freq = noteFreq[octave+1][tone%12];
        }
        if(!dataset["pressed"]){
            oscillatorList[tone] = playTone(freq);
            dataset["pressed"] = "yes";
        }
    }
};
function noteReleased(e){
    let dataset = e.target.dataset;
    if(e.type == "keyup"){
        var tone = dataset["value"];
    }else{
        var tone = e.target.attributes.value.value;
    }
    if (dataset && dataset["pressed"] == "yes") {
        oscillatorList[tone].stop();
        oscillatorList[tone] = null;
        delete dataset["pressed"];
    }
};
