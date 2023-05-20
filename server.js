const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const axios = require('axios');
const io = new Server(server,{
    maxHttpBufferSize: 10 * 1024 * 1024, // 10MB
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    
});

const cors = require('cors');
app.use(cors());

const Redis = require('ioredis');

const redis = new Redis();

let dadosArray = []
io.on('connection', (socket) => {
    // console.log(socket.id+', conectado ...')

    socket.on('cardRender', async (msg) => {
     
      var dados =  await axios.get(msg.url, msg.token).then((val)=>{
        io.emit('cardRender', {dados: JSON.stringify(val.data)});
        dadosArray = val.data
      }).catch((error)=>{
        io.emit('cardRender', {dados: JSON.stringify(dadosArray)});
      })
    });

      

  });

const porta = 3001  
server.listen(porta, () => {
  console.log(`listening on *:${porta}`);
});
