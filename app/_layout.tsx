import { Stack } from 'expo-router';
import { FavoritesProvider } from '../contexts/FavoritesContext';

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Stack>
        {/* This screen uses the layout from the (tabs) folder,
            which contains the Tab Navigator.
            headerShown: false hides the top navigation bar for this screen. */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* This is the individual screen for character details.
            It will be pushed on top of the tab navigator. */}
        <Stack.Screen 
          name="character/[id]" 
          options={{ 
            headerTitle: 'Detalles del Personaje',
            headerBackTitleVisible: false,
          }} 
        />
      </Stack>
    </FavoritesProvider>
  );
}