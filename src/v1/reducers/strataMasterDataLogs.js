import { strataMasterDataLogsConstants } from '../constants';

const initialState = {
  loading: true,
  organisations: [],
  availableResources: [],
  resourceDataLogs: [],
  meta: {
    total_count: strataMasterDataLogsConstants.INIT_TOTAL_COUNT,
    page: strataMasterDataLogsConstants.INIT_FIRST_PAGE,
    per_page: strataMasterDataLogsConstants.INIT_PER_PAGE,
    total_pages: strataMasterDataLogsConstants.INIT_FIRST_PAGE
  }
};

export const strataMasterDataLogs = (state = initialState, action) => {
  switch (action.type) {
    case strataMasterDataLogsConstants.GET_ORGANISATIONS:
      return {
        ...state,
        organisations: action.payload.organisations
      };
    case strataMasterDataLogsConstants.GET_AVAILABLE_RESOURCES:
      return {
        ...state,
        availableResources: action.payload.available_resources
      };
    case strataMasterDataLogsConstants.GET_RESOURCE_DATA_LOGS:
      return {
        ...state,
        resourceDataLogs: action.payload.strata_master_data_logs || [],
        meta: action.payload.meta,
        loading: false
      };
    case strataMasterDataLogsConstants.RESET_RESOURCE_DATA_LOGS:
      return {
        ...state,
        resourceDataLogs: []
      };
    case strataMasterDataLogsConstants.RESET_INIT_RESOURCE_DATA_LOGS:
      return {
        ...state,
        resourceDataLogs: [],
        meta: {
          total_count: strataMasterDataLogsConstants.INIT_TOTAL_COUNT,
          page: strataMasterDataLogsConstants.INIT_FIRST_PAGE,
          per_page: strataMasterDataLogsConstants.INIT_PER_PAGE,
          total_pages: strataMasterDataLogsConstants.INIT_FIRST_PAGE
        }
      };
    default:
      return state;
  }
};
