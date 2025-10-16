import {FlatList, StyleSheet, View} from "react-native";
import HabitListItem from "./HabitListItem";

const habits = [
    {
        name: "Drink water",
        streak: 10,
        done: true,
    },
    {name: "Do yoga", streak: 10, done: false},
    {name: "Read a book", streak: 2, done: true},
    {name: "Meditate", streak: 0, done: false},
    {name: "Walk outside", streak: 3, done: true},
];

export default function HabitList() {
    return (
        <View style={styles.habitsContainer}>
            <FlatList
                data={habits}
                keyExtractor={(item, index) => `${item}-${index}`}
                renderItem={({item}) => (
                    <HabitListItem habit={item}/>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    habitsContainer: {
        borderRadius: 12,
    },
    habitItem: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        gap: '20',
        backgroundColor: '#CBDCEB',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 6,
        alignItems: 'flex-start',
        minHeight: 20,

    },
    picture: {
        alignSelf: 'center',
        backgroundColor: '#6D94C5',
        height: 30,
        width: 30,
        borderRadius: 5,
    },
    text: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    habitText: {
        fontSize: 16,
    },
});
