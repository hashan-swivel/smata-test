import { documentImportConstants } from '../constants';

const initialState = {
  importStatus: undefined,
  loading: true,
  importLogs: [],
  importLogItems: []
};

export const documentImport = (state = initialState, action) => {
  switch (action.type) {
    case documentImportConstants.SET_IMPORT_STATUS:
      return {
        ...state,
        importStatus: action.payload,
        loading: false
      };
    case documentImportConstants.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case documentImportConstants.GET_IMPORT_LOGS:
      return {
        ...state,
        importLogs: action.payload,
        loading: false
      };
    case documentImportConstants.GET_IMPORT_LOG_ITEMS:
      return {
        ...state,
        importLogItems: [].concat(
          {
            id: action.payload.id,
            logItems: action.payload.logItems,
            page: action.payload.page,
            totalPage: action.payload.totalPage
          },
          state.importLogItems.filter((val) => val.id !== action.payload.id)
        )
      };
    default:
      return state;
  }
};
