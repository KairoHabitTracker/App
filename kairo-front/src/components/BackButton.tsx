import {Pressable, Text} from "react-native";
import {router} from "expo-router";
import {ChevronLeft} from "@tamagui/lucide-icons";

export default function BackButton() {
    return (
        <Pressable
            onPress={() => router.back()}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                paddingRight: 8
            }}
            hitSlop={8}
        >
            <ChevronLeft size={24}/>
            <Text
                style={{
                    fontSize: 17,
                    fontWeight: '500',
                }}
            >Back</Text>
        </Pressable>
    )
}