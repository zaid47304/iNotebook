import React ,{useState}from "react";
//use history (now useNavigate is used to redirect user)
import { useNavigate } from "react-router-dom";
const Signup = (props) => {
  const [credentials, setcredentials] = useState({name:"", email: "", password: "",cpassword:""});
  const onChange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  let history = useNavigate();
  const handleSubmit = async (e) => {
    // to prevent page from reloading
    e.preventDefault();
    const {name,email,password}=credentials;
    const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name,email,password}),
    });
    const json = await response.json();
    if (json.success) {
      // redirect to user page containing notes
      // save the auth-token and redirect
      props.showAlert("Successfully signed up","success")
      localStorage.setItem("token", json.authtoken);
      // redirect karne ke liye usehistory(jo aab useNavigate hogya hai) hook ka use karunga
      history("/");
    } else {
      props.showAlert("Failed to login","danger");
    }
    console.log(json);
  };
  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            onChange={onChange}
            aria-describedby="emailHelp"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            onChange={onChange} minLength={5} required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="cpassword"
            name="cpassword"
            onChange={onChange} minLength={5} required />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
