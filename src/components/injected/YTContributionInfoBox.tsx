import { Box, Typography } from '@material-ui/core';
import * as QR from 'avenger/lib/QueryResult';
import { WithQueries } from 'avenger/lib/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ErrorBox } from '../../components/common/ErrorBox';
import { LazyFullSizeLoader } from '../../components/common/FullSizeLoader';
import { Keypair, Settings } from '../../models/Settings';
import * as dataDonation from '../../providers/dataDonation.provider';
import { keypair } from '../../state/public.queries';
import { makeStyles } from '../../theme';

const useStyles = makeStyles((props) => ({
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
  node: HTMLDivElement;
  keypair: Keypair;
  settings: Settings;
}> = ({ keypair, settings, node }) => {
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

  return ReactDOM.createPortal(
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
    </Box>,
    node
  );
};

export const YTContributionInfoBox: React.FC<{
  node: HTMLDivElement;
  settings: Settings;
}> = ({ node, settings }) => {
  return (
    <WithQueries
      queries={{ keypair }}
      render={QR.fold(LazyFullSizeLoader, ErrorBox, ({ keypair }) => {
        if (settings === null || !settings.independentContributions.enable) {
          return null;
        }
        return (
          <YTContributionInfoBoxComponent
            node={node}
            keypair={keypair}
            settings={settings}
          />
        );
      })}
    />
  );
};
