import {Text, TextStyle, TouchableOpacity, ViewStyle} from 'react-native';
import {sharedFonts} from '@/global';
import React from "react";

type Props = {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    icon?: React.ReactNode;
};

export default function SharedButton({title, onPress, style, textStyle, icon}: Props) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                {
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    backgroundColor: '#007AFF',
                    borderRadius: 8,
                },
                style
            ]}
        >
            {icon}
            {icon && <Text style={{width: 8}}/>}

            <Text style={[sharedFonts.mediumWhiteText, textStyle]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}
