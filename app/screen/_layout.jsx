
import * as React from 'react';
import { registerRootComponent } from 'expo';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signup from './Signup';
import Login from './Login';
import Dashboard from './Dashboard';
import Postpages from './Postpages';
import BookingDetails from './Pages/BookingDetails';
import Room from './Pages/Room';


const Stack = createNativeStackNavigator();

function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Signup" component={Signup} />
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen name="Postpages" component={Postpages} />
                <Stack.Screen name="BookingDetails" component={BookingDetails} />
                <Stack.Screen name="Room" component={Room} />
            </Stack.Navigator>
        </GestureHandlerRootView>
    );
}
registerRootComponent(Dashboard);
export default App;