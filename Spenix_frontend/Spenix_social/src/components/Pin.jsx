import React, { useState } from "react";
import { urlFor, client } from "../client";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { fetchUser } from "../utils/fetchUser";

const Pin = ({ pin }) => {
  const navigate = useNavigate();
  const [postHover, setPostHover] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const { image, _id, destination, postedBy, save } = pin;
  console.log(destination);

  console.log(save);

  const user = fetchUser();
  console.log(user);

  const alreadySaved = !!save?.filter((item) => item.postedBy?._id === user.sub)
    ?.length;

  const savePost = (id) => {
    if (!alreadySaved) {
      setSavingPost(true);

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user.sub,
            postedBy: {
              _type: "postedBy",
              _ref: user.sub,
            },
          },
        ])
        .commit()
        .then(() => {
          
          setSavingPost(false);
        });
    }
  };

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };

  return (
    <div className="m-2">
      <div
        onMouseOver={() => setPostHover((prev) => true)}
        onMouseLeave={() => setPostHover((prev) => !prev)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-md rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img
          className="rounded-lg w-full"
          alt="user-post"
          src={urlFor(image).width(250).url()}
        />
        {postHover && (
          <div
            className="absolute flex top-0 w-full h-full flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white hover:shadow-md outline-none hover:opacity-100 w-9 h-9 flex items-center justify-center rounded-full text-black opacity-75 text-xl"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <div>
                  <button
                    type="button"
                    className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                  >
                    {save?.length}Saved
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      savePost(_id);
                    }}
                  >
                    {savingPost ? "saving" : "save"}
                  </button>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {destination && (
                <div className="bg-white flex py-1 items-center px-4 rounded-full opacity-70 text-black font-bold hover:opacity-100 hover:shadow-md">
                  <a
                    href={`https://${destination}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <BsFillArrowUpRightCircleFill />
                  </a>
                  <h3 className="pl-1">
                    {destination.length > 20
                      ? destination.slice(12, 25)
                      : destination.slice(0)}
                  </h3>
                </div>
              )}
              {postedBy?._id === user?.sub && (
                <div className="bg-white opacity-70  hover:opacity-100 text-black font-bold px-4 py-2 flex items-center text-xl  rounded-3xl hover:shadow-md outline-none">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePin(_id);
                    }}
                  >
                    <AiTwotoneDelete />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        className="flex items-center gap-2 mt-2"
        to={`user-profile/${user?._id}`}
      >
        <img
          className="h-8 w-8 object-cover rounded-full"
          src={postedBy?.image}
          alt="user-profile"
        />
        <p className="font-semibold capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
