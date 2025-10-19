import {StyleSheet} from "react-native";
import {Button} from 'tamagui'
import {Plus} from "@tamagui/lucide-icons";

export default function AddButton() {
    return (
        <Button icon={Plus} circular={true} color={'#6D94C5'}>
        </Button>
    );
}

const styles = StyleSheet.create({});
