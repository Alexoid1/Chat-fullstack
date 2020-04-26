$(function(){
    
    const socket=io();//9) usamos el metodo io
    //obteniendo los elemnetos del dom en la interfaz
    const $messageForm=$('#message-form'); //13)
    const $messageBox=$('#message');
    const $chat=$('#chat');
   
    // 20)obteniendo los elemnetos del dom del login
    const $nickForm=$('#nickForm');
    const $nickError=$('#nickError');
    const $nickname=$('#nickname');

    const $users=$('#usernames'); //elemnto lista de usuarios en el chat
    $nickForm.submit(e=>{
        e.preventDefault()
        //console.log($nickname.val())
        socket.emit('new user',$nickname.val(),data=>{ //21 emite un evento new user que es el imput q viene del formulario del login
            if(data){         //23) un condicional en el q al ingresar un nuevo nombre quita la interfaz del login y pone el chat
                $('#nickWrap').hide();
                $('#contentWrap').show()
            }else{
                $nickError.html(`
                <div class='alert alert-danger'>The name is used, try with other name</div>`)
            }
            $nickname.val('')
        })
    })

    $messageForm.submit(e=>{ //14)
        e.preventDefault()
        socket.emit('send message',$messageBox.val(),data=>{ //30 crea un callback para avisar de posibles errores
            $chat.append(`<p class='error'>${data}</p>`)
        }); //15 emite un evento send message que es el texto q viene del formulario //val()solo se usa en query es como value en javascript plano
        $messageBox.val('')
    })

    socket.on('new message',function(data){ //18)resive los datos del evento new message originado en el servidor y los muestra en pantalla
        $chat.append('<b>'+data.nick+'</b>:'+data.msg+'</br>'); //append()es un metodo usado en jqueri es como apenchild en javascrip plano
    })
    socket.on('usernames',data=>{ //24)para todos los nombres en nicknames se les asigan en un parrafo y con un incono
        let html='';
        for(let i = 0;i<data.length;i++){
            html+=`<p><i class='fa fa-user'></i> ${data[i]}</p>`
        }
        $users.html(html);
    })
    socket.on('whisper',data=>{
        $chat.append(`<p class='whisper'><b>${data.nick}:</b>${data.msg}</p>`) //31)hace q el cliente escuche el evento whisper y agrega el mensaje al chat
    })
    socket.on('load old messages', msgs=>{
        for(let i=0;i<msgs.length;i++){
            displayMsg(msgs[i])

        }
    })
    function displayMsg(data){
        $chat.append(`<p class='whisper'><b>${data.nick}:</b>${data.msg}</p>`)
    }
})