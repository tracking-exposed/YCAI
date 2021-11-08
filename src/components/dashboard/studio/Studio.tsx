import * as React from 'react';
import { doUpdateCurrentView } from '../../../utils/location.utils';
import { CreatorVideos } from '../CreatorVideos';

export const Studio: React.FC = () => {
  return (
    <CreatorVideos
      openVideoRecommendations={async (v) => {
        await doUpdateCurrentView({
          view: 'studioEdit',
          videoId: v.videoId,
        })();
      }}
    />
  );
};
