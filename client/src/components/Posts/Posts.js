import React from "react";
import { useSelector } from "react-redux";
import { Grid, CircularProgress } from "@material-ui/core";

import Post from "./Post/Post";
import useStyles from "./styles";
const Posts = ({ setcurrentID }) => {
  const { posts, isLoading } = useSelector((state) => state.posts);
  console.log(
    "useSelectoor",
    useSelector((state) => state.posts)
  );

  const classes = useStyles();
  if (!posts.length && !isLoading) return "No Posts";
  return isLoading ? (
    <CircularProgress />
  ) : (
    <Grid
      className={classes.mainContainer}
      container
      alignItems="stretch"
      spacing={3}
    >
      {posts?.map((post) => (
        <Grid key={post._id} item xs={12} sm={6} lg={3}>
          <Post post={post} setcurrentID={setcurrentID} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Posts;
