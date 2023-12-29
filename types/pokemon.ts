export interface Pokemon {
  id: number;
  name: string;
  url: string;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  sprites: {
    front_default: string | null;
  };
}

export interface Fav {
  id: number
  name: string
  url: string
  imageUri: string
}
