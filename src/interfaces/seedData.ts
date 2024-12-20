

interface SeedData {
  games: {
    name: string;
    price: number;
    stock: number;
    game_body: string;
    bgg_id: number;
  }[];
  categories: {
    name: string;
    description: string;
  }[];
  users: {
    username: string;
    first_name: string;
    last_name: string;
    title: string;
    dob: string;
    password: string;
    email: string;
  }[];
  sleeves: {
    name: string;
    height: number;
    width: number;
    pack_size: number;
    stock: number;
    description: string;
    price: number;
  }[];
  gameCards: {
    name: string;
    height: number;
    width: number;
    game_id: number;
    qty: number;
  }[];
  gameCategories: {
    game_id: number;
    category_name: string;
  }[];
  reviews: {
    entity_type: string;
    entity_id: number;
    rating: number;
    review_body: string;
    review_title: string;
    author: string;
    created_at: string;
  }[];
  addresses: {
    postcode: string,
    address_line1: string,
    username: string,
    city: string
  }[];
  orders: {
    username: string,
    date: string,
    address_id: number
  }[];
  orderItems: {
    name: string,
    qty: number,
    price: number,
    order_id:number
  }[]
}
interface Game {
    game_id: string
    name: string;
    price: number;
    stock: number;
    game_body: string;
    bgg_id: number;
  categories?: any
  
}