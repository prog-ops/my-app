import {View, Button, StyleSheet} from 'react-native'
import React from 'react'
import {Link} from "expo-router";

export default function Page() {
    return (
        <View style={s.spriteContainer}>
            <Link href='/main' asChild>
                <Button title='Pokemon List'/>
            </Link>
            <Link href='/favorites' asChild>
                <Button title='Favorites List'/>
            </Link>
        </View>
    )
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    spriteContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        alignItems: 'center',
        padding: 10
    },
})
