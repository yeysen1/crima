
const express = require('express');
const path = require('path');

const app = express();

/*
  State includes:
  - up, down, left, right: arrow booleans
  - angle: first slider (0–90)
  - angle2: second slider (0–90)
  - fire: indicates if FIRE was pressed (2s)
*/
let state = {
  up: false,
  down: false,
  left: false,
  right: false,
  angle: 0,
  angle2: 0,
  fire: false
};

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// POST /update: set one direction to true for 2 seconds
app.post('/update', (req, res) => {
  const { direction } = req.body;
  if (!Object.hasOwn(state, direction)) {
    return res.status(400).json({ error: 'Invalid direction' });
  }

  // Reset all arrow states
  state.up = false;
  state.down = false;
  state.left = false;
  state.right = false;

  // Set the chosen direction to true
  state[direction] = true;

  // Reset after 2 seconds
  setTimeout(() => {
    state[direction] = false;
  }, 2000);

  res.json(state);
});

// POST /slider: update the main angle
app.post('/slider', (req, res) => {
  const { angle } = req.body;
  const numAngle = parseInt(angle, 10);

  if (isNaN(numAngle) || numAngle < 0 || numAngle > 90) {
    return res.status(400).json({ error: 'Angle must be 0–90.' });
  }
  state.angle = numAngle;
  res.json(state);
});

// POST /slider2: update the second slider (angle2)
app.post('/slider2', (req, res) => {
  const { angle2 } = req.body;
  const numAngle2 = parseInt(angle2, 10);

  if (isNaN(numAngle2) || numAngle2 < 0 || numAngle2 > 90) {
    return res.status(400).json({ error: 'Angle2 must be 0–90.' });
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

// GET /state: returns the entire JSON state
app.get('/state', (req, res) => {
  res.json(state);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
