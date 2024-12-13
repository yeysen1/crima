const express = require('express');
const path = require('path');

const app = express();

// Initial state: all directions are false
let state = {
  up: false,
  down: false,
  left: false,
  right: false
};

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// When we update the state, we reset everything to false first,
// then set the requested direction to true.
app.post('/update', (req, res) => {
  const { direction } = req.body;

  // Reset all directions to false
  state = {
    up: false,
    down: false,
    left: false,
    right: false
  };

  // If the direction is valid, set it to true
  if (state.hasOwnProperty(direction)) {
    state[direction] = true;
    res.json(state);
  } else {
    res.status(400).json({ error: 'Invalid direction' });
  }
});

// A GET endpoint to view the current state
app.get('/state', (req, res) => {
  // Respond with the current state as JSON
  res.json(state);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
