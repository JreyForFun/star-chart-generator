# Star Chart — Complete Learning Guide

> How to use this: Read a section, then find where it's used in the code.
> Don't memorize — understand. Then close the guide and type it yourself.

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [HTML](#2-html)
3. [CSS](#3-css)
4. [JavaScript — The Basics Used Here](#4-javascript--the-basics-used-here)
5. [JavaScript — The Canvas API](#5-javascript--the-canvas-api)
6. [JavaScript — fetch() and async/await](#6-javascript--fetch-and-asyncawait)
7. [JavaScript — The Animation Loop](#7-javascript--the-animation-loop)
8. [JavaScript — Math Methods](#8-javascript--math-methods)
9. [JavaScript — Array Methods](#9-javascript--array-methods)
10. [How to Run the Project](#10-how-to-run-the-project)
11. [What to Try Next](#11-what-to-try-next)

---

## 1. Project Structure

```
star-chart/
├── complete/         ← reference — look here if totally stuck
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── stars.json
└── todo/             ← your workspace — work here
    ├── index.html
    ├── style.css
    ├── script.js
    └── stars.json    ← same file, already filled in (it's just data)
```

**Three languages, one job each:**

| File | Language | Job |
|------|----------|-----|
| `index.html` | HTML | Defines the elements on the page |
| `style.css` | CSS | Controls how those elements look |
| `script.js` | JavaScript | Controls what the elements do |
| `stars.json` | JSON | Raw data (stars and constellations) |

They are separate files but they talk to each other. HTML links to CSS with `<link>` and to JS with `<script>`.

---

## 2. HTML

### The boilerplate

Every HTML file starts with this exact structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Star Chart</title>
    <link rel="stylesheet" href="style.css" />
</head>
<body>

    <!-- page content goes here -->

    <script src="script.js"></script>
</body>
</html>
```

**Line by line:**

`<!DOCTYPE html>` — Tells the browser this is modern HTML5. Not an element, just a declaration. Always first.

`<html lang="en">` — The root element. Everything lives inside it. `lang="en"` is for accessibility (screen readers, search engines).

`<head>` — Invisible setup section. No content is displayed from here. Just configuration.

`<meta charset="UTF-8">` — Tells the browser to use UTF-8 encoding. Without this, special characters (é, ñ, ✦) can display incorrectly.

`<meta name="viewport" ...>` — Makes the page scale correctly on mobile screens. Without it, mobile browsers zoom out and make everything tiny.

`<title>` — The text shown in the browser tab.

`<link rel="stylesheet" href="style.css">` — Loads your CSS file. `rel="stylesheet"` means "this is a stylesheet". `href` is the file path.

`<body>` — Everything visible on the page goes here.

`<script src="script.js">` — Loads your JavaScript. **Always at the bottom of body**, not in `<head>`. Reason: HTML is read top-to-bottom. If JS loads first, it tries to find elements like `#star-canvas` that haven't been created yet, and you get `null` errors.

---

### Elements used in this project

**`<canvas>`** — A blank drawing surface. Has no visual content on its own — JavaScript draws on it.
```html
<canvas id="star-canvas"></canvas>
```
No width or height in HTML because JavaScript sets those dynamically.

**`<div>`** — A generic block container. Creates a new line before and after. Used here for the tooltip and info panel.

**`<span>`** — A generic inline container. Stays on the same line as surrounding content. Used for `tooltip-name` and `tooltip-mag` so they sit inside the tooltip box.

**`<h1>`** — A heading. Largest by default. Semantic meaning: "this is the most important heading on the page."

**`<p>`** — A paragraph. Block element with default top/bottom margin.

---

### id vs class

```html
<div id="tooltip" class="hidden">
```

| | `id` | `class` |
|---|---|---|
| Uniqueness | One per page | Many elements can share it |
| CSS selector | `#tooltip` | `.hidden` |
| JS selector | `getElementById('tooltip')` | `getElementsByClassName('hidden')` |
| Use for | Targeting ONE specific element | Styling or toggling groups |

`class="hidden"` is used here because it gets added and removed by JS at runtime — it's a state toggle, not a permanent identifier.

---

## 3. CSS

### Selectors

```css
*             { }   /* every element */
body          { }   /* the body element */
#star-canvas  { }   /* element with id="star-canvas" */
#info-panel p { }   /* <p> elements inside #info-panel */
#tooltip.hidden { } /* element with id="tooltip" AND class="hidden" */
.hint         { }   /* any element with class="hint" */
```

The space in `#info-panel p` means "descendant of". No space in `#tooltip.hidden` means "this element has both."

---

### Box model

Every element is a box. The box has four layers:

```
┌─────────────────────────────┐
│           margin            │  ← space outside the border
│  ┌───────────────────────┐  │
│  │        border         │  │  ← the visible edge
│  │  ┌─────────────────┐  │  │
│  │  │     padding     │  │  │  ← space inside the border
│  │  │  ┌───────────┐  │  │  │
│  │  │  │  content  │  │  │  │  ← the actual text/image/etc
│  │  │  └───────────┘  │  │  │
│  │  └─────────────────┘  │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

`box-sizing: border-box` makes `width` and `height` include padding and border. Without it, adding padding makes elements wider than you expect.

---

### Properties used in this project

**`overflow: hidden`** — Clips anything that extends beyond the element's bounds. On `body`, this prevents scrollbars from appearing when the canvas fills the window exactly.

**`position: fixed`** — Positions the element relative to the browser viewport, not the page. It stays in place even if the page scrolls. Used for the tooltip and info panel so they always appear at the same spot on screen.

**`pointer-events: none`** — The element is invisible to mouse clicks and hover events. Clicks "fall through" to whatever is behind it. Used on the info panel so it doesn't block clicks on the canvas.

**`cursor: crosshair`** — Changes the mouse cursor appearance over that element.

**`display: block`** — Makes an element take up the full line width and start on its own line. `<canvas>` is inline by default, which adds a small gap below it. `display: block` removes that gap.

**`opacity`** — Controls transparency. `opacity: 0` is fully invisible but the element still occupies space. Different from `display: none`, which removes it from layout entirely. Using `opacity: 0` with `transition: opacity 0.15s` creates a smooth fade.

**`transition: opacity 0.15s`** — Animates any change to `opacity` over 0.15 seconds. When JS removes `class="hidden"`, the opacity changes from 0 to 1 and this makes it fade in smoothly.

**`letter-spacing: 0.2em`** — Adds space between characters. `em` is relative to the font size. `0.2em` means 20% of the font size worth of space between each letter.

**`rgba(r, g, b, a)`** — RGB color with an alpha (opacity) channel. `rgba(5, 10, 20, 0.85)` is a very dark blue at 85% opacity. The `a` value runs from 0 (invisible) to 1 (solid).

---

## 4. JavaScript — The Basics Used Here

### const vs let

```js
const canvas = document.getElementById('star-canvas'); // never reassigned
let stars    = [];                                      // reassigned later
```

`const` — the variable cannot be reassigned. Use this by default.
`let` — the variable can be reassigned. Use when you need to change it.

`stars` needs `let` because later you do `stars = data.stars` — replacing the whole array. `canvas` never changes, so `const` is correct.

---

### Arrow functions

```js
// Traditional function
function greet(name) {
    return 'Hello ' + name;
}

// Arrow function — same thing, shorter syntax
const greet = (name) => {
    return 'Hello ' + name;
}

// If the body is one expression, you can skip the braces and return
const greet = (name) => 'Hello ' + name;
```

Used throughout this project in event listeners and forEach callbacks:
```js
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
});
```

---

### Template literals

```js
const name = 'Sirius';
const mag  = -1.4;

// Old way (string concatenation)
'Star: ' + name + ', Magnitude: ' + mag

// Template literal — cleaner, supports multi-line
`Star: ${name}, Magnitude: ${mag}`
```

The backtick (`` ` ``) syntax. `${}` embeds any expression inside the string.

Used in this project:
```js
starCount.innerText = `${stars.length} stars loaded`;
tooltipMag.innerText = `Magnitude: ${star.magnitude}`;
```

---

### Objects and dot notation

```js
let mouse = { x: 0, y: 0 };

mouse.x = e.clientX; // access and set a property
mouse.y = e.clientY;
```

An object is a collection of key-value pairs. Access properties with `.` (dot notation).

Stars in the JSON are objects too:
```js
star.name       // "Betelgeuse"
star.magnitude  // 0.4
star.x          // 0.27 (fraction of canvas width)
```

---

### Event listeners

```js
window.addEventListener('mousemove', (e) => {
    // e is the Event object — it carries data about what happened
    mouse.x = e.clientX; // cursor x position relative to viewport
    mouse.y = e.clientY; // cursor y position relative to viewport
});
```

`addEventListener(eventName, callback)` — Listens for an event and runs a function when it fires.

Common events used in this project:

| Event | Fires when |
|-------|-----------|
| `mousemove` | Cursor moves |
| `resize` | Browser window is resized |

---

### classList

`element.classList` lets you add, remove, or check CSS classes without replacing all of them.

```js
tooltip.classList.add('hidden')    // adds class="hidden"
tooltip.classList.remove('hidden') // removes it
tooltip.classList.toggle('hidden') // adds if absent, removes if present
tooltip.classList.contains('hidden') // returns true or false
```

Used in this project to show/hide the tooltip and switch screens.

---

### Style manipulation from JS

```js
tooltip.style.left = (mouse.x + 16) + 'px';
tooltip.style.top  = (mouse.y - 10) + 'px';
```

`element.style.propertyName = value` — Sets a CSS property directly. Note that the value must be a string, including the unit. `'100px'` not `100`.

CSS property names in JS drop the hyphen and capitalise: `background-color` → `backgroundColor`, but single-word ones like `left` and `top` stay the same.

---

## 5. JavaScript — The Canvas API

The canvas is a pixel-based drawing surface. You draw on it using methods on `ctx` (the context object). **Nothing persists** — every frame you clear and redraw everything.

### Getting started

```js
const canvas = document.getElementById('star-canvas');
const ctx    = canvas.getContext('2d'); // '2d' for flat drawing; 'webgl' for 3D

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
```

Setting `canvas.width` or `canvas.height` always clears the canvas entirely.

---

### Drawing paths (lines and shapes)

Every shape is a "path" — a set of instructions for where to move and draw. You build the path, then render it with `stroke()` (outline) or `fill()` (solid).

```js
// Drawing a line
ctx.beginPath();            // start fresh — always call this before a new shape
ctx.moveTo(100, 200);       // move the "pen" to (100, 200) without drawing
ctx.lineTo(400, 300);       // draw from current position to (400, 300)
ctx.strokeStyle = '#ffffff'; // color of the line
ctx.lineWidth = 1;
ctx.stroke();               // actually render the line

// Drawing a circle (arc)
ctx.beginPath();
ctx.arc(x, y, radius, startAngle, endAngle);
// arc(x, y, r, 0, Math.PI * 2) → full circle
// 0 = rightmost point, Math.PI * 2 = full 360°
ctx.fillStyle = '#ffffff';
ctx.fill();                 // render as filled circle
```

`beginPath()` is critical. Without it, all your draw calls connect into one continuous path, causing visual bugs.

---

### Colors and transparency

```js
ctx.fillStyle   = '#ffffff';              // solid white
ctx.fillStyle   = 'rgba(0, 200, 255, 0.5)'; // 50% transparent blue
ctx.strokeStyle = `rgba(0, 242, 255, ${alpha})`; // dynamic alpha
```

---

### Filling a rectangle

```js
ctx.fillRect(x, y, width, height); // fills a rectangle — no beginPath needed
ctx.clearRect(x, y, width, height); // erases a rectangle — used to wipe canvas
```

`clearRect(0, 0, canvas.width, canvas.height)` erases everything. Call this every frame before redrawing.

---

### Radial gradient

```js
const grad = ctx.createRadialGradient(
    cx, cy, 0,          // inner circle: center (cx,cy), radius 0
    cx, cy, canvas.width // outer circle: same center, large radius
);
grad.addColorStop(0, '#0a0f1e'); // color at the center
grad.addColorStop(1, '#000000'); // color at the edge
ctx.fillStyle = grad;
ctx.fillRect(0, 0, canvas.width, canvas.height);
```

A gradient that radiates outward from a center point. Color stops are fractions from 0 (center) to 1 (edge).

---

### Glow effect

```js
ctx.shadowBlur  = 20;       // how far the glow spreads (pixels)
ctx.shadowColor = '#aaccff'; // color of the glow
// ... draw something ...
ctx.shadowBlur  = 0;        // ALWAYS reset after use
```

`shadowBlur` applies to everything drawn on `ctx` until you reset it. Forgetting to reset is a very common bug — the glow bleeds into lines and other shapes.

---

### Drawing text

```js
ctx.font      = '11px Georgia'; // size + font
ctx.fillStyle = 'rgba(180, 200, 255, 0.5)';
ctx.fillText('Orion', x, y);   // draws text at position (x, y)
```

---

## 6. JavaScript — fetch() and async/await

`fetch()` requests a file or API endpoint over the network. It's asynchronous — it starts the request and your code keeps running. The result comes back later via a **Promise**.

### Without async/await (hard to read)

```js
fetch('stars.json')
    .then(response => response.json())
    .then(data => {
        stars = data.stars;
    });
```

### With async/await (clean and readable)

```js
async function loadData() {
    const response = await fetch('stars.json'); // pause until response arrives
    const data     = await response.json();     // pause until body is parsed
    stars          = data.stars;
}
```

`async` before `function` means "this function is asynchronous — it can use await."
`await` pauses execution at that line until the Promise resolves. Code after it runs once the result is ready.

### Why two awaits?

```js
const response = await fetch('stars.json');
// response is a Response object — not the data yet, just the headers
// The body (the actual JSON) is still being transferred

const data = await response.json();
// .json() reads and parses the body — this also takes time
// data is now a real JavaScript object you can use
```

### Important: fetch() needs a server

`fetch()` uses HTTP. If you open `index.html` by double-clicking it, the browser uses the `file://` protocol and fetch fails with a CORS error.

**You must use a local server:**
```bash
# Option 1: VS Code — install "Live Server" extension, click "Go Live"
# Option 2: Terminal
npx serve .
# then open http://localhost:3000
```

---

## 7. JavaScript — The Animation Loop

```js
function animate() {
    draw();
    requestAnimationFrame(animate);
}
animate(); // call once to start
```

`requestAnimationFrame(callback)` — asks the browser to call your function just before it paints the next screen frame. This is ~60 times per second on a 60Hz screen.

**Why not setInterval?**

```js
setInterval(draw, 16); // roughly 60fps — but has problems
```

| | `requestAnimationFrame` | `setInterval` |
|---|---|---|
| Pauses when tab hidden | ✓ Yes | ✗ No |
| Syncs to screen refresh | ✓ Yes | ✗ No |
| Timing drift | ✓ None | ✗ Possible |
| Battery efficient | ✓ Yes | ✗ No |

**The loop pattern:**

`animate` doesn't call itself directly. It asks `requestAnimationFrame` to schedule the next call. This is not infinite recursion — it's a managed browser loop. The browser controls the timing.

```
animate() called
  → draw() runs
  → requestAnimationFrame(animate) schedules next call
      → (browser paints frame)
      → animate() called again
          → draw() runs
          ...
```

---

## 8. JavaScript — Math Methods

### Math.sqrt()

```js
Math.sqrt(25) // → 5
```

Used to calculate distance between two points (Pythagorean theorem):

```js
const dx   = mouse.x - star.x;
const dy   = mouse.y - star.y;
const dist = Math.sqrt(dx * dx + dy * dy);
// If dist < 12, the mouse is within 12px of the star
```

Visual:
```
star(sx, sy)
    |\
 dy | \ dist (what we want)
    |  \
mouse(mx,my)
 ←dx→
```

`dist = √(dx² + dy²)` — straight-line distance between two points.

---

### Math.sin()

```js
Math.sin(angle) // returns a value between -1 and 1
```

`Math.sin` produces a smooth wave that cycles between -1 and 1. Perfect for animations.

Used for the twinkle effect:
```js
const time    = Date.now() / 1000;          // current time in seconds
const twinkle = Math.sin(time * 3 + star.id) * 0.4;
```

- `Date.now()` — milliseconds since Jan 1, 1970. Increases forever.
- `/ 1000` — converts to seconds so the wave is human-speed.
- `* 3` — how fast it oscillates (3 cycles per second).
- `+ star.id` — shifts the phase per star, so they pulse at different times.
- `* 0.4` — keeps the range small: −0.4 to +0.4 (just a small radius nudge).

---

### Math.max()

```js
Math.max(1, value) // returns whichever is larger
```

Used to ensure the star radius never drops below 1px:
```js
const radius = Math.max(1, (4 - star.magnitude) + twinkle);
```

Without this, a very dim star (magnitude 4) minus the twinkle could hit 0 or a negative radius, which breaks `ctx.arc`.

---

## 9. JavaScript — Array Methods

### forEach

```js
stars.forEach(star => {
    // runs once per element, 'star' is the current element
    console.log(star.name);
});
```

Loops through every element of an array. You can't `break` out of it early. If you need to stop early, use a regular `for` loop.

---

### find

```js
const star = stars.find(s => s.id === 3);
// Returns the FIRST element where the condition is true.
// Returns undefined if nothing matches.
```

Used to look up a star by its id when drawing constellation lines:
```js
const starA = stars.find(s => s.id === pair[0]);
```

The `s =>` is the arrow function. `s` is each element. The expression `s.id === pair[0]` is the condition — `find` returns the first element where this is `true`.

---

### Array bracket notation

```js
constellation.lines[0]      // first line pair, e.g. [1, 2]
constellation.lines[0][0]   // first star id in that pair → 1
constellation.lines[0][1]   // second star id → 2
```

Arrays are zero-indexed. First element is `[0]`, second is `[1]`, and so on.

---

## 10. How to Run the Project

1. Open a terminal in the `todo/` folder (or `complete/` to see the finished version).

2. Run a local server — pick one:
   ```bash
   npx serve .
   ```
   Then open `http://localhost:3000` in your browser.

   Or in VS Code: right-click `index.html` → "Open with Live Server."

3. Open the browser console (`F12` → Console tab). If something isn't working, the error message tells you exactly what and where.

---

## 11. What to Try Next

Once your TODO version works, try extending it:

**Easy**
- Change the star glow color from blue-white to warm yellow (`#ffe8a0`)
- Increase the hover detection radius from 12 to 20 and feel the difference
- Add a 5th constellation to `stars.json` using real star data

**Intermediate**
- On hover, also highlight the constellation lines that star belongs to
- Add a filter: click a constellation name in a sidebar to isolate it
- Draw a thin circle around the hovered star instead of just showing the tooltip

**Hard**
- Load real star data from NASA's public APIs instead of the local JSON
- Add a day/night cycle that darkens the background over time using `Date`
- Implement zoom with the mouse wheel — scale all positions relative to a zoom level

---

*You built a real astronomy tool. Keep going.*
