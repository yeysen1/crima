const express = require('express');
const path = require('path');

const app = express();

// In-memory state object
let state = {
  up: false,
  down: false,
  left: false,
  right: false
};

app.use(express.json());

// Serve all files in the "public" folder as static assets
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to update the state
app.post('/update', (req, res) => {
  const { direction } = req.body;
  if (direction in state) {
    state[direction] = true;
    return res.json(state);
  } else {
    return res.status(400).json({ error: 'Invalid direction' });
  }
});

// Use either the PORT provided by the environment or 3000 as a fallback
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
