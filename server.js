const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cats = require('./cats.json')

app.use(express.static('public'))

app.get('/cats', (req, res) => res.send(cats))

io.on('connection', function(socket){
  socket.on('dragstart', (message) => {
    const cat = cats.find(currentCat => currentCat.name === message.name)
    cat.locked = false
    io.emit('update', cat)
  })
  socket.on('dragend', (message) => {
    const cat = cats.find(currentCat => currentCat.name === message.name)
    cat.locked = true;
    cat.x = message.x
    cat.y = message.y

    io.emit('update', cat)
  })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
