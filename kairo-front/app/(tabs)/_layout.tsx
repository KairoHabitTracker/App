import {Tabs} from 'expo-router';
import {Ionicons} from "@expo/vector-icons";

export default function TabLayout() {
    return (

        <Tabs screenOptions={{
            // headerStyle: {backgroundColor: '#3cb6ff'},
            // headerTintColor: '#fff',
            // headerTitleStyle: {fontWeight: 'bold'},
            headerShadowVisible: false,

            tabBarInactiveTintColor: 'white',
            tabBarActiveTintColor: 'white',
            tabBarStyle: {backgroundColor: '#54beff'},
        }}>
            <Tabs.Screen
                name="home"
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
