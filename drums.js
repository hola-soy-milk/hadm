const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playNoise() {
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
}

let lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
let scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

let currentNote = 0;
let nextNoteTime = 0.0; // when the next note is due.

function nextNote() {
  const tempo = 120;
  const secondsPerBeat = 60.0 / tempo;

  nextNoteTime += secondsPerBeat; // Add beat length to last beat time

  // Advance the beat number, wrap to zero
  currentNote++;
  if (currentNote === 4) {
    currentNote = 0;
  }
}

const notesInQueue = [];

function scheduleNote(beatNumber, time) {

  // push the note on the queue, even if we're not playing.
  notesInQueue.push({ note: beatNumber, time: time });

  playNoise()
}

function scheduler() {
  // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
  while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime ) {
    scheduleNote(currentNote, nextNoteTime);
    nextNote();
  }
  timerID = window.setTimeout(scheduler, lookahead);
}

nextNoteTime = audioCtx.currentTime;
scheduler();
