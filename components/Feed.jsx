"use client";

import { useEffect, useState, useMemo } from "react";
import PromptCard from "./PromptCard";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [allPosts, setAllPosts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTimeout, setsearchTimeout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i");
    return allPosts.filter(
      (item) =>
        regex.test(item.prompt) ||
        regex.test(item.tag) ||
        regex.test(item.creator.email)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setsearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchResults(searchResult);
      }, 500)
    );
  };

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/prompt");
        const data = await response.json();
        setAllPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, []);

  const handleTagClick = (tagName) => {
    setSearchText(tagName); // Auto-fill the tag name into the search box
    const taggedPost = allPosts.filter((item) => item.tag === tagName);
    setSearchResults(taggedPost);
  };

  return (
    <section className="feed">
      <form action="" className="relative w-full flex-center">
        <input
          type="text"
          placeholder="search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <PromptCardList
          data={searchResults.length ? searchResults : allPosts}
          handleTagClick={handleTagClick}
        />
      )}
    </section>
  );
};

export default Feed;