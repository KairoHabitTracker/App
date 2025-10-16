import {StyleSheet, Text, View} from "react-native";


const days = [
    {label: "Mon", date: 17},
    {label: "Tue", date: 18},
    {label: "Wed", date: 19},
    {label: "Thu", date: 20},
    {label: "Fri", date: 21},
    {label: "Sat", date: 22},
    {label: "Sun", date: 23},
];

export default function Calendar() {
    return (
        <View style={styles.calendarRow}>
            {days.map((day) => (
                <View
                    key={day.label}
                    style={[
                        styles.dayCircle,
                        day.label === "Thu" && styles.dayCircleBlue
                    ]}
                >
                    <Text style={styles.dayText}>{day.label}</Text>
                    <Text>{day.date}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    calendarRow: {
        flexDirection: "row",
        gap: '6', // moze zeby na kazdym innym urzadzeniu pasowalo
        marginTop: 20,
        marginBottom: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    dayCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#E8DFCA",
        justifyContent: "center",
        alignItems: "center",
    },
    dayCircleBlue: {
        backgroundColor: "#6D94C5",
    },
    dayText: {fontWeight: "bold"},
});