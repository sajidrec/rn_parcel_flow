import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ROUTES from './routes';

import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import LoginHubManager from '../screens/auth/LoginHubManager';
import LoginParcelRider from '../screens/auth/LoginParcelRider';
import CreateTaskScreen from '../screens/hub_manager/CreateTaskScreen';
import HubUpdateTaskScreen from '../screens/hub_manager/HubUpdateTaskScreen';
import ParcelRiderHomeScreen from '../screens/parcel_rider/ParcelRiderHomeScreen';
import HubHomeScreen from '../screens/hub_manager/HubHomeScreen';
import MapScreen from '../screens/map/MapScreen';

const Stack = createStackNavigator();

export const navigationRef = createNavigationContainerRef();

export default function AppNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={ROUTES.SPLASH}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name={ROUTES.SPLASH} component={SplashScreen} />

        <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />

        <Stack.Screen name={ROUTES.LOGIN_HUB_MANAGER} component={LoginHubManager} />

        <Stack.Screen name={ROUTES.LOGIN_PARCEL_RIDER} component={LoginParcelRider} />

        <Stack.Screen name={ROUTES.HUB_MANAGER_HOME} component={HubHomeScreen} />

        <Stack.Screen name={ROUTES.CREATE_TASK} component={CreateTaskScreen} />

        <Stack.Screen name={ROUTES.UPDATE_HUB_TASK} component={HubUpdateTaskScreen} />

        <Stack.Screen name={ROUTES.PARCEL_RIDER_HOME} component={ParcelRiderHomeScreen} />

        <Stack.Screen name={ROUTES.MAP} component={MapScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}