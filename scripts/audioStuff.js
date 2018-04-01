function playSound(gainValue, oscFreq, oscType, oscDetune){
    /* // Test bassy sound
    gainValue   = 0.5;
    oscFreq     = 50;
    oscType     = 'sine';
    oscDetune   = 0;
    */
    var audioContext = window.AudioContext || window.webkitAudioContext;
    var audioCtx = new audioContext();

    // Create gain node
    let gainNode = audioCtx.createGain();
    gainNode.gain.value = gainValue;

    // Create oscillator
    let osc = audioCtx.createOscillator();
    osc.frequency.value = oscFreq; // frequency in Hz
    osc.type = oscType;
    osc.detune.value = oscDetune;

    // connect oscillator to gainNode
    osc.connect(gainNode);

    // Start the oscillator
    osc.start();

    // audioCtx.destination is the speakers by default
    gainNode.connect(audioCtx.destination);
};