import { Grid, Typography } from '@material-ui/core';
import { YTVideo } from 'components/common/YTVideo';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Fetcher from '../Fetcher';
import { Recommendations } from '../Recommendations';
import { VideoRecommendations } from '../VideoRecommendationsEdit';

interface StudioVideoEditProps {
  videoId: string;
}

export const StudioVideoEdit: React.FC<StudioVideoEditProps> = ({
  videoId,
}) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={3}>
      <Grid item md={8}>
        <Typography variant="h4">{t('account:channelVideos')}</Typography>
        <YTVideo videoId={videoId} />
        <Fetcher />
        <Recommendations />
      </Grid>
      <Grid item md={4}>
        <VideoRecommendations queries={{ videoRecommendations: { videoId } }} />
      </Grid>
    </Grid>
  );
};
