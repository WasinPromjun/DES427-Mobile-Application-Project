import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons, AntDesign, FontAwesome} from '@expo/vector-icons';
import FeedPage from './src/assets/screens/FeedPage';
import HomeScreen from './src/assets/screens/HomePage';
import TakePictureScreen from './src/assets/screens/TakePicturePage';
import SearchFollowScreen from './src/assets/screens/SearchPage';
import SignupLogin from './src/assets/screens/SignupLoginPage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function OutPlanetKilo() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedPage}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="feed" size={24} color={color} /> // Icon color now comes from tabBarActiveTintColor and tabBarInactiveTintColor
          ),
          tabBarActiveTintColor: '#1E90FF', // Active icon color
          tabBarInactiveTintColor: 'gray', // Inactive icon color
        }}
      />
      <Tab.Screen
        name="Take Picture"
        component={TakePictureScreen}
        options={{
          tabBarIcon: ({ color}) => (
            <AntDesign name="upload" size={24} color={color} />
          ),
          tabBarActiveTintColor: '#1E90FF',
          tabBarInactiveTintColor: 'gray',
        }}
      />
      <Tab.Screen
        name="Search and Follow"
        component={SearchFollowScreen}
        options={{
          tabBarIcon: ({ color}) => (
            <Ionicons name="accessibility" size={24} color={color} />
          ),
          tabBarActiveTintColor: '#1E90FF',
          tabBarInactiveTintColor: 'gray',
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color}) => (
            <Ionicons name="home" size={24} color={color} />
          ),
          tabBarActiveTintColor: '#1E90FF',
          tabBarInactiveTintColor: 'gray',
        }}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SignupLogin"
        
      >
        <Stack.Screen name="SignupLogin" component={SignupLogin} />
        <Stack.Screen name="OutPlanetKilo" component={OutPlanetKilo}/>
        <Stack.Screen name="FeedPage" component={FeedPage} />
        <Stack.Screen name="HomePage" component={HomeScreen} />
        <Stack.Screen name="TakePicturePage" component={TakePictureScreen} />
        <Stack.Screen name="SearchPage" component={SearchFollowScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
