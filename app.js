const express = require("express");
const app = express();

const mongoose = require("mongoose")
require('dotenv').config();
const port = process.env.PORT ;


const dbUrl = process.env.DB_URL;

app.use(express.json());
mongoose.set('strictQuery', false);

// Connecting to the database with options
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000, // 45 seconds
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
};

mongoose.connect(`${dbUrl}/mern-app`, mongooseOptions)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

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
