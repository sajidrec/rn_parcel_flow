import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ROUTES from './routes';

import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import LoginHubManager from '../screens/auth/LoginHubManager';
import LoginParcelRider from '../screens/auth/LoginParcelRider';
import HubHomeScreen from '../screens/hub_manager/HubHomeScreen';
import CreateTaskScreen from '../screens/hub_manager/CreateTaskScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
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

      </Stack.Navigator>
    </NavigationContainer>
  );
}