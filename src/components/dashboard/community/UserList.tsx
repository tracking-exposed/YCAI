import React from 'react';

import { ContentCreator } from '@backend/models/ContentCreator';
import { Avatar, List, ListItem, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { deepOrange } from '@mui/material/colors';
import { YCAITheme } from '../../../theme';
interface UserListProps {
  users: ContentCreator[];
  onUserClick: (u: ContentCreator) => void;
}

const useStyles = makeStyles<YCAITheme>((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  channelLink: {
    fontSize: "1.1rem",
    textDecoration: "none",
    marginLeft: "0.3rem",
    color: "black"
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  }
}));

export const UserList: React.FC<UserListProps> = ({ users }) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      {users.map((u, i) => (
        <ListItem key={u.username}>
          <Avatar className={classes.orange}>
            {u.channelId}
          </Avatar>
          <Typography variant="h6">
            <a
              className={classes.channelLink}
              href={"https://www.youtube.com/results?search_query=" + u.username}
              target="_blank" rel="noreferrer">{u.username}
            </a>
          </Typography>
        </ListItem>
      ))}
    </List>
  );
};
