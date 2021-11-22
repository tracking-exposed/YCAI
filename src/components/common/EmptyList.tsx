import { Box, Typography } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

interface EmptyListProps {
  resource: string;
}

export const EmptyList: React.FC<EmptyListProps> = (props) => {
  const { t } = useTranslation();
  return (
    <Box>
      <Typography variant="subtitle1">
        {t('common:empty_list', { resource: props.resource })}
      </Typography>
    </Box>
  );
};
