import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AuthButton from './AuthButton';

describe('AuthButton', () => {
  it('renders correctly and calls onPress', () => {
    const onPressMock = jest.fn();
    const testTitle = 'Test Login';
    const { getByText } = render(<AuthButton title={testTitle} onPress={onPressMock} />);
    
    const buttonText = getByText(testTitle);
    expect(buttonText).toBeTruthy();
    
    fireEvent.press(buttonText);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
