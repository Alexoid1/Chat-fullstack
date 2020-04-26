const mongoose=require ('mongoose')
const {Schema}=mongoose

const ChatSchema = new Schema({ //33 creamos esquema de base de datos
    nick: String,
    msg: String,
    created: { type: Date, default: Date.now }
  });
module.exports=mongoose.model('Chat',ChatSchema)