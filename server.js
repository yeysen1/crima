const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/*
  State includes:
  - up, down, left, right: arrow booleans from old frontend (/update)
  - angle: main angle from old frontend (/slider)
  - angle2: second angle from old frontend (/slider2)
  - fire: indicates if FIRE was pressed (2s)
  - arm: toggle button from new frontend
  - forward, backwards: toggle buttons from new frontend
  - 1footup, 1footdown: momentary buttons from new frontend
  - 10, 45, 90, -10, -45, -90: angle buttons from new frontend
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
  '1footdown': false,
  '10': false,
  '45': false,
  '90': false,
  '-10': false,
  '-45': false,
  '-90': false
};

function deactivateExclusiveButtons(except) {
  const toggles = ['forward', 'backwards', 'arm'];
  toggles.forEach(toggle => {
    if (toggle !== except) {
      state[toggle] = false;
    }
  });
}

// Old frontend endpoints
app.post('/update', (req, res) => {
  const { direction } = req.body;
  const valid = ['up', 'down', 'left', 'right'];
  if (!valid.includes(direction)) {
    return res.status(400).json({ error: 'Invalid direction' });
  }
  state.up = false;
  state.down = false;
  state.left = false;
  state.right = false;
  state[direction] = true;
  setTimeout(() => {
    state[direction] = false;
  }, 2000);
  res.json(state);
});

app.post('/slider', (req, res) => {
  const { angle } = req.body;
  const num = parseInt(angle, 10);
  if (isNaN(num) || num < 0 || num > 90) {
    return res.status(400).json({ error: 'Angle must be 0–90.' });
  }
  state.angle = num;
  res.json(state);
});

app.post('/slider2', (req, res) => {
  const { angle2 } = req.body;
  const num2 = parseInt(angle2, 10);
  if (isNaN(num2) || num2 < 0 || num2 > 90) {
    return res.status(400).json({ error: 'Angle2 must be 0–90.' });
  }
  state.angle2 = num2;
  res.json(state);
});

app.post('/fire', (req, res) => {
  state.fire = true;
  setTimeout(() => {
    state.fire = false;
  }, 2000);
  res.json(state);
});

// New frontend endpoints
app.post('/forward', (req, res) => {
  if (state.forward) {
    state.forward = false;
  } else {
    deactivateExclusiveButtons('forward');
    state.forward = true;
  }
  res.json(state);
});

app.post('/backwards', (req, res) => {
  if (state.backwards) {
    state.backwards = false;
  } else {
    deactivateExclusiveButtons('backwards');
    state.backwards = true;
  }
  res.json(state);
});

app.post('/arm', (req, res) => {
  if (state.arm) {
    state.arm = false;
  } else {
    deactivateExclusiveButtons('arm');
    state.arm = true;
  }
  res.json(state);
});

app.post('/1footup', (req, res) => {
  if (!state['1footup']) {
    state['1footup'] = true;
    setTimeout(() => {
      state['1footup'] = false;
    }, 2000);
  }
  res.json(state);
});

app.post('/1footdown', (req, res) => {
  if (!state['1footdown']) {
    state['1footdown'] = true;
    setTimeout(() => {
      state['1footdown'] = false;
    }, 2000);
  }
  res.json(state);
});

app.post('/angle', (req, res) => {
  const { angle } = req.body;
  const numAngle = parseInt(angle, 10);
  const validAngles = [10, 45, 90, -10, -45, -90];

  if (isNaN(numAngle) || !validAngles.includes(numAngle)) {
    return res.status(400).json({ error: 'Invalid angle value.' });
  }

  state[angle] = !state[angle];
  res.json(state);
});

// State endpoint
app.get('/state', (req, res) => {
  res.json(state);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
