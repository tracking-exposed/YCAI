import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  Button,
  FormControl,
  TextField,
  Typography,
} from '@material-ui/core';

import { addRecommendationForVideo } from '../../state/creator.commands';

interface AddRecommendationBoxProps {
  videoId: string;
}

const AddRecommendationBox: React.FC<AddRecommendationBoxProps> = ({ videoId }) => {
  const { t } = useTranslation();
  const [recommendationURL, setRecommendationURL] = React.useState('');

  const onAddClick = async (): Promise<void> => {
    void addRecommendationForVideo({
      videoId, recommendationURL,
    }, {
      videoRecommendations: { videoId },
    })();
    setRecommendationURL('');
  };

  return (
      <Card>
        <CardContent>
          <Typography component="h2" variant="h5" color="secondary">
            {t('recommendations:add_to_video')}
          </Typography>
          <FormControl>
            <TextField
              label={t('recommendations:url')}
              placeholder={t('recommendations:url_placeholder')}
              helperText={t('recommendations:url_helper_text')}
              multiline
              value={recommendationURL}
              onChange={(v) => setRecommendationURL(v.target.value)}
              color="secondary"
            />
            <Button variant="contained" color="secondary" onClick={onAddClick}>
              {t('actions:add')}
            </Button>
          </FormControl>
        </CardContent>
      </Card>
  );
};

export default AddRecommendationBox;
