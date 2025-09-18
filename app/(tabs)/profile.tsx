import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFavorites } from '../../contexts/FavoritesContext';
import Constants from 'expo-constants';

export default function ProfileScreen() {
  const { dispatch } = useFavorites();
  const appVersion = Constants.manifest?.version || '1.0.0';

  const clearData = async () => {
    Alert.alert(
      'Borrar Datos',
      '¿Estás seguro de que quieres borrar todos los datos, incluyendo tus favoritos?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sí',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              dispatch({ type: 'SET_FAVORITES', payload: [] });
              Alert.alert('¡Listo!', 'Todos los datos han sido borrados.');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'No se pudieron borrar los datos.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración</Text>
      
      <TouchableOpacity style={styles.option} onPress={clearData}>
        <Text style={styles.optionText}>Borrar datos guardados</Text>
      </TouchableOpacity>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Versión de la aplicación: {appVersion}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'teal',
  },
  option: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  versionContainer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    color: 'gray',
  },
});