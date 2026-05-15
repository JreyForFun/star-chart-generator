// =============================================================
// STAR CHART — script.js
// Read each TODO, understand it, then type the code below it.
// Work top to bottom. Each TODO builds on the last.
// =============================================================


// -------------------------------------------------------------
// TODO 1 — Canvas setup
// WHAT:  Get the canvas by id, get its 2D context,
//        set its width and height to fill the browser window.
// HOW:
//   document.getElementById('star-canvas')
//   canvas.getContext('2d')
//   window.innerWidth / window.innerHeight
// -------------------------------------------------------------

// your code here


// -------------------------------------------------------------
// TODO 2 — Grab UI elements + declare global state
// WHAT:  Get these four elements by id:
//          'tooltip', 'tooltip-name', 'tooltip-mag', 'star-count'
//        Then declare with let:
//          stars          → empty array []
//          constellations → empty array []
//          mouse          → object { x: 0, y: 0 }
// -------------------------------------------------------------

// your code here


// -------------------------------------------------------------
// TODO 3 — Load the JSON data with fetch()
//
// WHAT:  fetch() requests a file from the server.
//        It is ASYNCHRONOUS — it takes time, so we use async/await
//        to pause and wait for the result before continuing.
//
// HOW:
//   async function loadData() {
//       const response = await fetch('stars.json')
//       const data     = await response.json()
//       stars          = data.stars
//       constellations = data.constellations
//       starCount.innerText = `${stars.length} stars loaded`
//       draw()
//       animate()
//   }
//
// WHY two awaits:
//   fetch() → waits for the server to respond (gives you a Response)
//   .json() → waits to read and parse the body (gives you the object)
//
// NOTE:  async goes before function. await only works inside async.
// -------------------------------------------------------------

async function loadData() {
    // your code here
}


// -------------------------------------------------------------
// TODO 4 — Draw the background gradient
//
// WHAT:  Fill the canvas with a dark radial gradient —
//        slightly lighter in the center (deep space glow).
//
// HOW:
//   const cx   = canvas.width / 2
//   const cy   = canvas.height / 2
//   const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width)
//   grad.addColorStop(0, '#0a0f1e')   ← inner color
//   grad.addColorStop(1, '#000000')   ← outer color
//   ctx.fillStyle = grad
//   ctx.fillRect(0, 0, canvas.width, canvas.height)
//
// createRadialGradient(x0, y0, r0, x1, y1, r1)
//   x0,y0,r0 = inner circle center + radius
//   x1,y1,r1 = outer circle center + radius
// -------------------------------------------------------------

function drawBackground() {
    // your code here
}


// -------------------------------------------------------------
// TODO 5 — Draw constellation lines
//
// WHAT:  Each constellation has a lines array of [idA, idB] pairs.
//        Find those two stars and draw a line between them.
//
// HOW:
//   constellations.forEach(constellation => {
//       ctx.strokeStyle = constellation.color
//       ctx.lineWidth   = 0.5
//
//       constellation.lines.forEach(pair => {
//           const starA = stars.find(s => s.id === pair[0])
//           const starB = stars.find(s => s.id === pair[1])
//
//           // Star positions are 0–1 fractions. Multiply by
//           // canvas size to get real pixel coordinates.
//           const ax = starA.x * canvas.width
//           const ay = starA.y * canvas.height
//           const bx = starB.x * canvas.width
//           const by = starB.y * canvas.height
//
//           ctx.beginPath()
//           ctx.moveTo(ax, ay)
//           ctx.lineTo(bx, by)
//           ctx.stroke()
//       })
//   })
//
// NEW METHOD — Array.find():
//   stars.find(s => s.id === 3)
//   Loops through stars, returns the FIRST one where s.id === 3.
//   Returns undefined if nothing matches.
// -------------------------------------------------------------

function drawConstellationLines() {
    // your code here
}


