import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useFavorites } from '../../contexts/FavoritesContext';
import { logEvent } from '../../telemetry/telemetry';

import { Ionicons } from '@expo/vector-icons';

const API_URL = 'https://rickandmortyapi.com/api/character';

export default function CharacterDetailScreen() {
  const { id } = useLocalSearchParams();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const { favorites, dispatch } = useFavorites();

  const isFavorite = favorites.some(fav => fav.id.toString() === id);

  useEffect(() => {
    const fetchCharacter = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        setCharacter(data);
      } catch (error) {
        console.error('Error fetching character details:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchCharacter();
    }
  }, [id]);

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: character });
      logEvent('Remove Favorite', { characterId: character.id, characterName: character.name });
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: character });
      logEvent('Add Favorite', { characterId: character.id, characterName: character.name });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="teal" />
      </View>
    );
  }

  if (!character) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Personaje no encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: character.image }} style={styles.image} />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{character.name}</Text>
          <Text style={styles.status}>{character.status} - {character.species}</Text>
          <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={32}
              color={isFavorite ? 'red' : 'gray'}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Adicional</Text>
        <Text style={styles.detailText}>Género: {character.gender}</Text>
        <Text style={styles.detailText}>Origen: {character.origin.name}</Text>
        <Text style={styles.detailText}>Última ubicación: {character.location.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Episodios</Text>
        {character.episode.map((episodeUrl, index) => {
          const episodeNumber = episodeUrl.split('/').pop();
          return (
            <Text key={index} style={styles.episodeText}>
              Episodio {episodeNumber}
            </Text>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: 'teal',
  },
  headerInfo: {
    alignItems: 'center',
    marginTop: 15,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  status: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
  },
  favoriteButton: {
    marginTop: 10,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'teal',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  episodeText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 3,
  },
});