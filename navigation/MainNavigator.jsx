import React from 'react';
import { Feather, Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// screens
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import SearchScreen from '../screens/SearchScreen/SearchScreen';
import MovieDataScreen from '../screens/MovieDataScreen/MovieDataScreen';
import ShowDataScreen from '../screens/ShowDataScreen/ShowDataScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabbedNav = () => {
    return (
        <Tab.Navigator tabBarOptions={{
            activeTintColor: 'red',

            style: {
                backgroundColor: '#121212',
                borderTopWidth: 0,

            }
        }}>
            <Tab.Screen name="Home" component={HomeScreen} options={{
                tabBarLabel: () => { return null },
                tabBarIcon: ({ color }) => (
                    <Feather name={'home'}
                        size={27} color={color} style={{ width: 40 }}
                    />
                )

            }} />
            <Tab.Screen name="Search" component={SearchScreen} options={{
                tabBarLabel: () => { return null },
                tabBarIcon: ({ color }) => (
                    <Ionicons name={'md-search-circle-outline'}
                        size={35} color={color} style={{ width: 40 }}
                    />
                )

            }} />
        </Tab.Navigator>
    )
}

const MainNav = () => {
    return (
        <Stack.Navigator headerMode={'none'} mode="modal">
            <Stack.Screen name="Tabbed" component={TabbedNav} />
            <Stack.Screen name="MovieView" component={MovieDataScreen} />
            <Stack.Screen name="ShowView" component={ShowDataScreen} />
        </Stack.Navigator>
    )
}

export default MainNav;
