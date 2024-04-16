const express= require("express")
const http= require("http")
const cors = require("cors");
const app=express();
const bodyParser= require("body-parser")
app.use(bodyParser.json());
app.use(cors())
app.options("*", cors());
const server=http.createServer(app)

app.post('/demo',(req,res)=>{
    const text=req.body.text;
    console.log(text*text);
    const output={
        "text":text*text
    }
    res.send(output)
})

app.get('/',(req,res)=>{
    res.send("Server is running");
})
server.listen(3000, function (){
    console.log("Server is running")
})