import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import UrlCard from './UrlCard';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

const styles = {
    width: '100%',
    textAlign: 'center',
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 960,
    backgroundColor: theme.palette.background.paper,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  section1: {
    margin: theme.spacing(3, 2),
  },
  section2: {
    margin: theme.spacing(2),
  },
  section3: {
    margin: theme.spacing(3, 1, 1),
  },
}));


export default function YCAInalitics() {

  const classes = useStyles();
  return (
      <Grid container alignItems="center">
        <Typography color="textSecondary" variant="body2">

            <h2>Which videos are recommended close to yours video?</h2>
            <Chip className={classes.chip}
              color="primary"
              label="Load video list" />
            <Chip className={classes.chip}
              color="secondary"
              label="Display recommended channels" />
            <Chip className={classes.chip}
              color="secondary"
              label="Display recommended videos" />

            <h2>Where your videos appears as recommended?</h2>
            <Chip className={classes.chip}
              color="primary"
              label="Load list" />

            <h2>Which advertising get served over your videos?</h2>
            <Chip className={classes.chip}
              color="primary"
              label="Load list" />

            <h2>Shadow-banning analysis</h2>
            <Chip className={classes.chip}
              color="primary"
              label="Load previous tests" />

        </Typography>
      </Grid>
  );
}