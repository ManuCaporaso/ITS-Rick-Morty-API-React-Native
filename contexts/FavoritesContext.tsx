import React, { createContext, useReducer, useEffect, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorites';

const initialState = [];

const favoritesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FAVORITES':
      return Array.isArray(action.payload) ? action.payload : initialState;
    case 'ADD_FAVORITE':
      return [...state, action.payload];
    case 'REMOVE_FAVORITE':
      return state.filter(char => char.id !== action.payload.id);
    default:
      return state;
  }
};

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {

  // USAMOS USEREDUCER PARA MANEJAR EL ESTADO DE FAVORITOS
  const [favorites, dispatch] = useReducer(favoritesReducer, initialState);
  const [isLoaded, setIsLoaded] = useState(false); 

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
        if (storedFavorites) {
          const loadedFavorites = JSON.parse(storedFavorites);
          if (loadedFavorites) {
             dispatch({ type: 'SET_FAVORITES', payload: loadedFavorites });
          }
        }
      } catch (error) {
        console.error('Failed to load favorites from storage', error);
      } finally {
        setIsLoaded(true); 
      }
    };
    loadFavorites();
  }, []); 
  useEffect(() => {
    if (isLoaded) {
      const saveFavorites = async () => {
        try {
          await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        } catch (error) {
          console.error('Failed to save favorites to storage', error);
        }
      };
      saveFavorites();
    }
  }, [favorites, isLoaded]);

  return (
    <FavoritesContext.Provider value={{ favorites, dispatch }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);