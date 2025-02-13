import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/LoginSignup.css";

import user_icon from "../assets/person.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import student_icon from "../assets/security.png";

const LoginSignup = () => {
  const [action, setAction] = useState("Sign Up");
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentID, setStudentID] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Toggle between Sign Up and Login
  const toggleAction = () => {
    setAction(action === "Sign Up" ? "Login" : "Sign Up");
  };

  // Handle File Upload
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(file); // Store file for form submission
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Login & Signup Requests
  const handleSubmit = async () => {
    try {
      if (action === "Sign Up") {
        const response = await axios.post("http://localhost:3000/api/register", {
          name,
          role,
          email,
          password,
        });

        alert(response.data.message);
        toggleAction(); // Switch to login after successful signup
      } else {
        const response = await axios.post("http://localhost:3000/api/login", {
          email,
          password,
        });

        if (response.data.token) {
          localStorage.setItem("token", response.data.token); // Store JWT token
          alert("Login successful!");
          navigate("/Mainpage"); // Redirect to Mainpage
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="Underline"></div>
      </div>
      <div className="inputs">
        
        {/* Profile Image Upload */}
        <div className="image-upload">
          <label htmlFor="file-input" className="image-label">
            <img src={image ? URL.createObjectURL(image) : user_icon} alt="Profile" className="profile-pic" />
          </label>
          <input id="file-input" type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
        </div>

        {action === "Sign Up" && (
          <>
            <div className="input">
              <img src={user_icon} alt="" />
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="input">
              <img src={student_icon} alt="" />
              <input type="text" placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} required />
            </div>
            <div className="input">
              <img src={email_icon} alt="" />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </>
        )}

        {action === "Login" && (
          <div className="input">
            <img src={email_icon} alt="" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        )}

        <div className="input">
          <img src={password_icon} alt="" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
      </div>

      {action === "Sign Up" ? (
        <div className="Already-account">
          Already have an Account? <span onClick={toggleAction}>Click here!</span>
        </div>
      ) : (
        <>
          <div className="forgot-password"> Forgot Password? <span>Click here!</span></div>
          <div className="Donthave-account"> Don't have an Account? <span onClick={toggleAction}>Click here!</span></div>
        </>
      )}

      <div className="submit-container">
        <div className="submit" onClick={handleSubmit}>{action}</div>
      </div>
    </div>
  );
};

export default LoginSignup;
