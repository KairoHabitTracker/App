import {StyleSheet, Text, View} from "react-native";
import {Check} from '@tamagui/lucide-icons'
import {Checkbox} from 'tamagui'


type Habit = {
    name: string;
    streak: number;
    done: boolean;
};


export default function HabitListItem({habit, showCheckbox, color}: {
    habit: Habit,
    showCheckbox: boolean,
    color: string
}) {
    return (
        <View style={[styles.habitItem, {backgroundColor: color ? color : '#ffbc6b'}]}>
            <View style={styles.picture}></View>
            <View style={styles.habitText}>
                <Text style={styles.text}>{habit.name}</Text>
            </View>
            {showCheckbox && (
                <View style={styles.checkbox}>
                    <Checkbox size="$4" checked={habit.done}>
                        <Checkbox.Indicator>
                            <Check/>
                        </Checkbox.Indicator>
                    </Checkbox>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    habitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 6,
        height: 70,
    },
    picture: {
        backgroundColor: '#f5f5f5',
        height: 30,
        width: 30,
        borderRadius: 5,
        marginRight: 16,
    },
    habitText: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    text: {
        fontSize: 16,
    },
    checkbox: {
        alignSelf: 'center',
        justifyContent: "flex-end",
    }
});

