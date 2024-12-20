const express = require('express');
const path = require('path');

const app = express();

/*
  State includes:
  - up, down, left, right: arrow booleans
  - 10, 45, 90: positive angles (0–90)
  - -10, -45, -90: negative angles (-10 to -90)
  - fire: indicates if FIRE was pressed (2s)
  - arm: indicates if ARM was pressed (toggle)
  - forward: indicates if FORWARD was pressed (toggle)
  - backwards: indicates if BACKWARDS was pressed (toggle)
  - 1footup: indicates if 1 Foot Up was pressed (2s)
  - 1footdown: indicates if 1 Foot Down was pressed (2s)
*/
let state = {
  up: false,
  down: false,
  left: false,
  right: false,
  '10': false,
  '45': false,
  '90': false,
  '-10': false,
  '-45': false,
  '-90': false,
  fire: false,
  arm: false,
  forward: false,
  backwards: false,
  '1footup': false,
  '1footdown': false
};

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to deactivate mutually exclusive toggle buttons
function deactivateExclusiveButtons(except) {
  if (except !== 'forward') state.forward = false;
  if (except !== 'backwards') state.backwards = false;
  if (except !== 'arm') state.arm = false;
}

// POST /forward: Toggle Forward
app.post('/forward', (req, res) => {
  if (state.forward) {
    // If already active, deactivate
    state.forward = false;
  } else {
    // Activate Forward and deactivate others
    deactivateExclusiveButtons('forward');
    state.forward = true;
  }
  res.json(state);
});

// POST /backwards: Toggle Backwards
app.post('/backwards', (req, res) => {
  if (state.backwards) {
    // If already active, deactivate
    state.backwards = false;
  } else {
    // Activate Backwards and deactivate others
    deactivateExclusiveButtons('backwards');
    state.backwards = true;
  }
  res.json(state);
});

// POST /arm: Toggle ARM
app.post('/arm', (req, res) => {
  if (state.arm) {
    // If already active, deactivate
    state.arm = false;
  } else {
    // Activate ARM and deactivate others
    deactivateExclusiveButtons('arm');
    state.arm = true;
  }
  res.json(state);
});

// POST /angle: Handle angle button clicks (toggle)
app.post('/angle', (req, res) => {
  const { angle } = req.body;
  const numAngle = parseInt(angle, 10);

  // Validate angle
  const validAngles = [10, 45, 90, -10, -45, -90];
  if (!validAngles.includes(numAngle)) {
    return res.status(400).json({ error: 'Invalid angle value.' });
  }

  // Toggle the corresponding angle state
  state[angle] = true;

  setTimeout(() => {
    state[angle]= false;
  }, 2000);

  res.json(state);
});

// POST /fire: set fire = true for 2 seconds
app.post('/fire', (req, res) => {
  if (!state.fire) {
    state.fire = true;
    setTimeout(() => {
      state.fire = false;
    }, 2000);
  }
  res.json(state);
});

// POST /1footup: set 1footup = true for 2 seconds
app.post('/1footup', (req, res) => {
  if (!state['1footup']) {
    state['1footup'] = true;
    setTimeout(() => {
      state['1footup'] = false;
    }, 2000);
  }
  res.json(state);
});

// POST /1footdown: set 1footdown = true for 2 seconds
app.post('/1footdown', (req, res) => {
  if (!state['1footdown']) {
    state['1footdown'] = true;
    setTimeout(() => {
      state['1footdown'] = false;
    }, 2000);
  }
  res.json(state);
});

// GET /state: returns the entire JSON state
app.get('/state', (req, res) => {
  res.json(state);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

