const express = require('express');
const path = require('path');

const app = express();

/*
  State includes:
  - up, down, left, right: arrow booleans
  - angle: first angle (0–90)
  - angle2: second angle (0–90)
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
  angle: 0,
  angle2: 0,
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

// POST /slider: update the first angle
app.post('/slider', (req, res) => {
  const { angle } = req.body;
  const numAngle = parseInt(angle, 10);

  if (isNaN(numAngle) || numAngle < 0 || numAngle > 90) {
    return res.status(400).json({ error: 'Angle must be between 0–90.' });
  }
  state.angle = numAngle;
  res.json(state);
});

// POST /slider2: update the second angle (angle2)
app.post('/slider2', (req, res) => {
  const { angle2 } = req.body;
  const numAngle2 = parseInt(angle2, 10);

  if (isNaN(numAngle2) || numAngle2 < 0 || numAngle2 > 90) {
    return res.status(400).json({ error: 'Angle2 must be between 0–90.' });
  }
  state.angle2 = numAngle2;
  res.json(state);
});

// POST /fire: set fire = true for 2 seconds
app.post('/fire', (req, res) => {
  state.fire = true;
  setTimeout(() => {
    state.fire = false;
  }, 2000);
  res.json(state);
});

// POST /1footup: set 1footup = true for 2 seconds
app.post('/1footup', (req, res) => {
  state['1footup'] = true;
  setTimeout(() => {
    state['1footup'] = false;
  }, 2000);
  res.json(state);
});

// POST /1footdown: set 1footdown = true for 2 seconds
app.post('/1footdown', (req, res) => {
  state['1footdown'] = true;
  setTimeout(() => {
    state['1footdown'] = false;
  }, 2000);
  res.json(state);
});

// GET /state: returns the entire JSON state
app.get('/state', (req, res) => {
  res.json(state);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
