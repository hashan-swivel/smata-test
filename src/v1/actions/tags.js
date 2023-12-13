import { GET_TAGS, GET_TAGS_SUCCESS, GET_TAGS_ERROR } from './types';
import { axiosInstance } from '../utils/axiosInstance';

export const getOrganisationTags = () => async (dispatch) => {
  try {
    dispatch({ type: GET_TAGS });
    const { data } = await axiosInstance.get(`/v1/tags`);

    dispatch({ type: GET_TAGS_SUCCESS, payload: data.tags });
  } catch (error) {
    dispatch({
      type: GET_TAGS_ERROR,
      error
    });
  }
};
