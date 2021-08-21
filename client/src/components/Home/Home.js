import React, { useState } from "react";
import Form from "../Form/Form";
import SearchForm from "../Form/SearchForm";
import Posts from "../Posts/Posts";
import Pagination from "../Pagination";

import { useLocation } from "react-router-dom";

import useStyles from "./styles";

import { Grow, Container, Grid, Paper } from "@material-ui/core";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const [currentID, setcurrentID] = useState(null);
  const query = useQuery();
  const page = query.get("page") || 1;
  const classes = useStyles();

  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid
          container
          justifyContent="space-between"
          alignItems="stretch"
          spacing={3}
          className={classes.gridContainer}
        >
          <Grid item xs={12} sm={6} md={9}>
            <Posts setcurrentID={setcurrentID} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <SearchForm />
            <Form currentID={currentID} setcurrentID={setcurrentID} />
            <Paper elevation={6}>
              <Pagination page={page} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;
