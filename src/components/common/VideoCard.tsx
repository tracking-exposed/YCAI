import React, {
  useState,
} from 'react';

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Link,
  MenuList,
  MenuItem,
  Popover,
} from '@material-ui/core';

import {
  MoreVert,
} from '@material-ui/icons';

import { makeStyles } from '@material-ui/styles';

import { useTranslation } from 'react-i18next';

import { getYTMaxResThumbnailById } from '../../utils/yt.utils';
import { YCAITheme } from '../../theme';

interface VideoCardProps {
  videoId: string;
  title: string;
  openRecommendations: () => void;
}

const useStyles = makeStyles<YCAITheme>(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    '& .MuiCardContent-root': {
      flexGrow: 1,
    }
  },
}));

export const VideoCard: React.FC<VideoCardProps> = ({
  videoId,
  title,
  openRecommendations,
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handlePopoverOpen: (e: React.MouseEvent<HTMLButtonElement>) => void = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handlePopoverClose: () => void = () => {
    setAnchorEl(null);
  };

  const popoverIsOpen = Boolean(anchorEl);

  return (
    <Card className={classes.root}>
      <CardMedia
          component="img"
          src={getYTMaxResThumbnailById(videoId)}
          title={title}
        />
      <CardContent>
        <Link
          color="textPrimary"
          href={'https://youtu.be/' + videoId}
          rel="noreferrer"
          target="_blank"
          underline="none"
          variant="subtitle1"
        >
          {title}
        </Link>
      </CardContent>
      <Box display="flex" alignItems="center">
        <Box flexGrow={1}>
          <CardActions>
            <Button
              color="secondary"
              size="small"
              variant="outlined"
              onClick={openRecommendations}
            >
              {t('actions:manage_recommendations')}
            </Button>
          </CardActions>
        </Box>
        <Box>
          <IconButton
            color="secondary"
            onClick={handlePopoverOpen}
          >
            <MoreVert />
          </IconButton>
          <Popover
            open={popoverIsOpen}
            anchorEl={anchorEl}
            disableScrollLock
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
          >
            <MenuList dense>
              <MenuItem>
                <Link
                  color="textSecondary"
                  href={'https://youtube.tracking.exposed/compare/#' + videoId}
                  onClick={handlePopoverClose}
                  rel="noreferrer"
                  target="_blank"
                  underline="none"
                >
                  {t('actions:compare')}
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  color="textSecondary"
                  href={'https://youtube.tracking.exposed/related/#' + videoId}
                  onClick={handlePopoverClose}
                  rel="noreferrer"
                  target="_blank"
                  underline="none"
                >
                  {t('actions:related')}
                </Link>
              </MenuItem>
            </MenuList>
          </Popover>
        </Box>
      </Box>
    </Card>
  );
};
