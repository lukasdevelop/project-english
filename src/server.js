import app from './app'
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', socket =>{
  console.log(`socket connected: ${socket.id}`)
  const votes = () => {
    return 0 + Math.floor((100 - 0) * Math.random())
  }
  const text = {
    title: "Project For Kids",
    content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley.",
    author: "Lukas Conka",
 }
 let dados = []
  setInterval(() =>{
    text.votes = votes()
    dados.push(text)
    socket.emit('FromApi', dados)

  }, 7000)

  socket.on("sendMessage", data => {
    console.log(data)
    io.emit('sendMessage', data)
  })

})
server.listen(process.env.PORT || 3333, () => {
  console.log('Server ON at PORT', process.env.PORT)
})
