import {StyleSheet, Text, View} from "react-native";
import type {UserHabit} from '@/app/types/UserHabit';

export default function HabitListItem({habit, showCheckbox, color, onToggle}: {
    habit: UserHabit,
    showCheckbox: boolean,
    color: string,
    onToggle?: (newValue: boolean) => void;
}) {
    return (
        <View style={[styles.habitItem, {backgroundColor: color ? color : '#ffbc6b'}]}>
            {/*<View style={styles.picture}>*/}
            {/*    <Text style={styles.emoji}>*/}
            {/*        {habit.image}*/}
            {/*    </Text>*/}
            {/*</View>*/}
            <View style={styles.habitText}>
                <Text style={styles.text}>{habit.habit_id}</Text>
            </View>
            {/*{showCheckbox && (*/}
            {/*    <View style={styles.checkbox}>*/}
            {/*        <Checkbox size="$4" checked={habit.done} onCheckedChange={(checked) => onToggle?.(!!checked)}>*/}
            {/*            <Checkbox.Indicator>*/}
            {/*                <Check/>*/}
            {/*            </Checkbox.Indicator>*/}
            {/*        </Checkbox>*/}
            {/*    </View>*/}
            {/*)}*/}
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
    emoji: {
        fontSize: 26
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

