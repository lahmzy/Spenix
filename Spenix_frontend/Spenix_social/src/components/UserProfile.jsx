import React, { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider,googleLogout } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";

import {
  userCreatedPinsQuery,
  userSavedPinsQuery,
  userQuery,
} from "../utils/data";
import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const randomImage = "https://source.unsplash.com/random/?nature/1900x600";

const activeBtnStyle =
  "bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none";
const notActiveBtnStyle =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none";

const UserProfile = ({}) => {
  const [user, setUser] = useState(null);
  const [pin, setPin] = useState(null);
  const [text, setText] = useState("created");
  const [activeBtn, setActiveBtn] = useState("");

  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);

    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  useEffect(() => {
    if (text === "created") {
      const CreatedPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(CreatedPinsQuery).then((data) => {
        console.log(data);
        setPin(data);
      });
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery).then((data) => {
        setPin(data);
        console.log(data);
      });
    }
  }, [text, userId]);

  const logOut = () => {
    googleLogout()
    setUser({});
    localStorage.clear();
    navigate("/login");
  };

  if (!user) {
    return <Spinner message="Loading userProfile..." />;
  }

  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_REACT_APP_GOOGLE_API_TOKEN}
    >
      <div className="relative pb-2 h-full justify-center items-center">
        <div className="flex flex-col pb-5">
          <div className="relative flex flex-col mb-7">
            <div className="flex flex-col justify-center items-center">
              <img
                src={randomImage}
                className="w-full h-370 2xl:h-510 shadow-lg object-cover"
                alt="nature image"
              />
              <img
                className="rounded-full w-20 h-20 -mt-10 object-cover"
                src={user?.image}
              />
              <h1 className="font-bold text-3xl text-center mt-3">
                {user.userName}
              </h1>
              <div className="absolute top-0 right-0 p-2 z-1">
                {userId === user?._id && <FcGoogle onClick={logOut} />}
              </div>
              <div className="text-center mb-7">
                <button
                  type="button"
                  onClick={(e) => {
                    setText(e.target.textContent);
                    setActiveBtn("created");
                  }}
                  className={`${
                    activeBtn === "created" ? activeBtnStyle : notActiveBtnStyle
                  }`}
                >
                  created
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    setText(e.target.textContent);
                    setActiveBtn("saved");
                  }}
                  className={`${
                    activeBtn === "saved" ? activeBtnStyle : notActiveBtnStyle
                  }`}
                >
                  saved
                </button>
              </div>

              {pin?.length ? (
                <div className="px-2">
                  <MasonryLayout pins={pin} />
                </div>
              ) : (
                <div className="flex justify-center items-center font-bold w-full text-xl mt-2">
                  No pins found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default UserProfile;
