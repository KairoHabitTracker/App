import {Tabs} from 'expo-router';
import {Ionicons} from "@expo/vector-icons";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: 'pink',
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: () => <Ionicons size={28} name="home"/>,

                }}
            />
            <Tabs.Screen
                name="achievements"
                options={{
                    tabBarIcon: () => <Ionicons size={28} name="trophy"/>,
                    tabBarBadge: 2
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    tabBarIcon: () => <Ionicons size={28} name="notifications"/>,
                    tabBarBadge: 2
                }}
            />
            <Tabs.Screen
                name="friends"
                options={{
                    title: 'Friends',
                    tabBarIcon: () => <Ionicons size={28} name="people"/>,

                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: () => <Ionicons size={28} name="person-circle"/>,

                }}
            />
        </Tabs>
    );
}
