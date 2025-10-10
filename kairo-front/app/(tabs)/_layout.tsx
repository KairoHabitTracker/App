import {Tabs} from 'expo-router';
import {Ionicons} from "@expo/vector-icons";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: 'white',
            tabBarStyle: { backgroundColor: '#4faaff' },
            title: 'My home',
            headerStyle: {
            backgroundColor: '#3cb6ff',
        },
            headerTintColor: '#fff',
            headerTitleStyle: {
            fontWeight: 'bold',
        },
            tabBarInactiveTintColor: 'white',
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: () => <Ionicons size={28} name="home" color={"white"}/>,

                }}
            />
            <Tabs.Screen
                name="achievements"
                options={{
                    tabBarIcon: () => <Ionicons size={28} name="trophy" color={"white"}/>,
                    tabBarBadge: 2
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    tabBarIcon: () => <Ionicons size={28} name="notifications" color={"white"}/>,
                    tabBarBadge: 2
                }}
            />
            <Tabs.Screen
                name="friends"
                options={{
                    title: 'Friends',
                    tabBarIcon: () => <Ionicons size={28} name="people" color={"white"}/>,

                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: () => <Ionicons size={28} name="person-circle" color={"white"}/>,

                }}
            />
        </Tabs>
    );
}
