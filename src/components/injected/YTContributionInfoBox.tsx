import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import * as QR from 'avenger/lib/QueryResult';
import { WithQueries } from 'avenger/lib/react';
import * as React from 'react';
import { ErrorBox } from '../../components/common/ErrorBox';
import { LazyFullSizeLoader } from '../../components/common/FullSizeLoader';
import { Keypair, Settings } from '../../models/Settings';
import * as dataDonation from '../../providers/dataDonation.provider';
import { keypair, settingsRefetch } from '../../state/public.queries';
import { YCAITheme } from '../../theme';

const useStyles = makeStyles<YCAITheme>((props) => ({
  root: {
    display: 'flex',
    border: `2px solid ${props.palette.primary.main}`,
    borderRadius: 3,
    backgroundColor: props.palette.common.white,
    width: '100%',
    height: '100%',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    margin: 0,
  },
}));

const YTContributionInfoBoxComponent: React.FC<{
  keypair: Keypair;
  settings: Settings;
}> = ({ keypair, settings }) => {
  const classes = useStyles();
  const [state, setState] = React.useState<dataDonation.ContributionState>({
    type: 'idle',
  });

  React.useEffect(() => {
    dataDonation.boot(settings, keypair, setState);
    return () => {
      dataDonation.clear(keypair);
    };
  }, [settings]);

  if (state.type === 'idle') {
    return null;
  }

  return (
    <Box className={classes.root}>
      {state.type === 'video-seen' ? (
        <Typography className={classes.label} variant="h5">
          Video seen...
        </Typography>
      ) : state.type === 'video-sent' ? (
        <Typography className={classes.label} variant="h5">
          Video sent!
        </Typography>
      ) : state.type === 'adv-seen' ? (
        <Typography className={classes.label} variant="h5">
          ADV seen...
        </Typography>
      ) : (
        <Typography className={classes.label} variant="h5">
          ADV sent...
        </Typography>
      )}
    </Box>
  );
};

export const YTContributionInfoBox: React.FC = () => {
  return (
    <WithQueries
      queries={{ keypair, settings: settingsRefetch }}
      render={QR.fold(LazyFullSizeLoader, ErrorBox, ({ keypair, settings }) => {
        if (settings !== null) {
          return (
            <YTContributionInfoBoxComponent
              keypair={keypair}
              settings={settings}
            />
          );
        }
        return null;
      })}
    />
  );
};
