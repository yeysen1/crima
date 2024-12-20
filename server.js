const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Initial state
let state = {
  forward: false,
  backwards: false,
  arm: false,
  "1footup": false,
  "1footdown": false,
  fire: false,
  "10": false,
  "45": false,
  "90": false,
  "-10": false,
  "-45": false,
  "-90": false
};

function activateMomentary(key) {
  state[key] = true;
  // We'll revert after 2 seconds in the state
  setTimeout(() => {
    state[key] = false;
  }, 2000);
}

app.get('/state', (req, res) => {
  res.json(state);
});

app.post('/update', (req, res) => {
  const updates = req.body;

  // Handle exclusive toggles: forward, arm, backwards
  if ('forward' in updates || 'arm' in updates || 'backwards' in updates) {
    if (updates.forward === true) {
      state.forward = true; state.arm = false; state.backwards = false;
    } else if (updates.arm === true) {
      state.arm = true; state.forward = false; state.backwards = false;
    } else if (updates.backwards === true) {
      state.backwards = true; state.forward = false; state.arm = false;
    }

    // If explicitly set false, apply it
    if (updates.forward === false) state.forward = false;
    if (updates.arm === false) state.arm = false;
    if (updates.backwards === false) state.backwards = false;
  }

  // For all others, treat as momentary
  for (let key of Object.keys(updates)) {
    if (!['forward','backwards','arm'].includes(key)) {
      if (updates[key] === true) {
        activateMomentary(key);
      } else if (updates[key] === false) {
        state[key] = false;
      }
    }
  }

  res.json({status: "ok"});
});

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000');
});
