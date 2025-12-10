import React from "react";
import {Platform} from 'react-native';
import EmojiSelector from "react-native-emoji-selector";
import AndroidEmojiPicker, {emojiData} from '@hiraku-ai/react-native-emoji-picker';


interface EmojiPickerProps {
    showEmoji: boolean;
    setEmoji: (emoji: string) => void;
    setShowEmoji: (show: boolean) => void;
}

export default function EmojiPicker({showEmoji, setEmoji, setShowEmoji}: EmojiPickerProps) {

    // Funkcja wspólna do ustawiania emoji i zamykania pickera
    const handleEmojiSelected = (emoji: string) => {
        setEmoji(emoji);
        setShowEmoji(false);
    };

    if (Platform.OS === 'ios') {
        return (
            <EmojiSelector
                onEmojiSelected={handleEmojiSelected}
            />
        );
    }

    return (
        <AndroidEmojiPicker
            emojis={emojiData}
            visible={showEmoji}
            onEmojiSelect={handleEmojiSelected}
            onClose={() => setShowEmoji(false)}
        />
    );
}
