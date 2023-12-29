import React from 'react'
import {Stack,} from "expo-router";
import {QueryClient, QueryClientProvider} from "react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 5,
            retryDelay: 1_000
        }
    }
})

export default function _layout() {
    return (
        <QueryClientProvider client={queryClient}>
            <Stack screenOptions={{
                headerStyle: {backgroundColor: 'black'},
                headerTintColor: 'yellow'
            }}>
                <Stack.Screen
                    name='index'
                    options={{
                        title: 'Home'
                    }}
                />
                <Stack.Screen
                    name='main'
                    options={{
                        title: 'Main',
                        headerShown: false,
                        animation: 'slide_from_left',
                    }}
                />
                <Stack.Screen
                    name='detail/index'
                    options={{
                        title: 'Pokemon Detail',
                        presentation: 'modal'
                    }}
                />
                <Stack.Screen
                    name='[missing]'
                    options={{title: '404'}}
                />
            </Stack>
        </QueryClientProvider>
    )
}
