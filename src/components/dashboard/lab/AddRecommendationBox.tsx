import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
} from '@mui/material';

import {
  Add as AddIcon,
} from '@mui/icons-material';

import { makeStyles } from '@mui/styles';

import { addRecommendationForVideo } from '../../../state/creator.commands';
import { YCAITheme } from '../../../theme';

interface AddRecommendationBoxProps {
  videoId: string;
}

const useStyles = makeStyles<YCAITheme>((theme) => ({
  root: {
    backgroundColor: theme.palette.grey[300],
  },
  textField: {
    position: 'relative',
    flexGrow: 1,
    '& .MuiOutlinedInput-root': {
      backgroundColor: theme.palette.background.default,
    },
    '& textarea': {
      color: theme.palette.text.secondary,
    },
    '& p': {
      bottom: '-1rem',
      position: 'absolute',
    }
  },
  addButton: {
    marginLeft: theme.spacing(2),
    color: theme.palette.common.black,
    fontWeight: 'bold',
  },
}));

const AddRecommendationBox: React.FC<AddRecommendationBoxProps> = ({ videoId }) => {
  const { t } = useTranslation();
  const [recommendationURL, setRecommendationURL] = React.useState('');
  const classes = useStyles();

  const onAddClick = async (): Promise<void> => {
    void addRecommendationForVideo({
      videoId, recommendationURL,
    }, {
      videoRecommendations: { videoId },
    })();
    setRecommendationURL('');
  };

  return (
      <Card className={classes.root}>
        <CardContent>
          <Typography
            color="textSecondary"
            component="h2"
            variant="h5"
          >
            {t('recommendations:add_to_video')}
            <AddIcon fontSize="large"/>
          </Typography>
          <Box display="flex" alignItems="center">
            <TextField
              className={classes.textField}
              label={t('recommendations:url')}
              placeholder={t('recommendations:url_placeholder')}
              helperText={t('recommendations:url_helper_text')}
              multiline
              value={recommendationURL}
              onChange={(v) => setRecommendationURL(v.target.value)}
              color="primary"
            />
            <Button
              className={classes.addButton}
              variant="contained"
              color="primary"
              onClick={onAddClick}
            >
              {t('actions:add')}
            </Button>
          </Box>
        </CardContent>
      </Card>
  );
};

export default AddRecommendationBox;
