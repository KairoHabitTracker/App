import {Tabs} from 'expo-router';
import {Ionicons} from "@expo/vector-icons";

export default function TabLayout() {
    return (

        <Tabs screenOptions={{
            headerStyle: {backgroundColor: '#6D94C5'},
            headerTintColor: '#fff',
            headerTitleStyle: {fontWeight: 'bold'},

            tabBarInactiveTintColor: 'white',
            tabBarActiveTintColor: 'white',
            tabBarStyle: {backgroundColor: '#6D94C5'},
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
                    title: 'Achievements',
                    tabBarIcon: () => <Ionicons size={28} name="trophy" color={"white"}/>,
                    tabBarBadgeStyle: {
                        backgroundColor: '#E8DFCA'
                    },
                    tabBarBadge: 2
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    title: 'Notifications',
                    tabBarIcon: () => <Ionicons size={28} name="notifications" color={"white"}/>,
                    tabBarBadgeStyle: {
                        backgroundColor: '#E8DFCA'
                    },
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
