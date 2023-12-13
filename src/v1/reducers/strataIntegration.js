import { strataMasterIntegrationConstants } from '../constants';

const initialState = {
  apiKeyStatus: undefined,
  connectionStatus: undefined,
  dataImportLogId: undefined,
  importLogs: [],
  importLogFailedItems: [],
  importStatus: undefined,
  loading: true,
  wizardUrl: undefined
};

export const strataIntegration = (state = initialState, action) => {
  switch (action.type) {
    case strataMasterIntegrationConstants.GET_CONNECTION_STATUS:
      return {
        ...state,
        connectionStatus: action.payload.status,
        loading: false
      };
    case strataMasterIntegrationConstants.GET_IMPORT_LOGS:
      return {
        ...state,
        importLogs: action.payload.importing_items,
        importStatus: action.payload.status,
        loading: false
      };
    case strataMasterIntegrationConstants.GET_WIZARD_URL:
      return {
        ...state,
        wizardUrl: action.payload.url,
        loading: false
      };
    case strataMasterIntegrationConstants.UPDATE_DATA_IMPORT_LOG_ID:
      return {
        ...state,
        dataImportLogId: action.payload.id
      };
    case strataMasterIntegrationConstants.UPDATE_IMPORT_STATUS:
      return {
        ...state,
        importStatus: action.payload.status
      };
    case strataMasterIntegrationConstants.UPDATE_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case strataMasterIntegrationConstants.GET_FAILED_ITEM_DETAILS:
      return {
        ...state,
        importLogFailedItems: [].concat(
          {
            id: action.payload.id,
            failedItems: action.payload.failedItems,
            page: action.payload.page,
            totalPage: action.payload.totalPage
          },
          state.importLogFailedItems.filter((val) => val.id !== action.payload.id)
        )
      };
    default:
      return state;
  }
};
