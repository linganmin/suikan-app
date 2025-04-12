import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from './src/screens/HomeScreen';
import {PlayerScreen} from './src/screens/PlayerScreen';
import {setupAppOrientation} from './src/utils/orientation';

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    setupAppOrientation();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{headerShown: false}}
        />
        <Stack.Screen 
          name="Player" 
          component={PlayerScreen}
          options={{
            title: '正在播放',
            headerStyle: {
              backgroundColor: '#f5f5f5',
            },
            headerTintColor: '#333',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
