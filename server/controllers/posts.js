import postMessage from "../models/postMessage.js";
import Mongoose from "mongoose";

//getPosts start
export const getPosts = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 8;
    const currPage = Number(page);
    const startIndex = (currPage - 1) * LIMIT; //get starting index of every page
    const total = await postMessage.countDocuments({});
    const posts = await postMessage
      .find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.status(200).json({
      data: posts,
      currentPage: currPage,
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message, error: error });
  }
};
//getPosts end

//getPost Start
export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await postMessage.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
//getPost End

//getPostsBySearch start
// export const getPostsBySearch = async (req, res) => {
//   const { searchQuery, tags } = req.query;
//   try {
//     const title = new RegExp(searchQuery, "i");
//     const posts = await postMessage.find({
//       $or: [{ title }, { tags: { $in: tags.split(",") } }],
//     });

//     res.status(200).json(posts);
//   } catch (error) {
//     res.status(404).json({ message: error.message, error: error });
//   }
// };

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, "i");

    const posts = await postMessage.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
//getPostsBySearch end

//createPost start
export const createPost = async (req, res) => {
  const post = req.body;
  const newPost = new postMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });
  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message, error: error });
  }
};

//createPost end

//updatePost start
export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  if (!Mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No Post with ID " + _id);

  try {
    const updatedPost = await postMessage.findByIdAndUpdate(
      _id,
      { ...post, _id },
      {
        new: true,
      }
    );
    res.json(updatedPost);
  } catch (error) {
    res.status(409).json({ message: error.message, error: error });
  }
};
//updatePost end

//deletePost start
export const deletePost = async (req, res) => {
  const { id } = req.params;
  const post = req.body;

  if (!Mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No Post with ID " + id);

  try {
    await postMessage.findByIdAndRemove(id);
    res.json({ message: "Post Deleted Successfully" });
  } catch (error) {
    res.status(409).json({ message: error.message, error: error });
  }
};
//deletePost end

//likePost start
export const likePost = async (req, res) => {
  const { id } = req.params;
  if (!req.userId) return res.json({ message: "Unauthenticated User." });

  if (!Mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No Post with ID " + id);

  try {
    const post = await postMessage.findById(id);
    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await postMessage.findByIdAndUpdate(id, post, {
      new: true,
    });
    res.json(updatedPost);
  } catch (error) {
    res.status(409).json({ message: error.message, error: error });
  }
};
//likePost end

//add comment to post start
export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  const post = await postMessage.findById(id);
  post.comments.push(value);

  const updatedPost = await postMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.json(updatedPost);
};
//add comment to post end
