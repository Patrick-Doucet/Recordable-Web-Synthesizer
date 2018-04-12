let audioCtx = new (AudioContext || webkitAudioContext)(); // audiocontext object for different browsers
let masterGainNode = null;
let oscillatorList = [];

let mediaStreamDestination = null;
let mediaRecorder = null;

let noteFreq = null;
let qwertyDivMap = {};
let octave = 3;

let currentlyRecording = false;
let chunks = [];
let mostRecentAudio = null;
let mostRecentUrl = "";

let keysPressed = [];

// TEMPORARY FUNCTION, should store values in db and fetch them at page load
// @jean
function createNoteTable() {
    let noteFreq = [];
    for (let i=0; i< 9; i++) {
        noteFreq[i] = [];
    }
    /*
    // Currently Unused
    noteFreq[0][9] = 27.500000000000000;
    noteFreq[0][10] = 29.135235094880619;
    noteFreq[0][11] = 30.867706328507756;
    */
    noteFreq[1] = [32.703195662574829,34.647828872109012,36.708095989675945,38.890872965260113,  // C,C#,D,D#
                    41.203444614108741,43.653528929125485,46.249302838954299,48.999429497718661, // E,F,F#,G
                    51.913087197493142,55.000000000000000,58.270470189761239,61.735412657015513] // G#,A,A#,B
    noteFreq[2] = [65.406391325149658,69.295657744218024,73.416191979351890,77.781745930520227,
                    82.406889228217482,87.307057858250971,92.498605677908599,97.998858995437323,
                    103.826174394986284,110.000000000000000,116.540940379522479,123.470825314031027];
    noteFreq[3] = [130.812782650299317,138.591315488436048,146.832383958703780,155.563491861040455,
                    164.813778456434964,174.614115716501942,184.997211355817199,195.997717990874647,
                    207.652348789972569,220.000000000000000,233.081880759044958,246.941650628062055];
    noteFreq[4] = [261.625565300598634,277.182630976872096,293.664767917407560,311.126983722080910,
                    329.627556912869929,349.228231433003884,369.994422711634398,391.995435981749294,
                    415.304697579945138,440.000000000000000,466.163761518089916,493.883301256124111];
    noteFreq[5] = [523.251130601197269,554.365261953744192,587.329535834815120,622.253967444161821,
                    659.255113825739859,698.456462866007768,739.988845423268797,783.990871963498588,
                    830.609395159890277,880.000000000000000,932.327523036179832,987.766602512248223];
    noteFreq[6] = [1046.502261202394538,1108.730523907488384,1174.659071669630241,1244.507934888323642,
                    1318.510227651479718,1396.912925732015537,1479.977690846537595,1567.981743926997176,
                    1661.218790319780554,1760.000000000000000,1864.655046072359665,1975.533205024496447];
    noteFreq[7] = [2093.004522404789077,2217.461047814976769,2349.318143339260482,2489.015869776647285,
                    2637.020455302959437,2793.825851464031075,2959.955381693075191,3135.963487853994352,
                    3322.437580639561108,3520.000000000000000,3729.310092144719331,3951.066410048992894];
    // noteFreq[8][0] = 4186.009044809578154; // Currently Unused
    return noteFreq;
}

