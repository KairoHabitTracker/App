import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import StatCard from './StatCard';

describe('StatCard', () => {
  it('renders label and value correctly when no onPress is passed', () => {
    const { getByText } = render(<StatCard label="Completed" value="12" />);
    
    expect(getByText('Completed')).toBeTruthy();
    expect(getByText('12')).toBeTruthy();
  });

  it('responds to press events when onPress is passed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <StatCard label="Streak" value="5" onPress={onPressMock} />
    );
    
    const valueText = getByText('5');
    fireEvent.press(valueText);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
