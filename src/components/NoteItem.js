import React,{useContext} from "react";
import noteContext from "../context/notes/noteContext";
const NoteItem = (props) => {
  const context = useContext(noteContext);
  // use of destructuring
  const {deleteNote}= context;
  const { note,updateNote,showAlert} = props;
  return (
    <div className="col-md-3">
      <div className="card">
        <div className="card-body">
         <div className="d-flex align-items-cneter">
         <h5 className="card-title">{note.title}</h5>
          <i className="far fa-edit mx-2" onClick={()=>{updateNote(note)}}></i>
          <i className="far fa-trash-alt mx-2" onClick={()=>{deleteNote(note._id);showAlert("Deleted successfully","success")}}></i>
         </div>
          <p className="card-text">
            {note.description}
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
