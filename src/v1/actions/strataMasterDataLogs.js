import { axiosInstance } from '../utils';
import { flashActions } from './flash';
import { strataMasterDataLogsConstants } from '../constants';

export const getStrataMasterDataLogs =
  (resourceName, currentPage, perPage, organisationId, setLoading, reload, changedPage) =>
  async (dispatch) => {
    const params = {
      page: currentPage || 1,
      per_page: perPage,
      organisation_id: organisationId,
      resource_name: resourceName
    };
    try {
      if (reload) {
        dispatch({ type: strataMasterDataLogsConstants.RESET_INIT_RESOURCE_DATA_LOGS });
      }
      if (changedPage) {
        dispatch({ type: strataMasterDataLogsConstants.RESET_RESOURCE_DATA_LOGS });
      }
      const { data } = await axiosInstance.get('v1/strata_master_data_logs', { params });
      if (data && data.strata_master_data_logs) {
        setLoading(false);
        dispatch({ type: strataMasterDataLogsConstants.GET_RESOURCE_DATA_LOGS, payload: data });
      }
    } catch (error) {
      dispatch(flashActions.showError(error));
    }
  };

export const getOrganisations = () => async (dispatch) => {
  const params = {
    use_strata_master: true
  };
  try {
    const { data } = await axiosInstance.get('v1/organisations', { params });
    dispatch({ type: strataMasterDataLogsConstants.GET_ORGANISATIONS, payload: data });
  } catch (error) {
    dispatch(flashActions.showError(error));
  }
};

export const getAvailableResources = () => async (dispatch) => {
  try {
    const { data } = await axiosInstance.get('v1/strata_master_data_logs/available_resources');
    dispatch({ type: strataMasterDataLogsConstants.GET_AVAILABLE_RESOURCES, payload: data });
  } catch (error) {
    dispatch(flashActions.showError(error));
  }
};

export const strataMasterDataLogs = {
  getStrataMasterDataLogs,
  getOrganisations,
  getAvailableResources
};
