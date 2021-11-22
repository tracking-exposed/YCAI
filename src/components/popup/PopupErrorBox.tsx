import * as React from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import { ErrorBox } from 'components/common/ErrorBox';
import { getDefaultSettings } from 'models/Settings';
import { useTranslation } from 'react-i18next';
import { updateSettings } from 'state/public.commands';

export const PopupErrorBox = (e: any): React.ReactElement => {
  const { t } = useTranslation();
  return (
    <Box>
      {ErrorBox(e)}
      <Box style={{ margin: '10px 0' }}>
        <ButtonGroup variant="contained">
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              void window.location.reload();
            }}
          >
            {t('actions:reload_extension')}
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              void updateSettings(getDefaultSettings())();
            }}
          >
            {t('actions:reset_settings')}
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};
