import React from "react";
import { useState, useEffect } from "react";

import MasonryLayout from "./MasonryLayout";
import { client } from "../client";
import { feedQuery, searchQuery } from "../utils/data";
import Spinner from "./Spinner";

const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      setLoading(true);

      const query = searchQuery(searchTerm.toLowerCase());
      client.fetch(query)
      .then((res) => {
        setPins(res)
        setLoading(false)
        
      });
    } else {
      client.fetch(feedQuery)
      .then((data) => {
        setPins(data);
        setLoading(false)
        
      });
    }
  }, [searchTerm]);

  return (
    <div>
      {loading && <Spinner message="searching for pins" />}
      {pins?.length !== 0 && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== "" && !loading && (
        <div className="mt-10 text-center text-xl">No pins</div>
      )}
      
    </div>
  );
};

export default Search;
