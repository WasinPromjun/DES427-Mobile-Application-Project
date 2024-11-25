export type RootStackParamList = {
    Home: undefined;
    SignupLogin: undefined;
    OutPlanetKilo: { username: string }; // Pass username as a parameter
    FeedPage: undefined;
  };
  
  export interface Review {
    comment: string;
    stars: number;
  }
  
  export interface RestaurantData {
    name: string;
    open_day: string;
    open_time: string;
    phone: string;
    images: string[];
    type: string;
    gps: string;
    reviews: Review[];
  }
  