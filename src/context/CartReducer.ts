import { ParsedProduct } from '@/types/data';

export type FetchAction = {
  readonly type: 'ADD_CART_ITEM' | 'REMOVE_CART_ITEM' | 'REMOVE_CART_ITEM_QUANTITY';
  readonly payload: ParsedProduct;
};

export type FetchState = ParsedProduct[];

export const fetchDataReducer = (state: FetchState, action: FetchAction): FetchState => {
  const { type, payload } = action;
  switch (type) {
    case 'ADD_CART_ITEM':
      return [...state, payload];
    case 'REMOVE_CART_ITEM_QUANTITY':
      if (state.length > 1) {
        const itemIndex = state.findIndex((item) => item.id === payload.id);
        if (itemIndex > -1) {
          return [...state.slice(0, itemIndex), ...state.slice(itemIndex + 1)];
        }
      }
      return state;
    case 'REMOVE_CART_ITEM':
      return [...state.filter((item) => item.id !== payload.id)];
    default:
      throw new Error('Unhandled action type: ' + action.type);
  }
};
