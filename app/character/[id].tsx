import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useTheme } from '../../contexts/ThemeContext'; 
import { logEvent } from '../../telemetry/telemetry';
import { Ionicons } from '@expo/vector-icons';
import { fetchCharacterById } from '../../api/rickAndMortyApi'; 

export default function CharacterDetailScreen() {
  const { id } = useLocalSearchParams();
  const [character, setCharacter] = useState(null);
  const [episodesData, setEpisodesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [episodesLoading, setEpisodesLoading] = useState(false);
  const { favorites, dispatch } = useFavorites();
  const { theme } = useTheme(); 

  const isFavorite = favorites.some(fav => fav.id.toString() === id);

  const fetchCharacter = async () => {
    setLoading(true);
    try {
      const data = await fetchCharacterById(id);
      setCharacter(data);
      logEvent('Character View', { characterId: id, characterName: data.name });
    } catch (error) {
      console.error('Error fetching character details:', error);
      logEvent('Error', { type: 'API Fetch Detail', characterId: id, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchEpisodes = async () => {
    if (!character || !character.episode || character.episode.length === 0) return;

    setEpisodesLoading(true);
    try {
      const episodePromises = character.episode.map(url => fetch(url).then(res => res.json()));
      const episodes = await Promise.all(episodePromises);
      
      const validEpisodes = episodes.filter(ep => ep && ep.id);

      setEpisodesData(validEpisodes);
      logEvent('Episodes Loaded', { count: validEpisodes.length, characterId: character.id });
    } catch (error) {
      console.error("Error fetching episodes:", error);
      logEvent('Error', { type: 'Episodes Fetch Failed', characterId: character.id });
    } finally {
      setEpisodesLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCharacter();
    }
  }, [id]);

  useEffect(() => {
    if (character) {
      fetchEpisodes();
    }
  }, [character]); 

  const toggleFavorite = () => {
    if (!character) return;
    
    if (isFavorite) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: character });
      logEvent('Remove Favorite', { characterId: character.id, characterName: character.name });
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: character });
      logEvent('Add Favorite', { characterId: character.id, characterName: character.name });
    }
  };

  const dynamicStyles = getStyles(theme);

  if (loading) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.title} />
        <Text style={[dynamicStyles.text, { marginTop: 10 }]}>Cargando personaje...</Text>
      </View>
    );
  }

  if (!character) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <Text style={dynamicStyles.text}>Personaje no encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={dynamicStyles.container}>
      {/* --- Encabezado del Personaje --- */}
      <View style={dynamicStyles.header}>
        <Image source={{ uri: character.image }} style={dynamicStyles.image} />
        <View style={dynamicStyles.headerInfo}>
          <Text style={dynamicStyles.name}>{character.name}</Text>
          <Text style={dynamicStyles.status}>{character.status} - {character.species}</Text>
          <TouchableOpacity onPress={toggleFavorite} style={dynamicStyles.favoriteButton}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={32}
              color={isFavorite ? 'red' : theme.subText}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- Información Adicional --- */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Información Adicional</Text>
        <Text style={dynamicStyles.detailText}><Text style={{fontWeight: 'bold'}}>Género:</Text> {character.gender}</Text>
        <Text style={dynamicStyles.detailText}><Text style={{fontWeight: 'bold'}}>Origen:</Text> {character.origin.name}</Text>
        <Text style={dynamicStyles.detailText}><Text style={{fontWeight: 'bold'}}>Última ubicación:</Text> {character.location.name}</Text>
      </View>

      {/* --- Listado de Episodios --- */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Episodios</Text>
        {episodesLoading ? (
            <ActivityIndicator size="small" color={theme.title} />
        ) : episodesData.length > 0 ? (
            episodesData.map((episode) => {
                return (
                    // El key={episode.id} ya es correcto después del filtro
                    <Text key={episode.id} style={dynamicStyles.episodeText}> 
                        <Text style={{fontWeight: 'bold', color: theme.title}}>
                            {episode.episode}
                        </Text>
                        : {episode.name}
                    </Text>
                );
            })
        ) : (
            <Text style={dynamicStyles.detailText}>No hay información de episodios disponible.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const getStyles = (theme) => StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background,
    },
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    header: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: theme.cardBackground, 
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 10,
        shadowColor: theme.text === '#ffffff' ? '#111' : '#000', 
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: theme.text === '#ffffff' ? 0.4 : 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    image: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 4,
        borderColor: theme.title, 
    },
    headerInfo: {
        alignItems: 'center',
        marginTop: 15,
    },
    name: {
        fontSize: 30,
        fontWeight: '900',
        color: theme.text,
        textAlign: 'center',
    },
    status: {
        fontSize: 18,
        color: theme.subText,
        marginTop: 5,
        fontStyle: 'italic',
    },
    favoriteButton: {
        marginTop: 15,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginHorizontal: 10,
        marginBottom: 10,
        borderRadius: 12,
        backgroundColor: theme.cardBackground,
        elevation: 1,
        shadowColor: theme.text === '#ffffff' ? '#111' : '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: theme.title, 
        borderBottomWidth: 2,
        borderBottomColor: theme.background,
        paddingBottom: 5,
    },
    detailText: {
        fontSize: 16,
        marginBottom: 5,
        color: theme.text,
    },
    episodeText: {
        fontSize: 16,
        color: theme.subText,
        marginBottom: 6,
        paddingLeft: 5,
    },
    text: {
        color: theme.text
    }
});