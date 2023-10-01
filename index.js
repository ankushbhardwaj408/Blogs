const express = require("express");
const axios = require("axios");
const load = require("lodash");
const app = express();

const options = {
  method: "GET",
  headers: {
    "x-hasura-admin-secret":
      "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
  },
};

app.get("/api/blog-stats", async (req, res) => {
  try {
    //1. Data retrieval
    const response = await axios.get(
      "https://intent-kit-16.hasura.app/api/rest/blogs",
      options
    );
    const blogData = response.data.blogs;
    console.log(blogData);
    //2. Data Analysis
    const totalBlogs = blogData.length;

    const longestBlog = load.maxBy(blogData, (blog) => blog.title.length);
    const blogsWithPrivacy = load.filter(blogData, (blog) =>
      load.includes(load.toLower(blog.title), "privacy")
    );
    const uniqueBlogTitles = load.uniqBy(blogData, "title");
    //3. Response sent to client
    const stats = {
      totalBlogs: totalBlogs,
      longestBlogTitle: longestBlog.title,
      blogsWithPrivacy: blogsWithPrivacy.length,
      uniqueBlogTitles: load.map(uniqueBlogTitles, "title"),
    };
    res.json(stats);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});
//4. Blog search functionality
app.get("/api/blog-search", async (req, res) => {
  try {
    const response = await axios.get(
      "https://intent-kit-16.hasura.app/api/rest/blogs",
      options
    );
    const blogData = response.data.blogs;
    const q = req.query.query.toLowerCase();
    const blogs = load.filter(blogData, (blog) =>
      load.includes(load.toLower(blog.title), q)
    );

    res.json(blogs);
    //5. Error handling
  } catch (error) {
    res.status(500).send("Server Error");
  }
});
app.listen(3000);
module.exports = app;