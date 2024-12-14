<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Arrow Control with Dual Sliders + Fire</title>
<style>
  body {
    margin: 0;
    font-family: sans-serif;
    background: url('slh.png') no-repeat center center;
    background-size: cover;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    height: 100vh;
    color: #fff;
  }

  .header {
    margin-top: 20px;
    font-size: 24px;
    font-weight: bold;
    text-shadow: 1px 1px 3px #000;
  }

  .container {
    position: relative;
    width: 200px;
    height: 200px;
    margin-top: 40px;
  }

  .arrow-button {
    position: absolute;
    width: 50px;
    height: 50px;
    font-size: 24px;
    text-align: center;
    line-height: 50px;
    background: rgba(255,255,255,0.8);
    color: #333;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
  }

  .arrow-button:hover {
    background-color: #ddd;
  }

  .arrow-up {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .arrow-down {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .arrow-left {
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .arrow-right {
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  /* Fire button in the center of the container */
  .fire-button {
    position: absolute;
    width: 80px;
    height: 50px;
    font-size: 20px;
    text-align: center;
    line-height: 50px;
    background: red;
    color: #fff;
    border: 2px solid #fff;
    border-radius: 5px;
    cursor: pointer;

    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .fire-button:hover {
    background-color: #f33;
  }

  .status {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: bold;
    color: #fff;
    text-shadow: 1px 1px 3px #000;
  }

  .slider-container {
    margin-top: 50px;
    position: relative;
    width: 200px;
    height: 100px;
  }

  /* First slider: half-circle (0–90) horizontally */
  .half-circle-slider {
    width: 100%;
    margin: 0;
    appearance: none;
    position: absolute;
    bottom: 0;
    left: 0;
    transform-origin: center;
    transform: rotate(-180deg);
  }
  .half-circle-slider:focus {
    outline: none;
  }
  .half-circle-slider::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    background: #fff;
    border: 2px solid #333;
    border-radius: 50%;
    cursor: pointer;
  }
  .half-circle-slider::-webkit-slider-runnable-track {
    height: 5px;
    background: rgba(255,255,255,0.8);
    border-radius: 5px;
  }

  /* Second slider: vertical on the side */
  .vertical-slider-container {
    position: absolute;
    right: -60px; /* shift it to the side */
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    height: 200px;
  }
  .vertical-slider {
    writing-mode: bt-lr; /* vertical slider trick */
    transform: rotate(-90deg); 
    width: 200px;
    margin: 0;
    appearance: none;
    position: absolute;
    top: 75px;
    left: -75px;
  }
  .vertical-slider:focus {
    outline: none;
  }
  .vertical-slider::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    background: #fff;
    border: 2px solid #333;
    border-radius: 50%;
    cursor: pointer;
  }
  .vertical-slider::-webkit-slider-runnable-track {
    height: 5px;
    background: rgba(255,255,255,0.8);
    border-radius: 5px;
  }

  /* Display second slider's value near the top as well */
  .header2 {
    margin-top: 10px;
    font-size: 24px;
    font-weight: bold;
    text-shadow: 1px 1px 3px #000;
  }
</style>
</head>
<body>
  <!-- Display the values of the two sliders -->
  <div class="header" id="sliderValueDisplay">Angle 1: 0°</div>
  <div class="header2" id="sliderValueDisplay2">Angle 2: 0°</div>

  <div class="container">
    <div class="arrow-button arrow-up" data-direction="up">↑</div>
    <div class="arrow-button arrow-down" data-direction="down">↓</div>
    <div class="arrow-button arrow-left" data-direction="left">←</div>
    <div class="arrow-button arrow-right" data-direction="right">→</div>

    <!-- Fire button in the center, colored red -->
    <div class="fire-button" id="fireButton">FIRE</div>
    
    <div class="status">Ready</div>

    <!-- Second slider container stuck to the right side of the container -->
    <div class="vertical-slider-container">
      <input
        type="range"
        class="vertical-slider"
        min="0"
        max="90"
        value="0"
        id="sideSlider"
      />
    </div>
  </div>

  <!-- Horizontal half-circle slider -->
  <div class="slider-container">
    <input
      type="range"
      class="half-circle-slider"
      min="0"
      max="90"
      value="0"
      id="halfCircleSlider"
    />
  </div>

<script>
  const statusDiv = document.querySelector('.status');
  const slider1 = document.getElementById('halfCircleSlider');
  const slider2 = document.getElementById('sideSlider');
  const sliderValueDisplay = document.getElementById('sliderValueDisplay');
  const sliderValueDisplay2 = document.getElementById('sliderValueDisplay2');
  const fireButton = document.getElementById('fireButton');

  // Handle arrow button clicks
  document.querySelectorAll('.arrow-button').forEach(button => {
    button.addEventListener('click', async () => {
      const direction = button.getAttribute('data-direction');
      statusDiv.textContent = 'Updating...';
      try {
        const res = await fetch('/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ direction })
        });
        const data = await res.json();
        statusDiv.textContent = `${direction} = ${data[direction]}`;
      } catch (e) {
        console.error(e);
        statusDiv.textContent = 'Error';
      }
    });
  });

  // First slider (horizontal half-circle)
  slider1.addEventListener('input', async () => {
    sliderValueDisplay.textContent = `Angle 1: ${slider1.value}°`;
    try {
      const res = await fetch('/slider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ angle: slider1.value })
      });
      const data = await res.json();
      console.log('State after slider1 update:', data);
    } catch (err) {
      console.error(err);
    }
  });

  // Second slider (vertical)
  slider2.addEventListener('input', async () => {
    sliderValueDisplay2.textContent = `Angle 2: ${slider2.value}°`;
    try {
      const res = await fetch('/slider2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ angle2: slider2.value })
      });
      const data = await res.json();
      console.log('State after slider2 update:', data);
    } catch (err) {
      console.error(err);
    }
  });

  // Fire button
  fireButton.addEventListener('click', async () => {
    statusDiv.textContent = 'Firing...';
    try {
      const res = await fetch('/fire', {
        method: 'POST'
      });
      const data = await res.json();
      console.log('State after fire:', data);
      statusDiv.textContent = `FIRE = ${data.fire}`;
    } catch (err) {
      console.error(err);
      statusDiv.textContent = 'Error';
    }
  });
</script>
</body>
</html>
