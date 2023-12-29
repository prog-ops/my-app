import {Image, StyleSheet} from 'react-native'
import React from "react";

interface SpriteProps {
    uri: string;
}

export default function Sprite({uri}: SpriteProps) {
    return <Image
        source={{uri: uri,}}
        style={styles.image}
    />
}

const styles = StyleSheet.create({
    image: {
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        margin: 10,
        width: 150,
        height: 150,
    },
})
