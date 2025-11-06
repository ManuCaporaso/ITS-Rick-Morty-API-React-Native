import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useTheme } from '../../contexts/ThemeContext';
import { logEvent } from '../../telemetry/telemetry';
import { Link } from 'expo-router';

const FavoriteCard = ({ character, styles }) => {
  const { dispatch } = useFavorites();

  const handleRemoveFavorite = () => {
    logEvent('Remove Favorite', { characterId: character.id, characterName: character.name });
    dispatch({ type: 'REMOVE_FAVORITE', payload: character });
  };

  return (
    <View style={styles.card}>
      <Link href={`/character/${character?.id?.toString()}`} asChild> 
        <TouchableOpacity style={styles.infoContainer}>
          <Image source={{ uri: character.image }} style={styles.image} />
          <View>
            <Text style={styles.name}>{character.name}</Text>
            <Text style={styles.status}>{character.status}</Text>
          </View>
        </TouchableOpacity>
      </Link>
      <TouchableOpacity onPress={handleRemoveFavorite} style={styles.removeButton}>
        <Text style={styles.removeText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function FavoritesScreen() {
  const { favorites } = useFavorites();
  const { theme } = useTheme(); 
  
  const dynamicStyles = getStyles(theme);

  return (
    <View style={dynamicStyles.container}>
      {favorites.length === 0 ? (
        <Text style={dynamicStyles.emptyText}>No tienes personajes favoritos.</Text>
      ) : (
        <FlatList
          data={favorites}
          renderItem={({ item }) => <FavoriteCard character={item} styles={dynamicStyles} />}
          keyExtractor={item => item?.id?.toString() || Math.random().toString()}
        />
      )}
    </View>
  );
}


const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background, 
    padding: 15,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: theme.subText, 
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.cardBackground, 
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    shadowColor: theme.text === '#ffffff' ? '#000000' : '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.text === '#ffffff' ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
  },
  status: {
    fontSize: 12,
    color: theme.subText,
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
  },
  removeText: {
    color: 'white',
    fontSize: 12,
  },
});