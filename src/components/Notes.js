import React, { useContext, useEffect, useState } from 'react'
import { useRef } from 'react'

import noteContext from "../context/notes/NoteContext";
import NoteItem from './NoteItem';
import Addnote from './Addnote';
import { useHistory } from 'react-router';

const Notes = (props) => {
  const context = useContext(noteContext);
  const { notes, getNotes ,editNote} = context;
  let history = useHistory();
  useEffect(() => {
    if(localStorage.getItem('token')){
      getNotes();
    }else{
      history.push('/login')      
    }
    
    // eslint-disable-next-line
  }, [])

  const ref = useRef(null);
  const refClose = useRef(null);


  const [note, setNote] = useState({id:"", etitle: "", edescription: "", etag: "" })


  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({id:currentNote._id,etitle:currentNote.title,edescription:currentNote.description,etag:currentNote.tag})
  }

  const handleCLick = (e) => {
    console.log("updating the note", note)
    editNote(note.id,note.etitle,note.edescription,note.etag)
    refClose.current.click();
    props.showAlert("Updated successfully","success")
  }

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value })
  }


  return (
    <>
      <Addnote showAlert={props.showAlert} />

      <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">

              <form className='my-3'>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">Title</label>
                  <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} aria-describedby="emailHelp" onChange={onChange} />

                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Tag</label>
                  <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange} />
                </div>

              </form>

            </div>
            <div className="modal-footer">
              <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" disabled={note.etitle.length<5 ||note.edescription.length<5} onClick={handleCLick} className="btn btn-primary">Update Note</button>
            </div>
          </div>
        </div>
      </div>


      <div className=' container row my-3'>
        <h1 className='text-center'>Your Notes</h1>
        <div className="container text-center "> 
        {notes.length===0 && 'ooo oohhhh..... No notes to display  '}
        </div>
        {notes.map((note) => {
          return <NoteItem showAlert={props.showAlert} key={note._id} updateNote={updateNote} note={note} />
        })}
      </div>
    </>
  )
}

export default Notes
