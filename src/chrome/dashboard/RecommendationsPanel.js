import React from 'react';
import Recommendations from './Recommendations';
import Fetcher from './Fetcher';
import { CreatorVideos } from './components/CreatorVideos';
import { CurrentVideoOnEdit } from './components/CurrentVideoOnEdit';
import { Grid } from '@material-ui/core';

const RecommendationsPanel = () => {

  const [currentVideo, setCurrentVideo] = React.useState(undefined);

  return (
    <Grid container spacing={3}>
      <Grid item md={4}>
        <h4>Your videos:</h4>
        <CreatorVideos onVideoClick={(v) => setCurrentVideo(v)} />
      </Grid>
      <Grid item md={4}>
        <Fetcher />
        <Recommendations />
      </Grid>
      <Grid item md={4}>
        <CurrentVideoOnEdit video={currentVideo} />
      </Grid>
    </Grid>
  );
};

export default RecommendationsPanel;
