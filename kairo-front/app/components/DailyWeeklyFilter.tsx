import {useState} from 'react'
import {Text} from "react-native";
import {styled, ToggleGroup, XStack} from 'tamagui'

const Item = styled(ToggleGroup.Item, {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    backgroundColor: '#E7E7E7',

    pressStyle: {
        backgroundColor: '#13a0fd',
        borderRadius: 10,
    },
    focusStyle: {
        backgroundColor: '#3cb6ff',
    },
    checkedStyle: {
        backgroundColor: '#3cb6ff',
        borderRadius: 10,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
    },
})

export default function DailyWeeklyFilter() {
    const [value, setValue] = useState('daily')

    return (
        <XStack justifyContent="center" alignItems="center" marginVertical={16}>
            <ToggleGroup
                type="single"
                value={value}
                onValueChange={setValue}
                orientation={'horizontal'}
                disableDeactivation
                unstyled
            >
                <Item value="daily">
                    <Text>Daily</Text>
                </Item>
                <Item value="weekly">
                    <Text>Weekly</Text>
                </Item>
                <Item value="overall">
                    <Text>Overall</Text>
                </Item>
            </ToggleGroup>
        </XStack>
    )
}