import React from 'react'
import './LoginSignup.css'

import user_icon from '..Assets/person.png'
import email_icon from '..Assets/email.png'
import password_icon from '..Assets/password.png'  
import student_icon from '..Assets/extra.png'


const LoginSignup = () => {

  const[action, setAction] = useState("Sign Up");
  return (
    <div className='container' >
      <div className="header">
        <div className="text">{action}</div>
        <div className="Underline"></div>
      </div>
      <div className="inputs">
        {action==="Login"?<div></div>:<div className="input">
         <img src={user_icon} alt='' />
         <input type="text" placeholder='Name'/>
        
          </div>}

        <div className="input">
         <img src={email_icon} alt='' />
         <input type="email" placeholder='Email'/>
        </div>

        <div className="input">
         <img src={password_icon} alt='' />
         <input type="password" placeholder='password'/>
        </div>

        <div className="input">
         <img src={student_icon} alt='' />
         <input type="student id" placeholder='student id '/>
        </div>

      </div>
      {action==="Sign Up"?<div></div>: <div className='forgot-password'> Forgot Password? <span>Click here!</span></div>}
     
      <div className='Submit-container'>
      <div className={action==="Login" ?"submit gray":"submit "} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
      <div className={action==="Sign Up"?"submit gray":"submit"} onClick={()=>{setAction("Login")}}>Login</div>  
      </div>
    </div>
  )
}

export default LoginSignup 