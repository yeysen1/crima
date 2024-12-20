
const express = require('express');
const app = express();

app.use(express.json());

// Manually set CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  // If an OPTIONS request, end it quickly
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

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

// Helper for momentary actions
function activateMomentary(key) {
  state[key] = true;
  setTimeout(() => {
    state[key] = false;
  }, 2000);
}

// GET /state: return current state
app.get('/state', (req, res) => {
  res.json(state);
});

// POST /update: update state based on request
app.post('/update', (req, res) => {
  const updates = req.body;

  // Handle mutually exclusive toggles (forward, arm, backwards)
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