// -------------------------------------------------------------
// TODO 6 — Draw the stars
//
// WHAT:  Loop through stars. Draw a glowing circle for each.
//        Use magnitude to calculate the radius.
//
// MAGNITUDE NOTE:
//   In astronomy, LOWER magnitude = BRIGHTER star.
//   Sirius = -1.4 (very bright). Dim stars = 3 or 4.
//   We flip it for radius: radius = 4 - magnitude
//   So Sirius gets radius ~5.4, a dim star gets ~1.
//   Math.max(1, ...) ensures radius never goes below 1.
//
// TWINKLE:
//   Math.sin() returns a value smoothly cycling -1 to 1.
//   Date.now() gives milliseconds since Jan 1 1970.
//   Dividing by 1000 converts to seconds.
//   + star.id offsets each star so they don't all pulse together.
//
// HOW per star:
//   const px      = star.x * canvas.width
//   const py      = star.y * canvas.height
//   const time    = Date.now() / 1000
//   const twinkle = Math.sin(time * 3 + star.id) * 0.4
//   const radius  = Math.max(1, (4 - star.magnitude) + twinkle)
//
//   ctx.shadowBlur  = radius * 6
//   ctx.shadowColor = '#aaccff'
//   ctx.fillStyle   = '#ffffff'
//   ctx.beginPath()
//   ctx.arc(px, py, radius, 0, Math.PI * 2)
//   ctx.fill()
//   ctx.shadowBlur = 0    ← ALWAYS reset or glow bleeds into next draws
// -------------------------------------------------------------

function drawStars() {
    // your code here
}


// -------------------------------------------------------------
// TODO 7 — Draw constellation name labels
//
// WHAT:  For each constellation, find its first star and draw
//        the constellation's name near it using ctx.fillText().
//
// HOW:
//   ctx.font      = '11px Georgia'
//   ctx.fillStyle = 'rgba(180, 200, 255, 0.5)'
//
//   constellations.forEach(constellation => {
//       const firstStarId = constellation.lines[0][0]
//       const star        = stars.find(s => s.id === firstStarId)
//       const px          = star.x * canvas.width
//       const py          = star.y * canvas.height
//       ctx.fillText(constellation.name, px + 10, py - 10)
//   })
//
// ctx.fillText(text, x, y)
//   Draws text at position x, y.
//   +10, -10 offsets so the label doesn't overlap the star dot.
// -------------------------------------------------------------

function drawLabels() {
    // your code here
}


// -------------------------------------------------------------
// TODO 8 — Hover detection
//
// WHAT:  Each frame, check if mouse is within 12px of any star.
//        If yes → show tooltip, update its text, move it near the cursor.
//        If no  → hide tooltip.
//
// HOW:
//   function checkHover() {
//       let found = false
//
//       stars.forEach(star => {
//           const px   = star.x * canvas.width
//           const py   = star.y * canvas.height
//           const dx   = mouse.x - px
//           const dy   = mouse.y - py
//           const dist = Math.sqrt(dx * dx + dy * dy)
//
//           if (dist < 12) {
//               found = true
//               tooltip.classList.remove('hidden')
//               tooltip.style.left    = (mouse.x + 16) + 'px'
//               tooltip.style.top     = (mouse.y - 10) + 'px'
//               tooltipName.innerText = star.name
//               tooltipMag.innerText  = `Magnitude: ${star.magnitude}`
//           }
//       })
//
//       if (!found) tooltip.classList.add('hidden')
//   }
//
// THEN add a 'mousemove' listener on window:
//   - update mouse.x = e.clientX and mouse.y = e.clientY
//   - call checkHover()
// -------------------------------------------------------------

function checkHover() {
    // your code here
}

// mousemove listener — your code here


// -------------------------------------------------------------
// TODO 9 — Main draw function
//
// WHAT:  One function that calls all drawing functions in order.
//        Order matters: background → lines → stars → labels.
//        (Each layer paints on top of the previous one.)
// -------------------------------------------------------------

function draw() {
    // your code here
}


// -------------------------------------------------------------
// TODO 10 — Animation loop
//
// WHAT:  Call draw() then schedule the next frame.
//        requestAnimationFrame runs your function ~60x per second
//        and pauses automatically when the tab is hidden.
// HOW:
//   function animate() {
//       draw()
//       requestAnimationFrame(animate)
//   }
// -------------------------------------------------------------

function animate() {
    // your code here
}


// -------------------------------------------------------------
// TODO 11 — Resize handler
//
// WHAT:  When the window resizes, update canvas dimensions
//        then redraw immediately.
// HOW:   window.addEventListener('resize', () => { ... })
//        Inside: set canvas.width and canvas.height, then call draw()
// NOTE:  Setting canvas.width always clears the canvas — draw()
//        immediately repaints it at the new size.
// -------------------------------------------------------------

// your code here


// -------------------------------------------------------------
// TODO 12 — Kick everything off
//
// WHAT:  Call loadData() here at the bottom.
//        This starts the fetch, then after the data loads it
//        calls draw() and animate() automatically.
// -------------------------------------------------------------

// your code here
