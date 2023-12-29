import axios from "axios";
import {useInfiniteQuery, } from "react-query";

const BASE_URL = 'https://pokeapi.co/api/v2';

export const useGetPokemonsPaginated = () => {
    const fetch = async ({pageParam = 1}) => {
        const {data} = await axios.get(`${BASE_URL}/pokemon?limit=10`, {
            params: {
                offset: pageParam
            }
        })
        return data
    }
    return useInfiniteQuery({
        queryKey: 'pokemonsInf',
        queryFn: fetch,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length === 0) return undefined
            return allPages.length + 1
        }
    })
}
