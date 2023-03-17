
import React from "react"
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin,googleLogout } from '@react-oauth/google';
import {useNavigate} from "react-router-dom";
import {FcGoogle} from "react-icons/fc";
import shareVideo from "../assets/share.mp4"
import logo from "../assets/logowhite.png";
import jwt_decode from "jwt-decode";
import {client} from "../client";



const Login = () => {

  const navigate = useNavigate()
  const responseGoogle = async (response) => {
     const decoded = jwt_decode(response.credential)
     localStorage.setItem("user",JSON.stringify(decoded))
     console.log(decoded)
     const {name,picture,sub} = decoded;

    
      
     const doc = {
      _id: sub,
      _type:"user",
      userName: name,
      image:picture
     }

     client.createIfNotExists(doc)
     .then( ()=> {
      navigate("/")
     })
  }
  
  return (
   <GoogleOAuthProvider clientId={import.meta.env.VITE_REACT_APP_GOOGLE_API_TOKEN}>
      <div className='flex justify-start items-center flex-col h-screen'>
        <div className='relative w-full h-full'>
          <video
            src={shareVideo}
            type="video/mp4"
            loop
            controls={false}
            autoPlay
            className='w-full h-full object-cover'
          />
          <div className='absolute left-0 right-0 top-0 bottom-0 flex flex-col items-center justify-center bg-blackOverlay'>
            <div className='p-5'>
              <img src={logo} width="130px" alt='logo' />
            </div>
            <div className='shadow-2xl'>
            
                <GoogleLogin 
                  onSuccess={responseGoogle}
                  onError={() => console.log("error")}
                  
                />
            
            </div>
          </div>
        </div>
      </div>
   </GoogleOAuthProvider>
  )
}

export default Login