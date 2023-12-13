import { GET_CATEGORIES, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_ERROR } from './types';
import { axiosInstance } from '../utils/axiosInstance';

export const getCategories = () => async (dispatch) => {
  try {
    dispatch({ type: GET_CATEGORIES });
    const { data } = await axiosInstance.get(`/v1/categories`);
    dispatch({ type: GET_CATEGORIES_SUCCESS, payload: data.categories });
  } catch (error) {
    console.error('Error @categories.js getCategories', error);
    dispatch({
      type: GET_CATEGORIES_ERROR,
      error
    });
  }
};
