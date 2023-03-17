import React from 'react';
import {BallTriangle} from "react-loader-spinner";

const Spinner = ({message}) => {
  return (
    <div className='flex flex-col justify-center items-center'>
        <BallTriangle 
            type= "Circles"
            color="#000fff"
            height={50}
            width={200}
        />
        <p className='text-lg mt-3 px-2 text-center'>{message}</p>
    </div>
  )
}

export default Spinner;