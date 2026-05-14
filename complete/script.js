// ── Canvas setup ────────────────────────────────────────────
const canvas = document.getElementById('star-canvas');
const ctx    = canvas.getContext('2d');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

// ── UI elements ──────────────────────────────────────────────
const tooltip     = document.getElementById('tooltip');
const tooltipName = document.getElementById('tooltip-name');
const tooltipMag  = document.getElementById('tooltip-mag');
const starCount   = document.getElementById('star-count');

// ── Global state ─────────────────────────────────────────────
let stars         = [];
let constellations = [];
let mouse         = { x: 0, y: 0 };

// ── Load data ────────────────────────────────────────────────
async function loadData() {
    const response = await fetch('stars.json');
    const data     = await response.json();
    stars          = data.stars;
    constellations = data.constellations;
    starCount.innerText = `${stars.length} stars loaded`;
    draw();
    animate();
}

// ── Draw background ──────────────────────────────────────────
function drawBackground() {
    const cx   = canvas.width / 2;
    const cy   = canvas.height / 2;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width);
    grad.addColorStop(0, '#0a0f1e');
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ── Draw constellation lines ─────────────────────────────────
function drawConstellationLines() {
    constellations.forEach(constellation => {
        ctx.strokeStyle = constellation.color;
        ctx.lineWidth   = 0.5;

        constellation.lines.forEach(pair => {
            const starA = stars.find(s => s.id === pair[0]);
            const starB = stars.find(s => s.id === pair[1]);

            const ax = starA.x * canvas.width;
            const ay = starA.y * canvas.height;
            const bx = starB.x * canvas.width;
            const by = starB.y * canvas.height;

            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
        });
    });
}

// ── Draw stars ───────────────────────────────────────────────
function drawStars() {
    const time = Date.now() / 1000;

    stars.forEach(star => {
        const px      = star.x * canvas.width;
        const py      = star.y * canvas.height;
        const twinkle = Math.sin(time * 3 + star.id) * 0.4;
        const radius  = Math.max(1, (4 - star.magnitude) + twinkle);

        ctx.shadowBlur  = radius * 6;
        ctx.shadowColor = '#aaccff';
        ctx.fillStyle   = '#ffffff';

        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
    });
}

// ── Draw constellation labels ────────────────────────────────
function drawLabels() {
    ctx.font      = '11px Georgia';
    ctx.fillStyle = 'rgba(180, 200, 255, 0.5)';

    constellations.forEach(constellation => {
        const firstStarId = constellation.lines[0][0];
        const star        = stars.find(s => s.id === firstStarId);
        const px          = star.x * canvas.width;
        const py          = star.y * canvas.height;
        ctx.fillText(constellation.name, px + 10, py - 10);
    });
}

// ── Hover detection ──────────────────────────────────────────
function checkHover() {
    let found = false;

    stars.forEach(star => {
        const px   = star.x * canvas.width;
        const py   = star.y * canvas.height;
        const dx   = mouse.x - px;
        const dy   = mouse.y - py;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 12) {
            found = true;
            tooltip.classList.remove('hidden');
            tooltip.style.left  = (mouse.x + 16) + 'px';
            tooltip.style.top   = (mouse.y - 10) + 'px';
            tooltipName.innerText = star.name;
            tooltipMag.innerText  = `Magnitude: ${star.magnitude}`;
        }
    });

    if (!found) tooltip.classList.add('hidden');
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    checkHover();
});

// ── Main draw call ───────────────────────────────────────────
function draw() {
    drawBackground();
    drawConstellationLines();
    drawStars();
    drawLabels();
}

// ── Animation loop ───────────────────────────────────────────
function animate() {
    draw();
    requestAnimationFrame(animate);
}

// ── Resize handler ───────────────────────────────────────────
window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();
});

// ── Start ────────────────────────────────────────────────────
loadData();
