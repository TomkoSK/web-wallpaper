const socket = io();
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

socket.emit("getCanvas");
socket.on("response", (dataURL) =>{
  if(dataURL != null){
  const img = new Image();
  img.onload = function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0);
  };
  img.src = dataURL;
  }
})

let color = "black"
let strokeWidth = 4;
let isDrawing = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;
    const [x, y] = [e.offsetX, e.offsetY];

    socket.emit("draw", {lastX, lastY, x, y, color, strokeWidth});

    lastX = x;
    lastY = y;
}

socket.on('draw', ({ lastX, lastY, x, y, color, strokeWidth }) => {
  context.beginPath();
  context.moveTo(lastX, lastY);
  context.lineTo(x, y);
  context.strokeStyle = color;
  context.lineWidth = strokeWidth;
  context.stroke();
});

function saveCanvas(){
    const canvasData = canvas.toDataURL('image/png');
    socket.emit('updateCanvas', canvasData);
}

function setColor(colorID){
  color = colorID;
}

function setWidth(width){
  strokeWidth = width;
  console.log(width);
}

setInterval(saveCanvas, 500); 