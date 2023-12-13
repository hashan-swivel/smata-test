import { buildingDocumentCategoryConstants } from '../constants';

const constants = buildingDocumentCategoryConstants;

export const initialState = {
  list: [],
  listLoading: false
};

export const buildingDocumentCategories = (state = initialState, action) => {
  switch (action.type) {
    case constants.GET_BUILDING_DOCUMENT_CATEGORIES:
      return {
        ...state,
        list: action.payload,
        listLoading: false
      };
    case constants.SET_BUILDING_DOCUMENT_CATEGORY_LOADING:
      return {
        ...state,
        listLoading: action.payload
      };
    default:
      return state;
  }
};
