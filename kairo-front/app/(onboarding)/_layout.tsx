import {Stack} from 'expo-router';
import BackButton from "@/src/components/BackButton";

export default function OnboardingLayout() {
  return <Stack screenOptions={{headerShown: false}}>
    <Stack.Screen
      name="interests"
      options={{
        title: 'Interests',
        presentation: 'card',
        headerLeft: () => <BackButton/>,
      }}
    />
  </Stack>;
}


