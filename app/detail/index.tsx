import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions,
    SafeAreaView,
    ScrollView
} from 'react-native';
import {useLocalSearchParams, useNavigation, useRouter} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Fav} from "../../types/pokemon";
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from "axios";
import Sprite from "../../components/Sprite";

export default function PokemonDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const {
        id,
        name,
        url ,
        imageUri
    } = params;

    const [offlineData, setOfflineData] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [sprites, setSprites] = useState<any>({});
    const [abilities, setAbilities] = useState<[]>();

    useEffect(() => {
        const loadDataFromStorage = async () => {
            try {
                const storedData = await AsyncStorage.getItem(`pokemonDetail_${id}`);
                console.log('storedData: ', storedData)
                if (storedData) {
                    setOfflineData(storedData);
                } else {
                    // Save the image uri
                    await AsyncStorage.setItem(
                        `pokemonDetail_${id}`,
                        imageUri as string
                    )
                }
            } catch (error) {
                console.error('Error loading data from AsyncStorage:', error);
            }
        };

        loadDataFromStorage();
    }, [id]);

    useEffect(() => {
        const loadFavoritesFromStorage = async () => {
            try {
                const favoritesString = await AsyncStorage.getItem('favoritePokemonList');
                const favorites = JSON.parse(favoritesString!) || [];
                console.log('favorites: ', favorites)
                setIsFavorite(favorites.includes(id));
            } catch (error) {
                console.error('Error loading favorites from AsyncStorage:', error);
            }
        };

        loadFavoritesFromStorage();
    }, [id]);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            try {
                const response = await axios.get(url.toString());
                const { abilities, sprites, } = response.data;
                setSprites(sprites);
                setAbilities(abilities)
            } catch (error) {
                console.error('Error fetching Pokemon details:', error);
            }
        };

        fetchPokemonDetails();
    }, [url]);

    const spriteKeys = Object.keys(sprites);

    const toggleFavorite = async (): Promise<void> => {
        try {
            let favoritesString = await AsyncStorage.getItem('favoritePokemonList');
            let favorites = JSON.parse(favoritesString!) || [];

            const isAlreadyFavorite = favorites.some((fav: any) => fav.id.toString() === id);

            if (isAlreadyFavorite) {
                // Remove from favorites
                favorites = favorites.filter((fav: any) => fav.id.toString() !== id);
            } else {
                // Add to favorites
                const newFavorite = { id, name, url, imageUri };
                favorites.push(newFavorite);
            }

            // Update AsyncStorage with the new favorites list
            await AsyncStorage.setItem('favoritePokemonList', JSON.stringify(favorites));
            setIsFavorite(prevIsFavorite => !prevIsFavorite);
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>
                    {offlineData ? null : <Text>Image not saved yet.</Text>}
                    {offlineData ?
                        <Image source={{ uri: offlineData }} style={{width: 300, height: 300}} />
                        : (
                            <Image
                                source={{
                                    uri: imageUri as string,
                                }}
                                style={{width: 300, height: 300}}
                            />
                        )}
                    <View style={styles.border}/>

                    <View style={styles.nameAndFav}>
                        <Text
                            style={styles.name}
                            onPress={() => {
                                router.push({ pathname: "/main", params: { main: "random", id, name } });
                            }}>
                            {name}
                        </Text>
                        <TouchableOpacity onPress={toggleFavorite}>
                            <Text style={styles.favoriteButton}>
                                {isFavorite ?
                                    <Ionicons name="md-checkmark-circle" size={32} color="green" />
                                    :
                                    <Ionicons name="close-outline" size={32} color="green" />
                                }
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.title}>Sprite Gallery</Text>

                    <View style={styles.spriteContainer}>
                        <Sprite uri={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`} />
                        <Sprite uri={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/${id}.png`} />
                        <Sprite uri={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`} />
                        <Sprite uri={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`} />
                    </View>

                    <View style={styles.title}>
                        <Text style={{fontWeight: 'bold'}}>Abilities</Text>
                        {abilities?.map(item => (
                            <Text key={item.ability.name}>{item.ability.name}</Text>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    border: {
        backgroundColor: 'lightgray', height: 1, width: '100%'
    },
    nameAndFav: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width:'100%',
        marginBottom: 40
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    favoriteButton: {
        fontSize: 18,
        color: 'blue',
        marginBottom: 10,
    },
    title: {
        flex: 1,
        paddingLeft: 10,
        alignSelf: 'flex-start',
        fontWeight: 'bold'
    },
    spriteContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
    },
    spriteImage: {
        width: 200,
        height: 100,
    },
});
