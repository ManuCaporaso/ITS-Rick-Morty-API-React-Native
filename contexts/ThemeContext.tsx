import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

const THEME_KEY = 'appTheme';

// Definición de los temas
const lightTheme = {
  background: '#f0f0f0', // Fondo principal claro
  cardBackground: '#ffffff', // Fondo de tarjetas/elementos (listas, tabs)
  text: '#1a1a1a', // Texto principal oscuro
  title: '#ff6b35', // Color de acento (Títulos, botones activos)
  subText: '#8b5a8f', // Texto secundario
  accent: '#ffbe0b', // Color de acento claro
  neonBlue: '#0066ff', // Color de neon azul
  neonGreen: '#00cc44', // Color de neon verde
  neonPink: '#ff0080', // Color de neon rosa
};

const darkTheme = {
  background: '#0a0e27', // Fondo principal oscuro
  cardBackground: '#1a1f3a', // Fondo de tarjetas/elementos oscuros
  text: '#00ff41', // Texto principal claro
  title: '#00ff88', // Color de acento claro (para contraste)
  subText: '#ff006e', // Texto secundario claro
  accent: '#ffbe0b', // Color de acento claro
  neonBlue: '#00d4ff', // Color de neon azul
  neonGreen: '#39ff14', // Color de neon verde
  neonPink: '#ff10f0', // Color de neon rosa
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