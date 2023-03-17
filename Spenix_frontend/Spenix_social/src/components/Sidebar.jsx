import React from 'react';
import {Link,NavLink} from "react-router-dom";
import {RiHomeFill} from "react-icons/ri";
import {IoIosArrowForward} from "react-icons/io"
import logo from "../assets/logo.png"
import { categories } from '../utils/data';

const isNotActiveStyle = "flex items-center px-5 gap-3 hover:text-black text-gray-500 transition-all duration-200 ease-in-out capitalize"
const isActiveStyle = "flex px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize"


const Sidebar = ({user,closeToggle}) => {

  const handleCloseSidebar = () => {
    if(closeToggle)
    closeToggle(false)
  }



  return (
    <div className='flex flex-col justify-between overflow-y-scroll min-w-210 bg-white h-full'>
      <div className='flex flex-col'>
        <Link
        to="/"
        className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'
        onClick={handleCloseSidebar}
        >
          <img src={logo} className="w-full"/>
        </Link>
        <div>
          <NavLink
            to="/"
            className={({isActive}) => isActive ? isActiveStyle : isNotActiveStyle}
            onClick={handleCloseSidebar}
          >
            <RiHomeFill />
            Home
          </NavLink> 
          <h3 className='mt-2 px-5 text-base 2xl:text-xl'>Discover categories</h3>
          {categories.slice(0,categories.length-1).map( (category) => {
           return(
            <NavLink key={category.name} className={({isActive}) => isActive ? isActiveStyle : isNotActiveStyle} 
              to={`/category/${category.name}`}
              onClick={handleCloseSidebar}
              >
              <img className='h-8 w-8 rounded-full shadow-sm object-cover' src={category.image} />
              {category.name}
           </NavLink>
           )
          })}
        </div>
      </div>
      {user && (
        <Link
          to={`user-profile/$(user._id)`}
          className=" w-14 flex my-5 mb-3 h-14 mx-3 items-center shadow-lg bg-white gap-3 p-2 rounded-lg"
          onClick={handleCloseSidebar}
        >
          <img className= "rounded-full" src ={user.image} />
          <p>{user.userName}</p>
        </Link>
      )
      }
    </div>
  )
}

export default Sidebar