import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ShiftListScreen from '../screens/ShiftListScreen';
import ShiftDetailsScreen from '../screens/ShiftDetailsScreen';

export type RootStackParamList = {
  ShiftList: undefined;
  ShiftDetails: { shiftId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="ShiftList" 
          component={ShiftListScreen} 
          options={{ title: 'Доступные смены' }}
        />
        <Stack.Screen 
          name="ShiftDetails" 
          component={ShiftDetailsScreen} 
          options={{ title: 'Детали смены' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;