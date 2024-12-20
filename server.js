<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Control Panel</title>
  <style>
    body {
      margin: 0;
      font-family: sans-serif;
      background: url('slh.png') no-repeat center center;
      background-size: cover;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      color: #fff;
      position: relative;
    }

    .container {
      position: relative;
      width: 700px;
      height: 700px;
    }

    .angle-buttons.left {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .angle-buttons.right {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .angle-button {
      width: 80px;
      height: 50px;
      font-size: 18px;
      text-align: center;
      line-height: 50px;
      background: rgba(255,255,255,0.8);
      color: #333;
      border: 1px solid #ccc;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      user-select: none;
    }

    .central-buttons {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .central-row {
      display: flex;
      gap: 20px;
    }

    .central-button {
      width: 140px;
      height: 50px;
      font-size: 18px;
      text-align: center;
      line-height: 50px;
      background: rgba(255,255,255,0.8);
      color: #333;
      border: 1px solid #ccc;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      user-select: none;
    }

    .arm-button, .fire-button {
      width: 120px;
      height: 50px;
      font-size: 18px;
      text-align: center;
      line-height: 50px;
      background: red;
      color: #fff;
      border: 2px solid #fff;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      user-select: none;
    }

    .arm-button {
      background: orange;
    }

    .arm-button:hover {
      background-color: #e68a00;
    }

    .fire-button:hover {
      background-color: #ff3333;
    }

    .json-display {
      position: absolute;
      bottom: 20px;
      left: 20px;
      background: rgba(0,0,0,0.7);
      color: #0f0;
      padding: 10px;
      border-radius: 5px;
      max-width: 300px;
      max-height: 200px;
      overflow: auto;
      font-family: monospace;
      font-size: 14px;
    }

    .angle-button.active,
    .central-button.active,
    .arm-button.active,
    .fire-button.active {
      background-color: #4CAF50; /* Green */
      color: #fff;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Left Positive Angles -->
    <div class="angle-buttons left">
      <div class="angle-button" data-angle="10">10°</div>
      <div class="angle-button" data-angle="45">45°</div>
      <div class="angle-button" data-angle="90">90°</div>
    </div>

    <!-- Right Negative Angles -->
    <div class="angle-buttons right">
      <div class="angle-button" data-angle="-10">-10°</div>
      <div class="angle-button" data-angle="-45">-45°</div>
      <div class="angle-button" data-angle="-90">-90°</div>
    </div>

    <!-- Central Buttons -->
    <div class="central-buttons">
      <div class="central-button" data-action="1footup">1 Foot Up</div>

      <div class="central-row">
        <div class="central-button" data-action="forward">Forward</div>
        <div class="arm-button" id="armButton">ARM</div>
      </div>

      <div class="central-button" data-action="backwards">Backwards</div>

      <div class="central-row">
        <div class="central-button" data-action="1footdown">1 Foot Down</div>
        <div class="fire-button" id="fireButton">FIRE</div>
      </div>
    </div>
  </div>

  <!-- JSON State Display -->
  <div class="json-display" id="jsonDisplay">Loading state...</div>

  <script>
    const jsonDisplay = document.getElementById('jsonDisplay');
    const armButton = document.getElementById('armButton');
    const fireButton = document.getElementById('fireButton');
    const angleButtons = document.querySelectorAll('.angle-button');
    const centralButtons = document.querySelectorAll('.central-button');

    // Function to fetch and display the current state
    async function fetchState() {
      try {
        const res = await fetch('/state');
        const data = await res.json();
        jsonDisplay.textContent = JSON.stringify(data, null, 2);

        // Update angle buttons
        angleButtons.forEach(button => {
          const angle = button.getAttribute('data-angle');
          if (data[angle]) {
            button.classList.add('active');
          } else {
            button.classList.remove('active');
          }
        });

        // Update central buttons (forward, backwards, 1footup, 1footdown)
        centralButtons.forEach(button => {
          const action = button.getAttribute('data-action');
          if (data[action]) {
            button.classList.add('active');
          } else {
            button.classList.remove('active');
          }
        });

        // Update ARM
        if (data.arm) {
          armButton.classList.add('active');
        } else {
          armButton.classList.remove('active');
        }

        // Update FIRE
        if (data.fire) {
          fireButton.classList.add('active');
        } else {
          fireButton.classList.remove('active');
        }

      } catch (err) {
        jsonDisplay.textContent = 'Error fetching state';
        console.error(err);
      }
    }

    // Initial fetch and set interval to update state every second
    fetchState();
    setInterval(fetchState, 1000);

    // Angle Buttons - Toggle state immediately on success
    angleButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const angle = button.getAttribute('data-angle');
        try {
          const res = await fetch('/angle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ angle: parseInt(angle, 10) })
          });
          if (res.ok) {
            // Immediate feedback: toggle class
            // Since these are toggles, we can just toggle class
            button.classList.toggle('active');
          }
        } catch (err) {
          console.error(err);
        }
      });
    });

    // Central Buttons
    centralButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const action = button.getAttribute('data-action');
        try {
          const res = await fetch(`/${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action })
          });
          if (res.ok) {
            const data = await res.json();
            // Immediate feedback for momentary buttons
            // For 1footup, 1footdown: turn green immediately
            if (action === '1footup' || action === '1footdown') {
              button.classList.add('active');
              // They will revert after 2s from backend and fetchState will correct it.
            }
            // Forward and Backwards are toggles handled by backend mutual exclusivity.
            // fetchState will update them shortly, so no immediate toggle needed.
          }
        } catch (err) {
          console.error(err);
        }
      });
    });

    // ARM Button
    armButton.addEventListener('click', async () => {
      try {
        const res = await fetch('/arm', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          // Immediate feedback for ARM toggle
          if (data.arm) {
            armButton.classList.add('active');
          } else {
            armButton.classList.remove('active');
          }
        }
      } catch (err) {
        console.error(err);
      }
    });

    // FIRE Button - momentary
    fireButton.addEventListener('click', async () => {
      try {
        const res = await fetch('/fire', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          // Immediate feedback
          fireButton.classList.add('active');
          // Will revert after 2 seconds from backend and fetchState will update.
        }
      } catch (err) {
        console.error(err);
      }
    });
  </script>
</body>
</html>
