const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const router = new express.Router();

router.post("/tasks", auth, async (req,res) => {
    try{   
     const task = new Task({
         ...req.body,
         user: req.user._id
     })
     await task.save();
     res.status(201).send(task);
    
 }catch(e){
   
     res.status(400).send(e.message);
   
 }
 
 })

 //GET /tasks?completed=true
 //GET /tasks?limit=10&skip=20
 //GET /tasks?sortBy=createdAt:desc/asc
 
 router.get("/tasks", auth, async (req,res) => {
    const match = {};
    const sort = {};

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 ;
    }

     try{   
         await req.user.populate({
             path: 'tasks',
             match,
             options: {
                 limit: parseInt(req.query.limit),
                 skip: parseInt(req.query.skip),
                 sort
             }
         }).execPopulate();
         res.send(req.user.tasks);
        
     }catch(e){
       
         res.status(500).send();
    
     }
 })
 
 router.get("/tasks/:id", async (req,res) => {
    
     const _id = req.params.id;
    
     try{
         const task = await Task.findOne({_id, user: req.user_id})
         if(!task){
            return res.status(404).send();
         }
       
         res.send(task);
    
     }catch(e){
         res.status(500).send();
     }
 })
 
 router.patch("/tasks/:id" , auth, async (req, res) => {
     const updates = Object.keys(req.body);
     const allowedUpdate = ['description','completed'];
     const isValidOperation = updates.every((update) => allowedUpdate.includes(update));
     
     if(!isValidOperation){
         return res.status(400).send({error : "Invalid update!"})
     }
 
     try{
        const task = await Task.findOne({_id:req.params.id, user: req.user._id})
         if(!task){
             res.send(400).send("Task not found");
         }

        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        return res.send(task);
     }catch (e){
         res.status(400).send();
     }
 });

 const uploadTaskImage = multer({
    limits: {
        fileSize: 1000000 //1 Mega byte
    },
    fileFilter(req, file, cb){
       if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
        return cb(new Error('Upload falied,Please upload a jpg,jpeg or png'));
       }

       cb(undefined, true);
    }
});

router.post('/tasks/:id/me/image', auth, uploadTaskImage.single('taskImage'), async (req,res) => {
    const _id = req.params.id;
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    const task = await Task.findOne({_id});
    task.image = buffer;
    await task.save();
    res.send("Task image upload successfully");

},(error, req, res, next) => {
    res.status(400).send({error: error.message});
});

router.get('/tasks/:id/me/image', async (req, res) => {
    try{
        const task = await Task.findById(req.params.id);

        if(!task || !task.image){
            throw new Error();
        }

        res.set('Content-Type','image/png');
        res.send(task.image);
    }catch(e){
        res.status(404).send();
    }
});

router.delete('/tasks/:id/me/image', auth, async (req,res) => {
    const task = await Task.findById(req.params.id);
    task.image = undefined;
    await task.save();
    res.status(200).send('Task image deleted successfully');
})

 
 router.delete("/tasks/:id", auth, async (req,res) => {
     try{
         const task = await Task.findOneAndDelete({_id:req.params.id, user: req.user._id});
         if(!task){
          return res.status(404).send("Task not found");

         }
 
         res.send(task);
     }catch(e){
         res.status(500).send();
     }
 })

module.exports = router;