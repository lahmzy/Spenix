import React from 'react';
import {useState,useEffect} from "react";
import {useParams} from "react-router-dom";
import {client} from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from './Spinner';
import { feedQuery, searchQuery } from '../utils/data';


const Feed = () => {
  const [loading,setLoading] = useState(true)
  const [pins,setPins] = useState(null)
  const {categoryId} = useParams();

  useEffect( () => {
    
    if(categoryId){
      const query = searchQuery(categoryId);
      client.fetch(query)
      .then((data)=>{
        console.log(data)
        setPins(data)
        setLoading(false)
      })
    }else {
      const pinsData = async() =>{
        const data = await client.fetch(feedQuery)
        setPins(data)
        setLoading(false)
     }
  
     pinsData()      
    }
    
      
  //   


  },[categoryId])
  
 if(loading) return <Spinner message="We are adding new ideas to your feed!" />

 if(!pins?.length) return <div className='flex font-semibold mt-11 min items-center md:mt-20 w-full justify-center'>No pins available</div>

 return (
  <div>
    {console.log(pins)}
    {pins && <MasonryLayout pins={pins}/>}
  </div>
)
}

export default Feed