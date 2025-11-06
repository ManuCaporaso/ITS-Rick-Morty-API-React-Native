import { Stack } from 'expo-router';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import { SafeAreaView } from 'react-native-safe-area-context'; // Importa SafeAreaView

export default function RootLayout() {
  return (
    
    
    
    <SafeAreaView style={{ flex: 1 }}>
      <FavoritesProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="character/[id]" 
            options={{ 
              headerTitle: 'Detalles del Personaje',
              headerBackTitleVisible: false,
            }} 
          />
        </Stack>
      </FavoritesProvider>
    </SafeAreaView>
  );
}