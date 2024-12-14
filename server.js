const express = require('express');
const path = require('path');

const app = express();

/*
    State includes:
    - up, down, left, right: arrow states
    - angle: first slider value (0–90)
    - angle2: second slider value (example: 0–90, or 0–100—up to you)
    - fire: indicates if "fire" was pressed (auto-resets to false after 1s)
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

// POST /update: set one direction true for 1 second
app.post('/update', (req, res) => {
  const { direction } = req.body;

  if (!Object.hasOwn(state, direction)) {
    return res.status(400).json({ error: 'Invalid direction' });
  }

  // Reset all arrows to false (and possibly fire too, but let's keep "fire" separate)
  state.up = false;
  state.down = false;
  state.left = false;
  state.right = false;

  // Set the chosen direction to true
  state[direction] = true;

  // Auto-reset after 1 second
  setTimeout(() => {
    state[direction] = false;
  }, 1000);

  return res.json(state);
});

// POST /slider: update the main angle
app.post('/slider', (req, res) => {
  const { angle } = req.body;
  const numAngle = parseInt(angle, 10);

  if (isNaN(numAngle) || numAngle < 0 || numAngle > 90) {
    return res.status(400).json({ error: 'Angle must be between 0 and 90.' });
  }

  state.angle = numAngle;
  res.json(state);
});

// POST /slider2: update the second slider (angle2)
app.post('/slider2', (req, res) => {
  const { angle2 } = req.body;
  const numAngle2 = parseInt(angle2, 10);

  // You can choose any range you like. Let’s say 0–90 as well.
  if (isNaN(numAngle2) || numAngle2 < 0 || numAngle2 > 90) {
    return res.status(400).json({ error: 'Angle2 must be between 0 and 90.' });
  }

  state.angle2 = numAngle2;
  res.json(state);
});

// POST /fire: sets fire to true for 1 second
app.post('/fire', (req, res) => {
  state.fire = true;
  setTimeout(() => {
    state.fire = false;
  }, 1000);
  return res.json(state);
});

// GET /state: returns the entire JSON state
app.get('/state', (req, res) => {
  res.json(state);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
