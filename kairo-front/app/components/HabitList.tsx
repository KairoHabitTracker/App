import { View, Text, FlatList, StyleSheet } from "react-native";

const habits = [
    "Drink water",
    "Do yoga",
    "Read a book",
    "Meditate",
    "Walk outside",
];

export default function HabitList() {
    return (
        <View style={styles.habitsContainer}>
            <Text style={styles.habitsTitle}>Habits to do:</Text>
            <FlatList
                data={habits}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <Text style={styles.habitItem}>{`\u2022`} {item}</Text>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    habitsContainer: { flex: 1 },
    habitsTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
    habitItem: { fontSize: 16, marginBottom: 8 },
});