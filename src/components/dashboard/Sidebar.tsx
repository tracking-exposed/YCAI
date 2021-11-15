import {
  List,
  ListItem,
  makeStyles,
  Typography,
  useTheme,
} from '@material-ui/core';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CurrentView, doUpdateCurrentView } from 'utils/location.utils';
import { UserProfileBox } from './UserProfileBox';
import LabIcon from '../common/icons/LabIcon';
import AnalyticsIcon from '../common/icons/AnalyticsIcon';
import SettingsIcon from '../common/icons/SettingsIcon';

const useStyles = makeStyles((theme) => ({
  routesList: {
    marginTop: 100,
  },
  listItem: {
    color: theme.palette.primary.main,
  },
  listItemSelected: {
    color: theme.palette.violet.contrastText,
    backgroundColor: `${theme.palette.violet.dark}`,
    '&:hover': {
      backgroundColor: `${theme.palette.violet.dark}`,
      opacity: 0.6,
    },
  },
  listItemIcon: {
    marginRight: 20,
  },
}));

interface SidebarProps {
  currentView: CurrentView;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  return (
    <div style={{ height: '100%' }}>
      <img
        alt="YCAI Logo"
        src="/ycai-logo.png"
        style={{ width: '100%', marginBottom: 50 }}
        onClick={() => {
          void doUpdateCurrentView({ view: 'index' })();
        }}
      />
      <UserProfileBox />
      <List className={classes.routesList}>
        <ListItem
          className={
            currentView.view === 'lab' || currentView.view === 'labEdit'
              ? classes.listItemSelected
              : classes.listItem
          }
          button={true}
          onClick={doUpdateCurrentView({ view: 'lab' })}
        >
          <LabIcon
            className={classes.listItemIcon}
            color={
              currentView.view === 'lab' || currentView.view === 'labEdit'
                ? theme.palette.common.white
                : theme.palette.primary.main
            }
          />
          <Typography>{t('routes:lab_title_short')}</Typography>
        </ListItem>
        <ListItem
          className={
            currentView.view === 'statistics'
              ? classes.listItemSelected
              : classes.listItem
          }
          button={true}
          onClick={doUpdateCurrentView({ view: 'statistics' })}
        >
          <AnalyticsIcon
            className={classes.listItemIcon}
            color={
              currentView.view === 'statistics'
                ? theme.palette.common.white
                : theme.palette.primary.main
            }
          />
          <Typography>{t('routes:statistics')}</Typography>
        </ListItem>
        <ListItem
          className={
            currentView.view === 'settings'
              ? classes.listItemSelected
              : classes.listItem
          }
          button={true}
          onClick={doUpdateCurrentView({ view: 'settings' })}
        >
          <SettingsIcon
            className={classes.listItemIcon}
            color={
              currentView.view === 'settings'
                ? theme.palette.common.white
                : theme.palette.primary.main
            }
          />
          <Typography>{t('routes:settings')}</Typography>
        </ListItem>
      </List>
    </div>
  );
};
