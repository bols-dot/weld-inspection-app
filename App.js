import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import AddTestScreen from './screens/AddTestScreen';
import DetailScreen from './screens/DetailScreen';
import CameraScreen from './screens/CameraScreen';
import LogoHeader from './components/LogoHeader';
import { WeldProvider } from './context/WeldContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <LogoHeader />,
      }}
    >
      <Stack.Screen
        name="HomeStack"
        component={HomeScreen}
        options={{ title: 'Svetsar' }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{
          header: () => <LogoHeader />,
          title: 'Detaljer',
        }}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          title: 'Ta foto',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function AddTestStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <LogoHeader />,
      }}
    >
      <Stack.Screen
        name="AddTestStack"
        component={AddTestScreen}
        options={{ title: 'Nytt Test' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <WeldProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#2196F3',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
              backgroundColor: '#f5f5f5',
              borderTopColor: '#ddd',
            },
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{
              tabBarLabel: 'Svetsar',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="format-list-bulleted"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
          <Tab.Screen
            name="AddTest"
            component={AddTestStack}
            options={{
              tabBarLabel: 'Lägg till',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="plus-circle"
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </WeldProvider>
  );
}