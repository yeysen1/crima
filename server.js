// server.js

const express = require('express');
const path = require('path');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

/*
  State Structure:
  - Toggle Buttons: forward, backwards, arm
  - Momentary Buttons: fire, 1footup, 1footdown
  - Angle Buttons: "10", "45", "90", "-10", "-45", "-90"
*/
let state = {
  // Toggle Buttons
  forward: false,
  backwards: false,
  arm: false,

  // Momentary Buttons
  fire: false,
  '1footup': false,
  '1footdown': false,

  // Angle Buttons
  '10': false,
  '45': false,
  '90': false,
  '-10': false,
  '-45': false,
  '-90': false,
};

/**
 * Helper Function: Deactivate Toggle Buttons Except Specified One
 * Ensures mutual exclusivity among forward, backwards, and arm buttons.
 * @param {string} except - The button to remain active.
 */
function deactivateExclusiveButtons(except) {
  const toggles = ['forward', 'backwards', 'arm'];
  toggles.forEach(toggle => {
    if (toggle !== except) {
      state[toggle] = false;
    }
  });
}

/**
 * Endpoint: POST /forward
 * Toggles the 'forward' button. Ensures mutual exclusivity.
 */
app.post('/forward', (req, res) => {
  if (state.forward) {
    // Deactivate if already active
    state.forward = false;
  } else {
    // Activate and deactivate others
    deactivateExclusiveButtons('forward');
    state.forward = true;
  }
  res.json(state);
});

/**
 * Endpoint: POST /backwards
 * Toggles the 'backwards' button. Ensures mutual exclusivity.
 */
app.post('/backwards', (req, res) => {
  if (state.backwards) {
    // Deactivate if already active
    state.backwards = false;
  } else {
    // Activate and deactivate others
    deactivateExclusiveButtons('backwards');
    state.backwards = true;
  }
  res.json(state);
});

/**
 * Endpoint: POST /arm
 * Toggles the 'arm' button. Ensures mutual exclusivity.
 */
app.post('/arm', (req, res) => {
  if (state.arm) {
    // Deactivate if already active
    state.arm = false;
  } else {
    // Activate and deactivate others
    deactivateExclusiveButtons('arm');
    state.arm = true;
  }
  res.json(state);
});

/**
 * Endpoint: POST /angle
 * Toggles an individual angle button.
 * Expects a JSON body with 'angle': number (e.g., 10, -45).
 */
app.post('/angle', (req, res) => {
  const { angle } = req.body;

  // Validate that angle is provided and is a number
  if (angle === undefined || typeof angle !== 'number') {
    return res.status(400).json({ error: 'Angle must be a number.' });
  }

  // Define valid angles
  const validAngles = [10, 45, 90, -10, -45, -90];

  if (!validAngles.includes(angle)) {
    return res.status(400).json({ error: 'Invalid angle value.' });
  }

  // Toggle the specific angle state
  state[angle] = !state[angle];

  res.json(state);
});

/**
 * Endpoint: POST /fire
 * Activates the 'fire' button for 2 seconds.
 */
app.post('/fire', (req, res) => {
  if (!state.fire) {
    state.fire = true;
    // Reset after 2 seconds
    setTimeout(() => {
      state.fire = false;
    }, 2000);
  }
  res.json(state);
});

/**
 * Endpoint: POST /1footup
 * Activates the '1footup' button for 2 seconds.
 */
app.post('/1footup', (req, res) => {
  if (!state['1footup']) {
    state['1footup'] = true;
    // Reset after 2 seconds
    setTimeout(() => {
      state['1footup'] = false;
    }, 2000);
  }
  res.json(state);
});

/**
 * Endpoint: POST /1footdown
 * Activates the '1footdown' button for 2 seconds.
 */
app.post('/1footdown', (req, res) => {
  if (!state['1footdown']) {
    state['1footdown'] = true;
    // Reset after 2 seconds
    setTimeout(() => {
      state['1footdown'] = false;
    }, 2000);
  }
  res.json(state);
});

/**
 * Endpoint: GET /state
 * Returns the current state of all buttons.
 */
app.get('/state', (req, res) => {
  res.json(state);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
