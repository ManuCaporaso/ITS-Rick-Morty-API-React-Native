import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useTheme } from '../../contexts/ThemeContext'; 
import Constants from 'expo-constants';
import { logEvent } from '../../telemetry/telemetry';

export default function ProfileScreen() {
  const { dispatch } = useFavorites();
  const { themeMode, toggleTheme } = useTheme(); 
  
  // 💡 VERSIÓN ACTUALIZADA
  const appVersion = Constants.manifest?.version || '1.0.4';

  const clearData = async () => {
    try {
      await AsyncStorage.clear();       
      dispatch({ type: 'SET_FAVORITES', payload: [] });
      
      // La lógica de re-evaluación del tema (toggleTheme) se mantiene
      // para asegurar que el tema por defecto del sistema se cargue después del borrado.
      
      logEvent('Data Cleared', { action: 'Full reset via button' });
      Alert.alert('¡Listo!', 'Todos los datos guardados han sido borrados.');
    } catch (error) {
      console.error('Error clearing data:', error);
      logEvent('Error', { type: 'AsyncStorage Clear Failed', error: error.message });
      Alert.alert('Error', 'No se pudieron borrar los datos.');
    }
  };
  
  const dynamicStyles = getStyles(themeMode);

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Configuración</Text>
      
      {/* Botón de Cambio de Tema */}
      <TouchableOpacity 
        style={dynamicStyles.option} 
        onPress={() => toggleTheme(themeMode)} 
      >
        <Text style={dynamicStyles.optionText}>
          Cambiar a modo **{themeMode === 'light' ? 'Oscuro 🌙' : 'Claro ☀️'}**
        </Text>
      </TouchableOpacity>
      
      {/* Botón de Borrar Datos */}
      <TouchableOpacity style={dynamicStyles.option} onPress={clearData}>
        <Text style={[dynamicStyles.optionText, {color: 'red'}]}>Borrar todos los datos guardados</Text>
      </TouchableOpacity>

      <View style={dynamicStyles.versionContainer}>
        <Text style={dynamicStyles.versionText}>Versión de la aplicación: {appVersion}</Text>
      </View>
    </View>
  );
}

const getStyles = (themeMode) => {
  const theme = themeMode === 'light' 
    ? { 
        background: '#f0f0f0', cardBackground: '#fff', title: 'teal', text: '#333', versionText: 'gray',
        shadowColor: '#000', shadowOpacity: 0.1
      }
    : { 
        background: '#121212', cardBackground: '#1e1e1e', title: '#4db6ac', text: '#ffffff', versionText: '#ccc',
        shadowColor: '#ffffff', shadowOpacity: 0.3
      };

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: theme.title,
    },
    option: {
      backgroundColor: theme.cardBackground,
      padding: 15,
      borderRadius: 10,
      marginBottom: 10,
      shadowColor: theme.shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.shadowOpacity,
      shadowRadius: 4,
      elevation: 3,
    },
    optionText: {
      fontSize: 16,
      color: theme.text,
    },
    versionContainer: {
      marginTop: 'auto',
      alignItems: 'center',
      paddingVertical: 20,
    },
    versionText: {
      fontSize: 14,
      color: theme.versionText,
    },
  });
};