import EmojiSelector from "react-native-emoji-selector";
import React from "react";

export default function EmojiPicker({setEmoji, setShowEmoji}) {
    return (
        <EmojiSelector onEmojiSelected={emoji => {
            setEmoji(emoji);
            setShowEmoji(false);
        }}/>

    )
}
