import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Link } from 'expo-router';

const FavoriteCard = ({ character }) => {
  const { dispatch } = useFavorites();

  const handleRemoveFavorite = () => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: character });
  };

  return (
    <View style={styles.card}>
      <Link href={`/character/${character.id}`} asChild>
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

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>No tienes personajes favoritos.</Text>
      ) : (
        <FlatList
          data={favorites}
          renderItem={({ item }) => <FavoriteCard character={item} />}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 15,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
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
  },
  status: {
    fontSize: 12,
    color: 'gray',
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