import postMessage from "../models/postMessage.js";
import Mongoose from "mongoose";

//getPost start
export const getPosts = async (req, res) => {
  try {
    const postMessages = await postMessage.find();

    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message, error: error });
  }
};
//getPost end

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
