const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
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


io.on('connection', (socket) => {
    // console.log(socket.id+', conectado ...')

    const chave = 'dados'
    socket.on('cardRender', (msg) => {
      const jsonArray = JSON.parse('[]');
      const novoObjeto = {tarefa: msg.tarefa};

      redis.exists(chave, (err, result) => {
        if (err) {
          console.error(err);
        } else if (result === 1) {

             
             redis.get('dados', (err, result) => {
                let res = JSON.parse(result);
                res.push(novoObjeto);
                redis.set('dados', JSON.stringify(res));
                io.emit('cardRender', {dados: JSON.stringify(res)});
             });
          

        } else {
            
            jsonArray.push(novoObjeto);
            redis.set('dados', JSON.stringify(jsonArray));
            io.emit('cardRender', {dados: JSON.stringify(jsonArray)});
        }
      });
    });

  

    redis.get('dados', (err, result) => {
        io.emit('cardRender', {dados: result})
    });


    socket.on('apagar', (val)=>{
        redis.get('dados', (err, result)=>{
           let dados = JSON.parse(result)
           const novoArray = dados.filter(item => item.tarefa !== val);
           redis.set('dados', JSON.stringify(novoArray))
           io.emit('cardRender', {dados: JSON.stringify(novoArray)})
        })
    })
    

  });

const porta = 3000  
server.listen(porta, () => {
  console.log(`listening on *:${porta}`);
});
