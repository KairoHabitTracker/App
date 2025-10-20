import {ScrollView, StyleSheet, Text, View} from "react-native";
import React, {useState} from 'react';
import HabitListItem from "./HabitListItem";
import AddButton from "@/app/components/shared/AddButton";

export default function HabitList() {

    const [habits, setHabits] = useState([
        {
            index: 1,
            image: '🥛',
            name: "Drink water",
            streak: 10,
            done: false,
            color: '#64C5E3',
            // category: 'health'
        },
        {index: 2, image: '🏃‍♂️', name: "Do yoga", streak: 10, done: false, color: '#BC89F3'},
        {index: 3, image: '📚', name: "Read a book", streak: 2, done: false, color: '#46DB9A'},
        {index: 4, image: '🧘‍♀️', name: "Meditate", streak: 0, done: false, color: '#E3C364'},
        {index: 5, image: '🥊', name: "Punch a friend", streak: 3, done: true, color: '#E37364'},
        {index: 6, image: '🏃‍♂️', name: "Run a marathon", streak: 3, done: true, color: '#E39464'},
        // {index: 7, name: "Do yoga", streak: 10, done: false, color: '#BC89F3'},
        // {index: 8, name: "Do yoga", streak: 10, done: false, color: '#BC89F3'},
        // {index: 9, name: "Do yoga", streak: 10, done: false, color: '#BC89F3'},
        // {index: 10, name: "Do yoga", streak: 10, done: false, color: '#BC89F3'},

    ]);

    const toggleHabit = (index: number, checked: boolean) => {
        const newHabits = habits.map(h =>
            h.index === index ? {...h, done: checked} : h
        );
        setHabits(newHabits);
    };


    const toBeCompleted = habits.filter(habit => !habit.done);
    const completed = habits.filter(habit => habit.done);

    return (
        <View style={styles.main}>

            <ScrollView>
                {toBeCompleted.map(habit => (
                    <HabitListItem key={habit.index} habit={habit} showCheckbox={true} color={habit.color}
                                   onToggle={(checked) => toggleHabit(habit.index, checked)}/>
                ))}
                {completed.length > 0 && (
                    <>
                        <Text style={{marginTop: 20}}>Completed</Text>
                        {completed.map(habit => (
                            <HabitListItem key={habit.index} habit={habit} showCheckbox={false} color={habit.color}/>
                        ))}
                    </>
                )}

            </ScrollView>
            <View style={styles.addButton}>
                <AddButton/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        flexDirection: 'column',
        flex: 1
    },
    addButton: {
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 35
    }
});
