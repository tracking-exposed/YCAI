import {
  Divider,
  FormControlLabel,
  FormLabel,
  Switch,
  Typography,
} from '@mui/material';

import { SxProps } from '@mui/system';

import { makeStyles } from '@mui/styles';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import * as models from '../../models';
import { generateKeypair, updateSettings } from '../../state/public.commands';

import { YCAITheme } from '../../theme';

const useStyles = makeStyles<YCAITheme>((theme) => ({
  marginRight: {
    marginRight: theme.spacing(2),
  },
}));

interface SettingsProps {
  settings: models.Settings.Settings;
}

const Settings: React.FC<SettingsProps> = ({ settings }) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const controlLabel: SxProps<YCAITheme> = (theme) => ({
    alignItems: 'flex-start',
    marginLeft: 0,
    marginRight: 0,
    marginBottom: theme.spacing(2),
  });

  return (
    <>
      <FormControlLabel
        sx={controlLabel}
        disabled={!settings.active}
        control={
          <Switch
            className={classes.marginRight}
            aria-labelledby="switch-recommendations"
            color="primary"
            checked={settings.enhanceYouTubeExperience}
            onChange={(e, checked) =>
              updateSettings({ ...settings, enhanceYouTubeExperience: checked })()
            }
          />
        }
        label={
          <FormLabel>
            <Typography variant="h5">
              {t('settings:contentCreatorRecommendationLabel')}
            </Typography>
            <Typography display="block">
              {t('settings:contentCreatorRecommendationHint')}
            </Typography>
            <br />
            <Divider light />
            <br />
            <br />
          </FormLabel>
        }
        labelPlacement="end"
      />

      <FormControlLabel
        sx={controlLabel}
        disabled={!settings.active}
        control={
          <Switch
            className={classes.marginRight}
            aria-labelledby="switch-independentContributions"
            color="primary"
            checked={settings.independentContributions.enable}
            onChange={(e, enable) => {
              if (enable) {
                void generateKeypair({})();
              }

              void updateSettings({
                ...settings,
                independentContributions: {
                  ...settings.independentContributions,
                  enable,
                },
              })();
            }}
          />
        }
        label={
          <FormLabel>
            <Typography variant="h5">
              {t('settings:contributeToIndependentStatsLabel')}
            </Typography>
            <Typography display="block">
              {t('settings:contributeToIndependentStatsHint')}
            </Typography>
            <br />
            <Divider light />
          </FormLabel>
        }
        labelPlacement="end"
      />
    </>
  );
};

export default Settings;
