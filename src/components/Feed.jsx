import React, { useEffect, useState } from "react";
import { fetchPosts, createPost } from "../api";
import PostItem from "./PostItem";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await fetchPosts();
      setPosts(data.reverse());
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newPost = {
      username: "Anonymous", // Replace with actual user context later
      content: content.trim(),
    };

    try {
      setPosting(true);
      await createPost(newPost);
      setContent("");
      await loadPosts();
    } catch (err) {
      console.error("Failed to create post:", err);
      setError("Could not post. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="feed-container" style={{ padding: "1rem" }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <label htmlFor="postContent" style={{ display: "block", marginBottom: "0.5rem" }}>
          Write a post:
        </label>
        <textarea
          id="postContent"
          rows="3"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        ></textarea>
        <br />
        <button type="submit" disabled={!content.trim() || posting}>
          {posting ? "Posting..." : "Post"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        posts.length > 0 ? (
          posts.map((post) => <PostItem key={post.id} post={post} />)
        ) : (
          <p>No posts yet.</p>
        )
      )}
    </div>
  );
};

export default Feed;
