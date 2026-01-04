
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Screens
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { SignupScreen } from './src/screens/auth/SignupScreen';
import { CVListScreen } from './src/screens/editor/CVListScreen';
import { CVEditorScreen } from './src/screens/editor/CVEditorScreen';
import { ExportScreen } from './src/screens/export/ExportScreen';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    {/* Auth Flow */}
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Signup"
                        component={SignupScreen}
                        options={{ title: 'Create Account' }}
                    />

                    {/* Main App Flow */}
                    <Stack.Screen
                        name="Home"
                        component={CVListScreen}
                        options={{ title: 'My CVs' }}
                    />
                    <Stack.Screen
                        name="CVEditor"
                        component={CVEditorScreen}
                        options={{ title: 'Edit CV' }}
                    />
                    <Stack.Screen
                        name="Export"
                        component={ExportScreen}
                        options={{ title: 'Preview & Export' }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </QueryClientProvider>
    );
}
