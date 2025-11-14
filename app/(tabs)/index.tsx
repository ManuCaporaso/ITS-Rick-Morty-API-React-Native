import { Link } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchCharacters } from '../../api/rickAndMortyApi';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNetInfo } from '../../hooks/useNetInfo';
import { logEvent } from '../../telemetry/telemetry';

// Componente de Tarjeta de Personaje
const CharacterCard = ({ character, styles }) => {
  if (!character || !character.id) {
    return (
      <View style={[styles.card, { opacity: 0.5 }]}>
        <Text style={{color: 'red'}}>Error: No se pudo cargar el personaje.</Text>
      </View>
    );
  }

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

// Componente de Resumen y Filtros
const SummaryHeader = ({ totalCharacters, totalFavorites, currentFilter, setFilter, styles, theme }) => {
    const filterOptions = ['All', 'Alive', 'Dead', 'unknown'];

    return (
        <View style={styles.summaryContainer}>
            {/* LOGO RICK Y MORTY */}
            <View style={styles.logoContainer}>
                <Image 
                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Rick_and_Morty.svg' }}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <Text style={styles.summaryTitle}>Estadísticas del Multiverso Rick & Morty</Text>
            
            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{totalCharacters}</Text>
                    <Text style={styles.statLabel}>Cargados</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={[styles.statNumber, {color: theme.title}]}>{totalFavorites}</Text>
                    <Text style={styles.statLabel}>Favoritos</Text>
                </View>
            </View>

            <Text style={styles.filterTitle}>Filtrar por Estado:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                {filterOptions.map(filter => (
                    <TouchableOpacity
                        key={filter}
                        onPress={() => setFilter(filter)}
                        style={[
                            styles.filterButton,
                            currentFilter === filter && styles.filterButtonActive
                        ]}
                    >
                        <Text style={[
                            styles.filterButtonText,
                            currentFilter === filter && styles.filterButtonTextActive
                        ]}>
                            {filter === 'All' ? 'Mostrar Todos' : filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};


export default function CharactersScreen() {
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState('All'); 
  
  const isConnected = useNetInfo();
  const { theme } = useTheme(); 
  const { favorites } = useFavorites(); 

  // Lógica para filtrar la lista de personajes
  const filteredCharacters = useMemo(() => {
    if (currentFilter === 'All') {
        return characters;
    }
    return characters.filter(char => char.status === currentFilter);
  }, [characters, currentFilter]);

  // Función para obtener los datos
  const fetchData = async (pageNum) => {
    if (!isConnected && pageNum === 1) {
      Alert.alert('Sin conexión', 'No se pudieron cargar los datos iniciales. Conéctate a internet.');
      logEvent('Error', { type: 'No connection', screen: 'CharactersScreen' });
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchCharacters(pageNum);
      
      if (data.results && Array.isArray(data.results)) {
        
        if (pageNum === 1) {
          setCharacters(data.results);
          logEvent('Data Loaded', { page: pageNum, count: data.results.length, type: 'Initial Load' });

        } else {
          // Filtra duplicados al cargar más páginas
          const existingIds = new Set(characters.map(c => c.id));
          const newUniqueCharacters = data.results.filter(c => !existingIds.has(c.id));

          setCharacters(prev => [...prev, ...newUniqueCharacters]);
          logEvent('Data Loaded', { page: pageNum, count: newUniqueCharacters.length, type: 'Load More' });
        }
      }
    } catch (error) {
      console.error('Error fetching characters:', error);
      logEvent('Error', { type: 'API Fetch', error: error.message });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData(page);
  }, [page]); 

  const loadMore = () => {
    if (isConnected) {
      setPage(prev => prev + 1);
    } else {
      Alert.alert('Sin conexión', 'No puedes cargar más personajes sin conexión.');
      logEvent('Error', { type: 'Load more without connection' });
    }
  };
  
  const dynamicStyles = getStyles(theme);

  if (loading && characters.length === 0) {
     return (
        <View style={dynamicStyles.centeredView}>
          <ActivityIndicator size="large" color={theme.title} />
          <Text style={[dynamicStyles.text, { marginTop: 10 }]}>Cargando...</Text>
        </View>
      );
  }

  return (
    <View style={dynamicStyles.container}>
        <FlatList
          data={Array.isArray(filteredCharacters) ? filteredCharacters : []} // USAR DATOS FILTRADOS
          renderItem={({ item }) => <CharacterCard character={item} styles={dynamicStyles} />}
          keyExtractor={item => item?.id?.toString() || Math.random().toString()}
          
          // HEADER FIJO CON RESUMEN Y FILTROS
          ListHeaderComponent={() => (
              <SummaryHeader 
                  totalCharacters={characters.length}
                  totalFavorites={favorites.length}
                  currentFilter={currentFilter}
                  setFilter={setCurrentFilter}
                  styles={dynamicStyles}
                  theme={theme}
              />
          )}

          // FOOTER
          ListFooterComponent={() => (
            <View style={dynamicStyles.footer}>
              {loading && characters.length > 0 && <ActivityIndicator size="large" color={theme.title} />}
              
              {!loading && isConnected && (
                <TouchableOpacity onPress={loadMore} style={dynamicStyles.loadMoreButton}>
                  <Text style={dynamicStyles.loadMoreText}>Cargar más</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      
      {!isConnected && (
        <View style={dynamicStyles.offlineBanner}>
          <Text style={dynamicStyles.offlineText}>Modo Offline - Datos desactualizados</Text>
        </View>
      )}
    </View>
  );
}

// FUNCIÓN QUE DEFINE LOS ESTILOS DINÁMICOS
const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background, 
  },
  // --- ESTILOS DE RESUMEN Y FILTROS ---
  summaryContainer: {
    padding: 15,
    backgroundColor: theme.cardBackground,
    marginBottom: 8,
    borderBottomWidth: 3,
    borderBottomColor: theme.neonPink,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 5,
    padding: 5,
    borderRadius: 15,
    backgroundColor: theme.background,
    borderWidth: 2,
    borderColor: theme.neonGreen,
    shadowColor: theme.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  logo: {
    width: 290,
    height: 180,
    tintColor: theme.title,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.title,
    marginBottom: 10,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statBox: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    backgroundColor: theme.background,
    minWidth: '45%',
    borderWidth: 2,
    borderColor: theme.neonBlue,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.text,
  },
  statLabel: {
    fontSize: 12,
    color: theme.subText,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 8,
    marginTop: 5,
  },
  filterScroll: {
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: theme.background,
    marginRight: 10,
    borderWidth: 2,
    borderColor: theme.subText,
  },
  filterButtonActive: {
    backgroundColor: theme.title,
    borderColor: theme.neonGreen,
  },
  filterButtonText: {
    color: theme.text,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: theme.cardBackground, 
    fontWeight: 'bold',
  },

  // --- ESTILOS DE LISTA ---
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.cardBackground, 
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: theme.neonBlue,
    shadowColor: theme.text === '#ffffff' ? '#000000' : '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: theme.text === '#ffffff' ? 0.3 : 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: theme.neonGreen,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text, 
  },
  status: {
    fontSize: 14,
    color: theme.subText, 
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  loadMoreButton: {
    backgroundColor: theme.title, 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.neonGreen,
  },
  loadMoreText: {
    color: theme.cardBackground,
    fontWeight: 'bold',
  },
  offlineBanner: {
    backgroundColor: '#ff6347',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
  text: {
    color: theme.text
  }
});