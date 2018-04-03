
var audioCtx = new (AudioContext || webkitAudioContext)(); // audiocontext object for different browsers
let masterGainNode = null;
var thing = []; // TODO: placeholder


function setup(){
    volumeValue = 50; // TODO get volume from slider
    masterGainNode = audioCtx.createGain();
    masterGainNode.connect(audioCtx.destination);
    masterGainNode.gain.value = volumeValue;

    // Give the piano keys some functionnality
    $('div', $('.PianoComponent')).each(function () { // For each child div of the PianoComponent class
        $(this).on("mousedown", notePressed);
        $(this).on("mouseup", noteReleased);
        // Next 2 are needed, otherwise the sound playback continues if users mouse leaves button before unclicking
        $(this).on("mouseover", notePressed);
        $(this).on("mouseleave", noteReleased);
    });
};

function record(){
    // TODO
    // add helper functions for events
    // @Jean : Calls for saving stuff to db would go here or in helper scripts
};

//VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
//V############################################################V
//V######## BELOW ARE FUNCTIONS WHICH DEAL WITH PIANO #########V
//V############# KEY CLICKS AND PLAYBACK ######################V
//V############################################################V
//VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
function playTone(freq){
    let osc = audioCtx.createOscillator();
    osc.connect(masterGainNode);

    let type = $('#waveSlider option:selected').text();

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
    if(e.buttons & 1) {
        let dataset = e.target.dataset;
        var freq = 10+10*e.target.attributes.value.value; // TODO, get freq from saved table with freqs for each note
        if(!dataset["pressed"]){
            thing[0] = playTone(freq); // TODO
            dataset["pressed"] = "yes";
        }
    }
};
function noteReleased(e){
    let dataset = e.target.dataset;
    if (dataset && dataset["pressed"] == "yes") {
        thing[0].stop(); // TODO
        thing[0] = null; // TODO
        delete dataset["pressed"];
    }
};
