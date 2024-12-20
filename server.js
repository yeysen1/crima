const express = require('express');
const path = require('path');

const app = express();

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

function deactivateExclusiveButtons(except) {
    if (except !== 'forward') state.forward = false;
    if (except !== 'backwards') state.backwards = false;
    if (except !== 'arm') state.arm = false;
}

function handleMomentaryAction(action) {
    if (!state[action]) {
        state[action] = true;
        setTimeout(() => {
            state[action] = false;
        }, 2000);
    }
}

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

app.post('/angle', (req, res) => {
    const { angle } = req.body;
    const numAngle = parseInt(angle, 10);

    const validAngles = [10, 45, 90, -10, -45, -90];
    if (!validAngles.includes(numAngle)) {
        return res.status(400).json({ error: 'Invalid angle value.' });
    }

    handleMomentaryAction(angle);
    res.json(state);
});

app.post('/fire', (req, res) => {
    handleMomentaryAction('fire');
    res.json(state);
});

app.post('/1footup', (req, res) => {
    handleMomentaryAction('1footup');
    res.json(state);
});

app.post('/1footdown', (req, res) => {
    handleMomentaryAction('1footdown');
    res.json(state);
});

app.get('/state', (req, res) => {
    res.json(state);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
