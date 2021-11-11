import { Grid } from '@material-ui/core';
import { YTVideo } from 'components/common/YTVideo';
import * as React from 'react';
import AddRecommendationBox from '../AddRecommendationBox';
import { VideoRecommendations } from '../VideoRecommendationsEdit';

interface LabVideoEditProps {
  videoId: string;
}

export const LabVideoEdit: React.FC<LabVideoEditProps> = ({
  videoId,
}) => {

  return (
    <Grid container spacing={3} alignItems="flex-start">
      <Grid container item xs={7} spacing={3}>
        <Grid item xs={12}>
          <YTVideo videoId={videoId} />
        </Grid>
        <Grid item xs={12}>
          <AddRecommendationBox videoId={videoId} />
        </Grid>
      </Grid>
      <Grid item xs={5}>
        <VideoRecommendations
          queries={{ videoRecommendations: { videoId } }}
          videoId={videoId}
        />
      </Grid>
    </Grid>
  );
};
