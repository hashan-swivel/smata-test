import { axiosInstance } from '../utils';
import { flashActions } from './flash';
import { strataMasterIntegrationConstants } from '../constants';

const createApiKey = (orgId) => async (dispatch) => {
  try {
    const { status } = await axiosInstance.post(
      `external_apps/strata_master/organisations?id=${orgId}`
    );
    if (status === 201) {
      dispatch({
        type: strataMasterIntegrationConstants.GET_CONNECTION_STATUS,
        payload: { status: 'connection_established' }
      });
    }
  } catch (error) {
    if (error?.response?.status === 302) {
      dispatch({
        type: strataMasterIntegrationConstants.GET_CONNECTION_STATUS,
        payload: { status: 'connection_established' }
      });
    } else {
      dispatch(flashActions.showError(error));
    }
  }
};

const clearFailedItemDetails = (logId) => (dispatch) => {
  dispatch({
    type: strataMasterIntegrationConstants.GET_FAILED_ITEM_DETAILS,
    payload: { id: logId, failedItems: [] }
  });
};

const createImportLogs = (orgId) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.post(
      `/external_apps/strata_master/import_wizard?organisation_id=${orgId}`
    );
    if (data) {
      dispatch({ type: strataMasterIntegrationConstants.UPDATE_DATA_IMPORT_LOG_ID, payload: data });
    }
  } catch (error) {
    dispatch(flashActions.showError(error));
  }
};

const getConnectionStatus = (orgId) => async (dispatch) => {
  await axiosInstance
    .get(`external_apps/strata_master/organisations/${orgId}/status`)
    .then((res) => {
      const { data } = res;
      dispatch({ type: strataMasterIntegrationConstants.UPDATE_LOADING, payload: true });
      dispatch({ type: strataMasterIntegrationConstants.GET_CONNECTION_STATUS, payload: data });
    })
    .catch((error) => {
      dispatch({ type: strataMasterIntegrationConstants.UPDATE_LOADING, payload: false });
      dispatch(flashActions.showError(error));
    });
};

const getFailedItemDetails =
  (logId, page = 1) =>
  async (dispatch) => {
    try {
      await axiosInstance
        .get(`external_apps/strata_master/import_wizard/${logId}/failed_items?page=${page}`)
        .then((res) => {
          dispatch({
            type: strataMasterIntegrationConstants.GET_FAILED_ITEM_DETAILS,
            payload: {
              id: logId,
              failedItems: res?.data?.failed_items,
              page: res?.data?.meta.page,
              totalPage: res?.data?.meta.total_pages
            }
          });
        });
    } catch (error) {
      dispatch(flashActions.showError(error));
    }
  };

const getImportLogs = (dataImportLogId) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.get(
      `external_apps/strata_master/import_wizard/${dataImportLogId}/status`
    );
    dispatch({ type: strataMasterIntegrationConstants.UPDATE_LOADING, payload: true });
    dispatch({ type: strataMasterIntegrationConstants.GET_IMPORT_LOGS, payload: data });
  } catch (error) {
    dispatch(flashActions.showError(error));
  }
};

const getWizardUrl = (orgId) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.get(
      `external_apps/strata_master/organisations/${orgId}/get_wizard_url`
    );
    dispatch({ type: strataMasterIntegrationConstants.UPDATE_LOADING, payload: true });
    dispatch({ type: strataMasterIntegrationConstants.GET_WIZARD_URL, payload: data });
  } catch (error) {
    dispatch(flashActions.showError(error));
  }
};

const reimportFailedItems = (logId, dataImportLogId) => async (dispatch) => {
  try {
    await axiosInstance
      .put(`external_apps/strata_master/import_wizard/${logId}/resume_import`)
      .then(() => {
        dispatch(clearFailedItemDetails(logId));

        if (dataImportLogId) {
          dispatch(getImportLogs(dataImportLogId));
        }
      });
  } catch (error) {
    dispatch(flashActions.showError(error));
  }
};

const updateDataImportLogId = (id) => (dispatch) => {
  dispatch({ type: strataMasterIntegrationConstants.UPDATE_DATA_IMPORT_LOG_ID, payload: { id } });
};

const restartImporting = (dataImportLogId) => async (dispatch) => {
  try {
    await axiosInstance
      .put(`external_apps/strata_master/import_wizard/${dataImportLogId}/restart_import`)
      .then(() => {
        dispatch(getImportLogs(dataImportLogId));
      });
  } catch (error) {
    dispatch(flashActions.showError(error));
  }
};

const stopImporting = (dataImportLogId) => async (dispatch) => {
  try {
    await axiosInstance
      .put(`external_apps/strata_master/import_wizard/${dataImportLogId}/stop_import`)
      .then(() => {
        dispatch(getImportLogs(dataImportLogId));
      });
  } catch (error) {
    dispatch(flashActions.showError(error));
  }
};

export const strataIntegrationActions = {
  createApiKey,
  clearFailedItemDetails,
  createImportLogs,
  getConnectionStatus,
  getFailedItemDetails,
  getImportLogs,
  getWizardUrl,
  reimportFailedItems,
  updateDataImportLogId,
  restartImporting,
  stopImporting
};
