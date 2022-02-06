
import NoteContext from "./noteContext";
import { useState } from "react";
const NoteState =(props)=>{
  const host= "http://localhost:5000"
    const notesInitial=[]
      const [notes, setNotes] = useState(notesInitial);
      // get all notes
      const getNotes= async ()=>{
        //TODO api call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
         method: 'GET',
         headers: {
           'Content-Type': 'application/json',
           "auth-token":localStorage.getItem('token')
         },
       });
       const json= await response.json(); //.json() converts resposne into a javascript object
       console.log(json);
       setNotes(json);
       }
      // Add a note
      const addNote= async (title,description,tag)=>{
       //TODO api call
       const response = await fetch(`${host}/api/notes/addnote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "auth-token":localStorage.getItem('token')
        },
        body: JSON.stringify({title,description,tag}) 
      });
      const note=await response.json();
       setNotes(notes.concat(note));
      }


      // Delete a note
      const deleteNote =async (id) =>{
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            "auth-token":localStorage.getItem('token')
          },
        });
        const json = await  response.json();
        console.log(json);
       console.log("Deleting the node with id"+id)
       const newNotes=notes.filter((note)=>{
         // filter out all the nodes having the id passed
         // so logically that note will deleted sahi h bc
        return note._id!==id
       })
       setNotes(newNotes);
      }


      // Edit a node
      const editNote = async (id,title,description,tag) =>{
        //API call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            "auth-token":localStorage.getItem('token')
          },
          body: JSON.stringify({title,description,tag}) 
        });
        const json =await response.json();
        console.log(json)
        
        // logic to edit in client
        // we cannot directly change notes so we had to create a new copy of notes
        let newNotes=JSON.parse(JSON.stringify(notes))
        for (let index = 0; index < newNotes.length; index++) {
           const element = newNotes[index];
           if(element._id===id){
             newNotes[index].title=title;
             newNotes[index].description=description;
             newNotes[index].tag=tag;
             break;           
            }
         }
         setNotes(newNotes);
      }




      return (
       <NoteContext.Provider value={{notes,addNote,deleteNote,editNote,getNotes}}>
           {props.children};
       </NoteContext.Provider>
   )
}
export default NoteState;