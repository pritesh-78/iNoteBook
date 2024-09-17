import React ,{useContext, useState} from 'react'
import noteContext from "../context/notes/NoteContext";


const Addnote = (props) => {
    const context = useContext(noteContext);
    const {addNote} = context;
    const [note,setNote]=useState({title:"",description:"",tag:""})
    const handleCLick = (e) => {
        e.preventDefault();
        addNote(note.title,note.description,note.tag);
        setNote({title:"",description:"",tag:""});
        props.showAlert("Added successfully","success")
    }   
    const onChange = (e) => {
        setNote({...note,[e.target.name]:e.target.value})
    }

    return (
        <div className='container my-3'>
            <h1 className='text-center'>Add a Note</h1>
            <form className='my-3'>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title" value={note.title} aria-describedby="emailHelp" onChange={onChange} />
    
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" value={note.description} name="description" onChange={onChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" value={note.tag} name="tag" onChange={onChange} />
                </div>
                
                <button disabled={note.title.length<5 ||note.description.length<5} type="submit" className="btn btn-primary" onClick={handleCLick}>Add Note</button>
            </form>

        </div>
    )
}

export default Addnote
