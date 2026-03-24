import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OnboardingData {
  age: number;
  interests: string[];
  completedAt: string;
}


export function useOnboarding() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const completed = await AsyncStorage.getItem('onboardingCompleted');
        const data = await AsyncStorage.getItem('onboardingData');

        setIsOnboardingCompleted(completed === 'true');
        if (data) {
          setOnboardingData(JSON.parse(data));
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setIsOnboardingCompleted(false);
      }
    };

    checkOnboarding();
  }, []);

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('onboardingCompleted');
      await AsyncStorage.removeItem('onboardingData');
      setIsOnboardingCompleted(false);
      setOnboardingData(null);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };

  return {
    isOnboardingCompleted,
    onboardingData,
    resetOnboarding,
  };
}

