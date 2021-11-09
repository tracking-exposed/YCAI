import { Box, Typography } from '@material-ui/core';
import * as QR from 'avenger/lib/QueryResult';
import { declareQueries } from 'avenger/lib/react';
import { pipe } from 'fp-ts/lib/function';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { videoRecommendations } from '../../state/public.queries';
import { ErrorBox } from '../common/ErrorBox';
import { LazyFullSizeLoader } from '../common/FullSizeLoader';
import { InjectedRecommendationCard } from '../common/InjectedRecommendationCard';

const withQueries = declareQueries({ videoRecommendations });

export const VideoRecommendations = withQueries(
  ({ queries }): React.ReactElement => {
    const { t } = useTranslation();

    return pipe(
      queries,
      QR.fold(LazyFullSizeLoader, ErrorBox, ({ videoRecommendations }) => {
        return (
          <Box>
            <Typography variant="h5">
              {t('recommendations:by_creator_title')}
            </Typography>
            {videoRecommendations.map((video, i) => (
              <InjectedRecommendationCard key={video.urlId} {...video} />
            ))}
          </Box>
        );
      })
    );
  }
);
