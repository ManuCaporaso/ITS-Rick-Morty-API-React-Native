import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Link } from 'expo-router';
import { logEvent } from '../../telemetry/telemetry';
import { useNetInfo } from '../../hooks/useNetInfo';
import { fetchCharacters } from '../../api/rickAndMortyApi';

const CharacterCard = ({ character }) => {
  return (
    <Link href={`/character/${character.id}`} asChild>
      <TouchableOpacity style={styles.card}>
        <Image source={{ uri: character.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{character.name}</Text>
          <Text style={styles.status}>{character.status}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default function CharactersScreen() {
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const isConnected = useNetInfo();

  const loadInitialData = async () => {
    if (!isConnected) {
      Alert.alert('Sin conexión', 'No se pudieron cargar los datos. Conéctate a internet para ver los personajes.');
      logEvent('Error', { type: 'No connection', screen: 'CharactersScreen' });
      setLoading(false);
      return;
    }
    await fetchData(1);
  };

  const fetchData = async (pageNum) => {
    setLoading(true);
    try {
      const data = await fetchCharacters(pageNum);
      if (data.results) {
        setCharacters(prev => [...prev, ...data.results]);
        logEvent('Data Loaded', { page: pageNum, count: data.results.length });
      }
    } catch (error) {
      console.error('Error fetching characters:', error);
      logEvent('Error', { type: 'API Fetch', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadMore = () => {
    if (isConnected) {
      setPage(prev => prev + 1);
      fetchData(page + 1);
    } else {
      Alert.alert('Sin conexión', 'No puedes cargar más personajes sin conexión.');
      logEvent('Error', { type: 'Load more without connection' });
    }
  };

  return (
    <View style={styles.container}>
      {loading && characters.length === 0 ? (
        <View style={styles.centeredView}>
          <ActivityIndicator size="large" color="teal" />
          <Text style={{ marginTop: 10 }}>Cargando...</Text>
        </View>
      ) : (
        <FlatList
          data={characters}
          renderItem={({ item }) => <CharacterCard character={item} />}
          keyExtractor={item => item.id.toString()}
          ListFooterComponent={() => (
            <View style={styles.footer}>
              {loading && <ActivityIndicator size="large" color="teal" />}
              {!loading && isConnected && (
                <TouchableOpacity onPress={loadMore} style={styles.loadMoreButton}>
                  <Text style={styles.loadMoreText}>Cargar más</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
      {!isConnected && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Modo Offline - Datos desactualizados</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    color: 'gray',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  loadMoreButton: {
    backgroundColor: 'teal',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  loadMoreText: {
    color: 'white',
    fontWeight: 'bold',
  },
  offlineBanner: {
    backgroundColor: '#ff6347',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  offlineText: {
    color: 'white',
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});