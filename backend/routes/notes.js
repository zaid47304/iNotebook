const express=require("express");
const router=express.Router();
var fetchuser= require('../middleware/fetchuser');
const Note=require('../models/Notes');
const { body, validationResult } = require('express-validator');
// ROUTE get all the notes using GET "/api/notes/fetchallnotes" : Login Required
router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    try {
        const notes=await Note.find({user:req.user.id});
        res.json(notes);
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
})
// ROUTE 2: Add a new Note using : POST "/api/auth/addnotes" . Login required
router.post('/addnote',fetchuser,[
    body('title','Enter a valid title').isLength({min: 3}),
    body('description','Description must be atleast 5 characters').isLength({ min: 5 }),
],async (req,res)=>{
    try {
        // use destructuring to get title and description
    const {title,description,tag}=req.body;
    // if there are errors return bad request along with errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const note=new Note({
        title,description,tag,user:req.user.id
    })
    const savedNote=await note.save();
    res.json(savedNote);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})
// ROUTE 3 -update an existing note -/api/note/updatenote PUT -login required
router.put('/updatenote/:id',fetchuser,async (req,res)=>{
    try {
        // use destructuring to get title and description
        const{title,description,tag}= req.body;
        // create a new note object
        const newNote= {};
        if(title){
          newNote.title=title;
        }
        if(description){
            newNote.description=description;
        }
        if(tag){
            newNote.tag=tag;
        }
        // find the note to be update and update it
        let note= await Note.findById(req.params.id);
        // if this note does not exist
        if(!note){return res.status(404).send("Not Found")};
        // if the note does not matches to user id
        if(note.user.toString()!=req.user.id){
            return res.status(401).send("Not Allowed");
        }
        note=await Note.findByIdAndUpdate(req.params.id,{$set : newNote},{new:true})
        res.json({note});
    
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})
// ROUTE 4 Delelte the note - delete- /api/notes/deletenode/id - Login Required
router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
    try {
        // find the note to be update and update it
        let note= await Note.findById(req.params.id);
        // if this note does not exist
        if(!note){return res.status(404).send("Not Found")};
        // Allow deletion only if user owns this note
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("Not Allowed");
        }
        note=await Note.findByIdAndDelete(req.params.id)
        res.json({"Success": "note has been deleted" , note:note});
    
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
})
module.exports=router;