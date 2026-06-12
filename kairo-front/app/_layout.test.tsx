import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import RootLayout from './_layout';

describe('RootLayout', () => {
  it('renders layout wrapper without crashing', async () => {
    const { toJSON } = render(<RootLayout />);
    await waitFor(() => {
      expect(toJSON()).toBeTruthy();
    });
  });
});