function setup(){
    volumeValue = 0.5; // (float between 0 and 1) // TODO get volume from slider
    masterGainNode = audioCtx.createGain();
    masterGainNode.connect(audioCtx.destination);
    masterGainNode.gain.value = volumeValue;
    
    mediaStreamDestination = audioCtx.createMediaStreamDestination();
    mediaRecorder = new MediaRecorder(mediaStreamDestination.stream);
    mediaRecorder.ondataavailable = function(e) {
        // push each chunk (blobs) in an array
        chunks.push(e.data);
    };

    noteFreq = createNoteTable();

    // Initialise an oscillator for each piano key
    var numOfKeys = $('div', $('.PianoComponent')).length;
    for (i=0; i<numOfKeys; i++) {
        oscillatorList[i] = [];
        keysPressed[i] = false;
    }

    // Record button
    $("#recordButton").click(record);

    $('div', $('.PianoComponent')).each(function () { // For each child div of the PianoComponent class
        // Deal with mouse clicks on the piano keys
        $(this).on("mousedown touchstart", notePressed);
        $(this).on("mouseup mouseleave touchend", noteReleased);

        qwertyDivMap[$(this).attr('value')] = $(this).attr('id');
    });

    // Functionnality for octave up and down buttons
    $('#octaveDown').click(function(e){
        octave = Math.max(1, octave - 1); // dont go below 1
    });
    $('#octaveUp').click(function(e){
        octave = Math.min(6, octave + 1); // dont go above 6
    });

    // Deal with qwerty keyboard clicks
    $(document).keydown(function(e){
        if(e.which == '-' || e.which == '_' || e.which == 'z' || e.which == 'Z'){
            octave = Math.max(1, octave - 1); // dont go below 1
        }else if(e.which == '+' || e.which == '=' || e.which == 'x' || e.which == 'X'){
            octave = Math.max(1, octave - 1); // dont go below 1
        }
    });
    $(document).keydown(userPressedAKey);
    $(document).keyup(userReleasedAKey);
};

function record(e){
    if(!currentlyRecording){
	    chunks = [];
        mediaRecorder.start(1000);
        currentlyRecording = true;
    }else{
        mediaRecorder.stop();
        currentlyRecording = false;

        // dump chunks data into blob
        var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
        
        var mostRecentUrl = URL.createObjectURL(blob);
        $("#mostRecentPlayback").attr("src", mostRecentUrl);
        
        mostRecentAudio = new Audio(mostRecentUrl);
	    mostRecentAudio.play();
    }
};

//VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
//V############################################################V
//V######## BELOW ARE FUNCTIONS WHICH DEAL WITH PIANO #########V
//V############# KEY CLICKS AND PLAYBACK ######################V
//V############################################################V
//VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
function userPressedAKey(e){
    var c = String.fromCharCode(e.keyCode).toLowerCase();
    if(c==';'){c='semiColon';}
    $("#" + c).css('background-color', 'blue');
    let dataset = e.target.dataset;
    dataset["value"] = $("#"+c).attr('value');
    notePressed(e);
};

function userReleasedAKey(e){
    var c = String.fromCharCode(e.keyCode).toLowerCase();
    if(c==';'){c='semiColon';}
    $("#" + c).css('background-color', '');
    let dataset = e.target.dataset;
    dataset["value"] = $("#"+c).attr('value');
    noteReleased(e);
};

function playTone(freq){
    let osc = audioCtx.createOscillator();
    osc.connect(masterGainNode);
    if(currentlyRecording){
        osc.connect(mediaStreamDestination);
    }

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

// TODO: @matt @sandermfc tomorrow problem
// PROBLEM WHEN PRESSING MORE THAN 1 KEYS:
// first key is pressed and held
// 2nd key is pushed in, HOWEVER, !dataset["pressed"] evaluates to false because it was set by the first one
// sound doesnt play but no error yet
// 2nd key gets let go, because dataset["pressed"] is true from first key, we try to .stop() on the 2nd.
// that key has no .stop() method and theres an error.
function notePressed(e){
    
    if(e.type == "keydown"){
        let dataset = e.target.dataset;
        var tone = dataset["value"];
        if(tone < 12){
            // 12 notes from the current octave
            var freq = noteFreq[octave][tone];
        }else{
            // 6 ish from the next octave
            var freq = noteFreq[octave+1][tone%12];
        }
        if(!keyPressed[tone]){
            oscillatorList[tone] = playTone(freq);
            keysPressed[tone] = true;
        }
    }else{
        let dataset = e.target.dataset;
        var tone = e.target.attributes.value.value;
        if(tone < 12){
            // 12 notes from the current octave
            var freq = noteFreq[octave][tone];
        }else{
            // 6 ish from the next octave
            var freq = noteFreq[octave+1][tone%12];
        }
        if(!keysPressed[tone]){
            oscillatorList[tone] = playTone(freq);
            keysPressed[tone] = true;
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
    if (dataset && keysPressed[tone] == "yes") {
        oscillatorList[tone].stop();
        oscillatorList[tone] = null;
        keysPressed[tone] = false;
    }
};
