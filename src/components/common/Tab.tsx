import {
  Typography,
  Tab as MUITab,
  TabProps as MUITabProps
} from '@mui/material';
import * as React from 'react';

function a11yProps(index: number): { [key: string]: string } {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface TabProps extends MUITabProps {
  index: number;
}

export const Tab: React.FC<TabProps> = ({ label, ...props }) => {
  return (
    <MUITab
      {...props}
      {...a11yProps(props.index)}
      label={<Typography variant="h5">{label}</Typography>}
    />
  );
};
