const express = require("express");
const app = express();

const mongoose = require("mongoose")
require('dotenv').config();
const port = process.env.PORT ;


const dbUrl = process.env.DB_URL;

app.use(express.json());

//connecting Db
mongoose.connect(`${dbUrl}mern-app`)
.then(()=>{
    console.log("DB connected")
}).catch((err)=>{
    console.log(err)
})

// creating Schema
const todoschema = new mongoose.Schema({
    title:String,
    description: String
})

//creating model 
const todomodel=mongoose.model("todo",todoschema);

app.post("/todos",async (req,res)=>{
    const {title , description}=req.body;
    try {
        const createtodo= new todomodel({title,description});
        await createtodo.save();
       res.status(201).json(createtodo)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
})

app.get("/", async(req,res)=>{
    try {
        const alltodos =await todomodel.find()
        res.json(alltodos)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
   
})

app.get("/todos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await todomodel.findById(id)
        res.json(todo);
    } catch (err) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
});

app.put("/todos/:id", async (req,res)=>{
    const {id} = req.params;
    const {title , description}=req.body;
    try {
        const updatedtodo =await todomodel.findByIdAndUpdate(
            id,
            {title, description},
            {new: true} //postman la update panunathuku apm keela iruka terminal la updated text kaatum ilana palaya text tha kaatum
        )
        res.json(updatedtodo);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
})


app.delete("/todos/:id", async (req,res)=>{
    const {id} = req.params;
    const {title , description}=req.body;
    try {
        const deleteddtodo =await todomodel.findByIdAndDelete(
            id,
            {title, description}
           
        )
        res.json({message:"item was deleted"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
})

app.listen(port,()=>{
    console.log(`server is running on port ${port} `)
})