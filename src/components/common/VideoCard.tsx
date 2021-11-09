import React from 'react';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Link,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/styles';

import { useTranslation } from 'react-i18next';

import { getYTMaxResThumbnailById } from '../../utils/yt.utils';
import { YCAITheme } from '../../theme';

interface VideoCardProps {
  videoId: string;
  title: string;
  openRecommendations: () => void;
}

const useStyles = makeStyles<YCAITheme>(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    '& .MuiCardContent-root': {
      flexGrow: 1,
    }
  },
}));

export const VideoCard: React.FC<VideoCardProps> = ({
  videoId,
  title,
  openRecommendations,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardMedia
          component="img"
          src={getYTMaxResThumbnailById(videoId)}
          title={title}
        />
      <CardContent>
        <Link
          color="textPrimary"
          href={'https://youtu.be/' + videoId}
          rel="noreferrer"
          target="_blank"
          underline="none"
          variant="subtitle1"
        >
          {title}
        </Link>
      </CardContent>
      <CardActions>
        <Button
          color="secondary"
          size="small"
          variant="outlined"
          onClick={openRecommendations}
        >
          {t('actions:manage_recommendations')}
        </Button>
      </CardActions>
    </Card>
  );
};
