import { View, Text, StyleSheet } from "react-native";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Calendar() {
    return (
        <View style={styles.calendarRow}>
            {days.map((day) => (
                <View key={day} style={styles.dayCircle}>
                    <Text style={styles.dayText}>{day}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    calendarRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 32,
    },
    dayCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#e0e0e0",
        justifyContent: "center",
        alignItems: "center",
    },
    dayText: { fontWeight: "bold" },
});