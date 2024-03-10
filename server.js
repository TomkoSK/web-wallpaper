const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
var dataURL = null;

app.use(express.static('public'));

app.get('/download', (req, res) => {
  fs.readFile('./canvas.png', (err, data) => {
      if (err) {
          console.error('Error reading wallpaper file:', err);
          res.status(500).send('Internal Server Error');
          return;
      }
      res.writeHead(200, {'Content-Type': 'image/png'});
      res.end(data);
  });
});

io.on('connection', (socket) => {
    console.log('A user connected');
  
    socket.on('draw', (data) => {
      io.emit('draw', data);
    });

    socket.on('updateCanvas', (data) =>{
      dataURL = data;
    });

    socket.on('getCanvas', () => {
      socket.emit('response', dataURL);
    });
  
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });


function saveCanvas(){
  if(dataURL == null) {return};
  const data = dataURL.split(",")[1];
  const buffer = Buffer.from(data, "base64");
  const filePath = "./canvas.png"
  fs.writeFile(filePath, buffer, (err) =>{
    if(err){
      console.error("Error rip", err);
      return;
    }
  })
}
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

setInterval(saveCanvas, 1000);