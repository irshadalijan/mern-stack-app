import React, { useEffect, useState } from "react";
import Form from "../Form/Form";
import Posts from "../Posts/Posts";

import { useDispatch } from "react-redux";
import { getPosts } from "../../actions/posts";

import { Grow, Container, Grid } from "@material-ui/core";

export default function Home() {
  const [currentID, setcurrentID] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  return (
    <Grow in>
      <Container>
        <Grid
          container
          justifyContent="space-between"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12} sm={7}>
            <Posts setcurrentID={setcurrentID} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Form currentID={currentID} setcurrentID={setcurrentID} />
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
}
