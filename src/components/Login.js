import React,{useState} from "react";
import {useNavigate} from 'react-router-dom';
const Login = (props) => {
    const [credentials, setcredentials] = useState({email:"",password:""});
    const onChange = (e) => {
        setcredentials({ ...credentials, [e.target.name]: e.target.value });
      };
      let history=useNavigate();
    const handleSubmit = async (e)=>{
        // to prevent page from reloading 
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email:credentials.email,password:credentials.password}) 
          });
        const json=await response.json();
        if(json.success){
            // redirect to user page containing notes
            // save the auth-token and redirect
            props.showAlert("Successfully logged in","success")
            localStorage.setItem('token',json.authtoken)
            // redirect karne ke liye usehistory(jo aab useNavigate hogya hai) hook ka use karunga
            history("/")
        }
        else{
            props.showAlert("Failed to login","danger");
        }
        console.log(json);
    }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            name="email"
            id="email"
            value={credentials.email}
            onChange={onChange}
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            value={credentials.password}
            onChange={onChange}
            id="password"
            name="password"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
