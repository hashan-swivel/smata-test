import { axiosInstance } from '../utils';
import { flashActions } from './flash';
import { buildingDocumentCategoryConstants } from '../constants';

const constants = buildingDocumentCategoryConstants;

const getBuildingDocumentCategories = (spNumber, params) => async (dispatch) => {
  dispatch({ type: constants.SET_BUILDING_DOCUMENT_CATEGORY_LOADING, payload: true });

  await axiosInstance
    .get(constants.BASE_PATH.replace('account-id', spNumber), { params })
    .then((res) => {
      const { data } = res;
      dispatch({
        type: constants.GET_BUILDING_DOCUMENT_CATEGORIES,
        payload: data.building_document_categories
      });
    })
    .catch((error) => {
      dispatch({ type: constants.SET_BUILDING_DOCUMENT_CATEGORY_LOADING, payload: false });
      dispatch(flashActions.showError(error));
    });
};

export const buildingDocumentCategoryActions = {
  getBuildingDocumentCategories
};
