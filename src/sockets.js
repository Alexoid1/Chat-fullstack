const Chat=require('./models/chat')
module.exports=function(io){ //11) se crea archivo sockets y se lo exporta hacia el index.js 
    let users={}
    
    io.on('connection',async socket=>
    {console.log('new user connected')
    let messages=await Chat.find({}).limit(8) //36) buscar los ultimos 8 mensajes guardados en la base de datos y guardarlos en variable
    socket.emit('load old messages',messages) //37 emitir evento  load old mesagges y como dato  la variable messages con los mensajes guardados el la base datos
    socket.on('new user',(data,cb)=>{ //22)resive el evento new user en los sockets si esta conecta el usuaripo o no
        //console.log(data) 
        if(data in users){
            cb(false)
        }else{
            cb(true);
            socket.nickname=data;
            users[socket.nickname]=socket
            
            upDateUsers() //emite evento username
        }

    })

    socket.on('send message', async (data,cb)=>{//16resivimos el evento send message 
        //console.log(data) 
        var msg=data.trim();
        if(msg.substr(0,3)==='/w '){
            msg=msg.substr(3)
            const index=msg.indexOf(' ')
            if(index!==-1){
                var name=msg.substring(0,index)  //28) se analiza la cadena si tiene el cartacter /w y un nombre de usuario valido envia un mensaje privado
                var msg=msg.substring(index +1)
                if (name in users){
                    users[name].emit('whisper',{  //29 si cumple lo anterior emite evento whisper
                        msg,
                        nick:socket.nickname
                    })
                }else{
                    cb('error please enter a valid user')

                }
            }else{
                cb('Error not a valid user')
            }
        }else{
            var newMsg=new Chat({ //35 cuando escriba un mensaje le asigan los valores y lo guarda 
                msg,
                nick:socket.nickname
            })
            await newMsg.save()
            io.sockets.emit('new message',{ //27) se cambia la funcion por un objeto para poder usar el nombre de quien escribio el mensaje
                msg:data,
                nick:socket.nickname
            })
        }       
        //17 retrasmite el evento resivido a todos los sockets disponibles y con el nombre del evemnto new message
    }) //resive el valor del input 
    socket.on('disconnect',data=>{ //25)evento disconnect se ejecuta cuando un usuario se desconecta
        if(!socket.nickname) return;
        delete users[socket.nickname] // 26)si registra una propiedad nickname q se le da al conectarse al socket  y se desconecta se lo quita del arreglo
        upDateUsers();
    })
    function upDateUsers(){
        io.sockets.emit('usernames',Object.keys(users)); //se usa para poder usar un objeto como arreglo
    }
})

}
