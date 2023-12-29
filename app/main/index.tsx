import React, {useEffect, useState} from "react";
import {useGetPokemonsPaginated} from "../../services/api";
import {FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {Link, useLocalSearchParams, useNavigation, useRouter} from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Pokemon} from "../../types/pokemon";

const HomePaginated: React.FC = () => {
    const router = useRouter()
    const {navigate} = useNavigation()
    const {main} = useLocalSearchParams()

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [offlineData, setOfflineData] = useState<Pokemon[]>([]);

    const {
        data: heroDataPaginated,
        isLoading,
        refetch,
        hasNextPage,
        fetchNextPage
    } = useGetPokemonsPaginated()

    const dataArr = heroDataPaginated?.pages?.map(page => page).flat() ?? [];
    const filteredData = dataArr.filter((item) =>
        item.results[0].name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const onReachEnd = () => {
        if (hasNextPage && !isLoading) {
            fetchNextPage()
        }
    }

    const keyExtractor = (_, index: number) => index.toString()

    const renderItem = ({item, index}) => {
        const handlePress = () => {
            router.push({
                pathname: `/detail`,
                params: {
                    id: index,
                    name: item.results[0].name,
                    url: item.results[0].url,
                    imageUri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png`
                }
            })
        };

        return (
            <TouchableOpacity
                onPress={handlePress}
            >
                <View style={s.item}>
                    <Image
                        source={{uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index}.png`}}
                        style={{width: 50, height: 50}}/>
                    <Text>{item.results[0].name}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    // Save data to AsyncStorage when heroDataPaginated changes
    useEffect(() => {
        const saveDataToStorage = async () => {
            try {
                await AsyncStorage.setItem('pokemonData', JSON.stringify(dataArr));
            } catch (error) {
                console.error('Error saving data to AsyncStorage:', error);
            }
        };
        if (heroDataPaginated) {
            saveDataToStorage();
        }
    }, [heroDataPaginated]);

    // Load data from AsyncStorage on component mount
    useEffect(() => {
        const loadDataFromStorage = async () => {
            try {
                const storedData = await AsyncStorage.getItem('pokemonData');
                if (storedData) {
                    setOfflineData(JSON.parse(storedData));
                }
            } catch (error) {
                console.error('Error loading data from AsyncStorage:', error);
            }
        };
        loadDataFromStorage();
    }, []);

    return (
        <View style={s.container}>
            <TextInput
                style={s.input}
                placeholder="Search Pokemon"
                onChangeText={(text) => setSearchQuery(text)}
            />
            <FlatList
                data={filteredData.length > 0 ? filteredData : offlineData}
                keyExtractor={keyExtractor}
                numColumns={2}
                renderItem={renderItem}
                onEndReached={onReachEnd}
                onEndReachedThreshold={.5}
            />
        </View>
    );
};

const s = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        width: '90%',
        height: 40,
        borderRadius: 10,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        marginTop: 20,
        paddingHorizontal: 10,
    },
    item: {
        width: 150,
        padding: 10,
        margin: 10,
        alignItems: "center",
        borderWidth: .5,
        borderRadius: 5,
        borderColor: 'grey'
    }
})

export default HomePaginated;
