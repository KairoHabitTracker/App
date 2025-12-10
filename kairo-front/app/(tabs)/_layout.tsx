import {Tabs} from 'expo-router';
import {Ionicons} from "@expo/vector-icons";
import {tokens} from "@/global";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#ffffff',
            tabBarInactiveTintColor: tokens.colors.tabBarInactiveTintColor,
            tabBarStyle: {
                backgroundColor: tokens.colors.tabBar,
            },
            tabBarItemStyle: {
                paddingVertical: 5,
            },
            tabBarLabelStyle: {
                fontSize: 12,
                marginTop: 4,
            },
            tabBarIconStyle: {
                marginBottom: 2,
            },
            tabBarBadgeStyle: {
                backgroundColor: tokens.colors.buttonColor,
                fontSize: 10,
            },
        }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            size={focused ? 30 : 26}
                            name={focused ? "home" : "home-outline"}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="achievements"
                options={{
                    title: 'Achievements',
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            size={focused ? 30 : 26}
                            name={focused ? "trophy" : "trophy-outline"}
                            color={color}
                        />
                    ),
                    tabBarBadge: 2
                }}
            />

            <Tabs.Screen
                name="notifications"
                options={{
                    title: 'Notifications',
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            size={focused ? 30 : 26}
                            name={focused ? "notifications" : "notifications-outline"}
                            color={color}
                        />
                    ),
                    tabBarBadge: 2
                }}
            />

            <Tabs.Screen
                name="friends"
                options={{
                    title: 'Friends',
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            size={focused ? 30 : 26}
                            name={focused ? "people" : "people-outline"}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            size={focused ? 30 : 26}
                            name={focused ? "person-circle" : "person-circle-outline"}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}