import { RecommendationsFetchState, useRecommendations } from '@/hooks/useRecommendations';
import { ParsedProduct } from '@/types/data';
import { Dispatch, PropsWithChildren, createContext, useContext, useMemo, useReducer } from 'react';
import { PRUNER_ID, TREE_PLANTING_KIT_ID, TREE_PRODUCT_TYPE } from '../util/constants';
import { FetchAction, FetchState, fetchDataReducer } from './CartReducer';

type ContextState = {
  data: FetchState;
  dispatch: Dispatch<FetchAction>;
  recommendationData: RecommendationsFetchState;
};

export const CartContext = createContext({} as ContextState);

export function CartProvider({ children }: PropsWithChildren) {
  const rawRecommendationData = useRecommendations();
  const { data: recommendations } = rawRecommendationData;
  const [data, dispatch] = useReducer(fetchDataReducer, []);

  const parsedRecommendations = recommendations ? filterRecommendations(recommendations, data) : null;
  const { loading, error } = rawRecommendationData;
  const recommendationData = {
    data: parsedRecommendations,
    loading,
    error,
  };

  const value = useMemo(() => ({ data, dispatch, recommendationData }), [data, recommendationData]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function filterRecommendations(recommendations: ParsedProduct[], cart: FetchState) {
  const recommendationsWithoutPruner = recommendations?.filter((item) => item.id !== PRUNER_ID);
  const prunerInCart = cart?.find((item) => item.id === PRUNER_ID);

  const treeQuantityInCart = cart?.filter(({ product_type }) => product_type === TREE_PRODUCT_TYPE).length || 0;
  const treePlantingKitQuantityInCart = cart?.filter(({ id }) => id === TREE_PLANTING_KIT_ID).length || 0;

  let filteredRecommendations = prunerInCart ? recommendationsWithoutPruner : recommendations;
  const filteredRecommendationsWithoutTreePlantingKit = filteredRecommendations?.filter(
    (item) => item.id !== TREE_PLANTING_KIT_ID,
  );
  filteredRecommendations =
    treeQuantityInCart <= treePlantingKitQuantityInCart && treeQuantityInCart > 0
      ? filteredRecommendationsWithoutTreePlantingKit
      : filteredRecommendations;

  return filteredRecommendations;
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const { data, dispatch, recommendationData } = context;

  function addCartItem(product: ParsedProduct) {
    dispatch({ type: 'ADD_CART_ITEM', payload: product });
  }

  function removeCartItem(product: ParsedProduct) {
    dispatch({ type: 'REMOVE_CART_ITEM', payload: product });
  }

  function removeCartItemQuantity(product: ParsedProduct) {
    dispatch({ type: 'REMOVE_CART_ITEM_QUANTITY', payload: product });
  }

  return {
    data,
    addCartItem,
    removeCartItem,
    removeCartItemQuantity,
    recommendationData,
  };
}
