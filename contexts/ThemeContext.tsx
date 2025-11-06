import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const THEME_KEY = 'appTheme';

// Definición de los temas
const lightTheme = {
  background: '#f0f0f0', // Fondo principal claro
  cardBackground: '#fff', // Fondo de tarjetas/elementos (listas, tabs)
  text: '#000', // Texto principal oscuro
  title: 'teal', // Color de acento (Títulos, botones activos)
  subText: 'gray', // Texto secundario
};

const darkTheme = {
  background: '#121212', // Fondo principal oscuro
  cardBackground: '#1e1e1e', // Fondo de tarjetas/elementos oscuros
  text: '#ffffff', // Texto principal claro
  title: '#4db6ac', // Color de acento claro (para contraste)
  subText: '#ccc', // Texto secundario claro
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Obtiene la preferencia del sistema (si está disponible)
  const systemTheme = useColorScheme(); 
  const [themeMode, setThemeMode] = useState(systemTheme || 'light'); 
  
  // Selecciona el objeto de tema actual (lightTheme o darkTheme)
  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  //  Efecto para cargar el tema guardado al iniciar la app
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (storedTheme) {
          setThemeMode(storedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };
    loadTheme();
  }, []);

  // Función para cambiar el tema y guardarlo
  const toggleTheme = (currentMode) => {
    const newMode = currentMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newMode);
    
    // Persistir la nueva preferencia en AsyncStorage
    AsyncStorage.setItem(THEME_KEY, newMode).catch(e => console.error('Error saving theme', e));
  };
  
  return (
    <ThemeContext.Provider value={{ themeMode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);