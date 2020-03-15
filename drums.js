const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

const bufferSize = audioCtx.sampleRate * 0.1; // set the time of the note
const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate); // create an empty buffer
let data = buffer.getChannelData(0); // get data

// fill the buffer with noise
for (let i = 0; i < bufferSize; i++) {
  data[i] = Math.random() * 2 - 1;
}

// create a buffer source for our created data
let noise = audioCtx.createBufferSource();
noise.buffer = buffer;

// connect our graph
noise.connect(audioCtx.destination);
noise.start();
