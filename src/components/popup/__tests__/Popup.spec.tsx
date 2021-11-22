import React from 'react';

import '../../../i18n';
import { chrome } from 'jest-chrome';
import renderer from 'react-test-renderer';
import { Popup } from '../Popup';
import { ThemeProvider } from '@mui/material/styles';
import { YCAITheme } from '../../../theme';

const onMessageListener = jest.fn().mockImplementation((r, s, sendRes) => {
  sendRes({ active: true });
  return true;
});

describe('Popup', () => {
  test('Should mount the Popup', () => {
    chrome.runtime.onMessage.addListener(onMessageListener);
    const component = renderer.create(
      <ThemeProvider theme={YCAITheme}>
        <Popup />
      </ThemeProvider>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
