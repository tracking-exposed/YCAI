import { Box, makeStyles, Typography } from '@material-ui/core';
import * as QR from 'avenger/lib/QueryResult';
import { declareQueries } from 'avenger/lib/react';
import { ErrorBox } from 'components/common/ErrorBox';
import { LazyFullSizeLoader } from 'components/common/FullSizeLoader';
import { pipe } from 'fp-ts/lib/pipeable';
import { Keypair } from 'models/Settings';
import * as React from 'react';
import { keypair, settings } from 'state/public.queries';
import * as dataDonation from '../../providers/dataDonation.provider';

const useStyles = makeStyles((props) => ({
  root: {
    display: 'flex',
    border: `2px solid ${props.palette.primary.main}`,
    borderRadius: 3,
    backgroundColor: props.palette.common.white,
    width: '100%',
    height: '100%',
  },
}));

const YTContributionInfoBoxComponent: React.FC<{ keypair: Keypair }> = ({
  keypair,
}) => {
  const classes = useStyles();
  const [state, setState] = React.useState<dataDonation.ContributionState>({
    type: 'loading',
  });

  React.useEffect(() => {
    dataDonation.boot(keypair, setState);

    return () => {
      window.addEventListener('beforeunload', () => {
        dataDonation.clear();
      });
    };
  }, []);

  if (state.type === 'loading') {
    return null;
  }

  return (
    <Box className={classes.root}>
      {state.type === 'seen' ? (
        <Typography variant="h5">Video seen</Typography>
      ) : (
        <Typography variant="h5">Fetching...</Typography>
      )}
    </Box>
  );
};

const withQueries = declareQueries({ keypair: keypair, settings: settings });
export const YTContributionInfoBox = withQueries(({ queries }) => {
  return pipe(
    queries,
    QR.fold(LazyFullSizeLoader, ErrorBox, ({ keypair, settings }) => {
      console.log(settings);
      if (settings.independentContributions) {
        return <YTContributionInfoBoxComponent keypair={keypair} />;
      }
      return null;
    })
  );
});
