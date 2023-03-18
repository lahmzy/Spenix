import React from "react";
import { useState, useEffect } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailQuery, pinDetailMorePinQuery } from "../utils/data";
import Spinner from "./Spinner";

const PinDetails = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetails] = useState(false);
  const [comment, setComments] = useState("");
  const [addingComments, setAddingComments] = useState(false);
  const { pinId } = useParams();

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  const addComment = () => {
    if(comment){
      setAddingComments(true);

      client
        .patch(pinId)
        .setIfMissing({comments: []})
        .insert("after","comments[-1]",[
          {
            comment:comment,
            _key:uuidv4(),
            postedBy:{
              _type:"postedBy",
              _ref:user._id
            }
          }
        ])
        .commit()
        .then( () => {
          fetchPinDetails();
          setComments("")
          setAddingComments(false)
          window.location.reload()
        })


    }
  }

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query).then((data) => {
        console.log(data[0]);
        setPinDetails(data[0]);

        if (data[0]) {
          query = pinDetailMorePinQuery(data[0]);
          client.fetch(query).then((res) => {
            console.log(res);
            setPins(res);
          });
        }
      });
    }
  };

  if (!pinDetail)
    return <Spinner message="Please wait, currrently fetching pinDetails" />;

  return (
    <>
    <div className="flex xl:flex-row flex-col m-auto bg-white rounded-[32px] max-w-[1500px]">
      <div className="justify-center items-center md:items-start flex-initial">
        <img
          src={pinDetail?.image && urlFor(pinDetail.image)}
          className="rounded-t-3xl rounded-b-lg w-full h-full"
        />
      </div>
      <div className="w-full flex flex-col p-5 flex-1 xl:min-w-620">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <a
              href={`${pinDetail?.image?.asset?.url}?dl=`}
              download
              onClick={(e) => e.stopPropagation()}
              className="bg-white hover:shadow-md outline-none hover:opacity-100 w-9 h-9 flex items-center justify-center rounded-full text-black opacity-75 text-xl"
            >
              <MdDownloadForOffline />
            </a>
          </div>
          <a
            href={`https://${pinDetail?.destination}`}
            target="_blank"
            rel="noreferer"
          >
            {pinDetail?.destination}
          </a>
        </div>
        <div>
          <h1 className="text-4xl font-bold break-words mt-3">
            {pinDetail.title}
          </h1>
          <p className="">{pinDetail.about}</p>
        </div>
        <Link
          className="flex items-center gap-2 bg-white mt-5 rounded-lg"
          to={`user-profile/${pinDetail.postedBy?._id}`}
        >
          <img
            className="h-8 w-8 object-cover rounded-full"
            src={pinDetail?.postedBy?.image}
            alt="user-profile"
          />
          <p className="font-semibold capitalize">
            {pinDetail?.postedBy?.userName}
          </p>
        </Link>
        <h2 className="mt-5 text-2xl">Comment</h2>
        <div className="max-h-370 overflow-y-auto">
          {pinDetail?.comments?.map((comment, index) => (
            <div className="flex gap-2 mt-5 items-center">
            {console.log(pinDetail)}
              <img
                src={comment.postedBy.image}
                alt="user-profile"
                className="w-10 h-10 rounded-full cursor-pointer"
              />
              <div className="flex flex-col">
                <p className="font-bold">{comment.postedBy.userName}</p>
                <p>{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center flex-row flex-wrap mt-6 gap-3">
          <Link to={`user-profile/${pinDetail.postedBy?._id}`}>
            <img
              className="h-10 w-10  cursor-pointer rounded-full"
              src={pinDetail?.postedBy?.image}
              alt="user-profile"
            />
          </Link>
          <input
            className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
            type="text"
            placeholder="add a comment"
            value={comment}
            onChange={(e) => setComments(e.target.value)}
          />
          <button
            className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
            type="button"
            onClick={addComment}
          >
            {addingComments? "Posting the comment....": "posted"}
          </button>
        </div>
      </div>
    </div>
    {pins?.length > 0 ? (
      <div className="">
        <h2 className="text-center font-bold text-2xl mt-2">More like this</h2>
        <MasonryLayout pins={pins}/>
      </div>
      
    ) : (
      <Spinner message="Loading more pins" />
    )}
    </>
  );
};

export default PinDetails;
