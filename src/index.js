const http=require('http')
const path=require('path') //se usa porq al cambiar la ruta de public se nesesita encontrar la ruta y path es util para asignar rutas en distintas plataformas
const express=require('express');
const socketio=require('socket.io')
const mongoose=require ('mongoose') //33)

const app=express();
const server=http.createServer(app) //7)creo segundo servidor
const io=socketio.listen(server); //8)conexion de sockets a tiempo real

//conexion a base de datos
mongoose.connect('mongodb://localhost/chat', { //34 creamos y nos conectamos a la base de datos
    useNewUrlParser: true
})
  .then(db => console.log('db connected'))
  .catch(err => console.log(err));
//SETTING
app.set('port',process.env.PORT || 3000) //  12)para configurar el puerto ya q la aplicacion ya q el servidor va a estar en HEROKU  y no en el mismo ordenador
                                         //process.env.PORT || 3000 si el servidor ya da un puerto toma.lo sino usa el puerto 3000


require('./sockets')(io)//rerquerimos la funcion en sockets y le damos de parametro a io eso lo hacemos poniendo alado parentesis y el parametro

app.use(express.static(path.join(__dirname,'public'))) // 3)establece la carpeta public como archivo de inicio
server.listen(app.get('port'),()=>{console.log('servidor funcionando'+app.get('port'))})  //2)