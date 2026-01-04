
import React from 'react';
import { FlatList, View, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useCVs } from '../../hooks/useCV';
import { Plus } from 'lucide-react-native';

export function CVListScreen({ navigation }) {
    const { cvs, isLoading, refetch } = useCVs();

    const handleCreateNew = () => {
        navigation.navigate('CVEditor', { cvId: null });
    };

    const handleEditCV = (cvId) => {
        navigation.navigate('CVEditor', { cvId });
    };

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={cvs}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => handleEditCV(item.id)}>
                        <View>
                            <Text style={styles.title}>{item.title || 'Untitled CV'}</Text>
                            <Text style={styles.subtitle}>{item.template || 'Modern Pro'}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                onRefresh={refetch}
                refreshing={isLoading}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No CVs found. Create your first one!</Text>
                    </View>
                }
            />
            <TouchableOpacity style={styles.fab} onPress={handleCreateNew}>
                <Plus color="#fff" size={30} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        padding: 15,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    empty: {
        marginTop: 100,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
});
