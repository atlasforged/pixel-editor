/**
 * @type HTMLCanvasElement
 */
const canvas = document.getElementById("canvas");
const grid = document.getElementById("grid");
const colorInput = document.getElementById("colorInput");
const toggleGrid = document.getElementById("toggleGrid");
const clearBtn = document.getElementById("clear-btn");
const toggleErase = document.getElementById("toggleErase");
const drawingContext = canvas.getContext("2d");

const CELL_SIDE_COUNT = 16;
const cellPixelLength = canvas.width / CELL_SIDE_COUNT;
const colorHistory = {};
let isDrawing = false; // TRACK DRAWING STATE
// DEFAULT COLOR ON PICKER
colorInput.value = "#000000";

// CANVAS BACKGROUND
drawingContext.fillStyle = "#ffffff";
drawingContext.fillRect(0, 0, canvas.width, canvas.height);

// GRID SETUP
grid.style.width = `${canvas.width}px`;
grid.style.height = `${canvas.height}px`;
grid.style.gridTemplateColumns = `repeat(${CELL_SIDE_COUNT}, 1fr)`;
grid.style.gridTemplateRows = `repeat(${CELL_SIDE_COUNT}, 1fr)`;

[...Array(CELL_SIDE_COUNT ** 2)].forEach(() =>
  grid.insertAdjacentHTML("beforeend", "<div></div>")
);

function handleMouseDown(e) {
  // CHECK IF USING PRIMARY MOUSE
  if (e.button !== 0) return;

  isDrawing = true;
  handleCanvasInteraction(e);
}

function handleMouseMove(e) {
  if (!isDrawing) return; // ONLY DRAW WITH MOUSE HELD
  handleCanvasInteraction(e);
}

function handleMouseUp() {
  isDrawing = false; // STOP DRAW ON MOUSE RELEASE
}

function handleCanvasInteraction(e) {
  // CHECK IF USING PRIMARY MOUSE
  if (e.button !== 0) return;

  const canvasBoundingRect = canvas.getBoundingClientRect();
  const x = e.clientX - canvasBoundingRect.left;
  const y = e.clientY - canvasBoundingRect.top;
  const cellX = Math.floor(x / cellPixelLength);
  const cellY = Math.floor(y / cellPixelLength);

  // CHECK ERASE TOGGLE
  if (toggleErase.checked) {
    eraseCell(cellX, cellY);
  } else {
    fillCell(cellX, cellY);
  }
}

function fillCell(cellX, cellY) {
  const startX = Math.floor(cellX * cellPixelLength);
  const startY = Math.floor(cellY * cellPixelLength);
  const cellSize = Math.ceil(cellPixelLength); // COVER GAPS BETWEEN CELLS

  drawingContext.fillStyle = colorInput.value;
  drawingContext.fillRect(startX, startY, cellSize, cellSize);
  colorHistory[`${cellX}_${cellY}`] = colorInput.value;
}

function eraseCell(cellX, cellY) {
  const startX = Math.floor(cellX * cellPixelLength);
  const startY = Math.floor(cellY * cellPixelLength);
  const cellSize = Math.ceil(cellPixelLength); // COVER GAPS BETWEEN CELLS

  // Use white color to erase
  drawingContext.fillStyle = "#ffffff";
  drawingContext.fillRect(startX, startY, cellSize, cellSize);
  colorHistory[`${cellX}_${cellY}`] = "#ffffff";
}

function handleClearButtonClick() {
  const yes = confirm("Are you sure you wish to clear the canvas?");

  if (!yes) return;

  drawingContext.fillStyle = "#ffffff";
  drawingContext.fillRect(0, 0, canvas.width, canvas.height);
}

function handleToggleGridChange() {
  grid.style.display = toggleGrid.checked ? null : "none";
}

// SET INITIAL GRID DISPLAY STATE
grid.style.display = "none";

// EVENT LISTENERS
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);
clearBtn.addEventListener("click", handleClearButtonClick);
toggleGrid.addEventListener("change", handleToggleGridChange);
