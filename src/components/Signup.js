import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

const Signup = (props) => {

    const [credentials,setCredentials] = useState({name:"",email:"",password:"",cpassword:""})
        let history = useHistory();

        const handleSubmit = async (e) => {
            e.preventDefault();
            const {name,email,password}=credentials;
            const response = await fetch("http://localhost:5000/api/auth/createuser", {
                
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name,email,password }),
            });
            const json = await response.json();
            console.log(json);
            if(json.success){
                //save the auth token and redirect
                localStorage.setItem('token',json.authtoken)
                history.push("/")
                props.showAlert("account created successfully","success")

            }else{
                props.showAlert("Invalid credentials","danger")
            }
            setCredentials({email:"",password:""})
        }


    const onChange = (e) => {
        setCredentials({...credentials,[e.target.name]:e.target.value})
    }
    return (
        <div className='container mt-2'>
            <h2 className='my-2'>Create an account to get started with iNoteBook</h2>
            <form onSubmit={handleSubmit}>
            <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name="name" onChange={onChange} aria-describedby="onChange={onchange} "/>
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" onChange={onChange} aria-describedby="emailHelp"/>
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" name="password" onChange={onChange} required minLength={5} id="password"/>
                </div> 
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" name="cpassword" onChange={onChange} required minLength={5} id="cpassword"/>
                </div> 
               
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Signup
