
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function SignupScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Signup Screen (Placeholder)</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
