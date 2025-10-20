import {Button} from 'tamagui'
import {Plus} from "@tamagui/lucide-icons";

type AddButtonProps = {
    onPress?: () => void;
};

export default function AddButton({onPress}: AddButtonProps) {
    return (
        <Button
            icon={Plus}
            circular
            color="#000000"
            bg="#d5d4d4"
            elevation={4}
            shadowColor="black"
            shadowOffset={{width: 0, height: 2}}
            shadowOpacity={0.25}
            shadowRadius={4}
            onPress={onPress}
        />
    );
}