const mongoose = require("mongoose");
const express = require("express")

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/").then(()=>{
    console.log("Mongo connected")
})

const schema = new mongoose.Schema({
    shortId:String,
    visits:{type:Number,default: 0},
    redirect:String
});
const url = mongoose.model("url",schema)


app.post("/shorturl",(req,res)=>{
    const id =  Math.random().substring(1,5);
    url.create({
        shortid:id,
        url:req.body.url
    });
    res.send("http://localhost:3000/"+id);
})

app.get("/:id",async(req,res)=>{
    const data = await url.findOne({shortid:req.params.id})
    data.visits++;
    await data.save();
    res.redirect(data.url);
})

app.patch("/:id",async(req,res)=>{
    const data = await url.findOneAndUpdate(
        {shortid:req.params.id},
        {url:req.body.url}
    )
})

app.listen(3000,()=>{
    console.log("Server running on 3000");
})