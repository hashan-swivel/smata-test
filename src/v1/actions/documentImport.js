import { axiosInstance } from '../utils';
import { flashActions } from './flash';
import { documentImportConstants } from '../constants';

// BE doesn't have an end-point to get the import status.
// Have to do it like this.
const getImportStatus = () => async (dispatch) => {
  dispatch({ type: documentImportConstants.SET_LOADING, payload: true });

  await axiosInstance
    .get(documentImportConstants.BASE_PATH)
    .then((res) => {
      dispatch({
        type: documentImportConstants.GET_IMPORT_LOGS,
        payload: res.data.third_party_import_logs
      });
      if (res.data.third_party_import_logs.length === 0) {
        dispatch({ type: documentImportConstants.SET_IMPORT_STATUS, payload: 'not_started' });
      } else {
        dispatch({ type: documentImportConstants.SET_IMPORT_STATUS, payload: 'started' });
      }
    })
    .catch((error) => {
      dispatch({ type: documentImportConstants.SET_LOADING, payload: false });
      dispatch(flashActions.showError(error));
    });
};

const createImportLogs = (account_ids) => async (dispatch) => {
  await axiosInstance
    .post(documentImportConstants.BASE_PATH, { account_ids })
    .then(() => dispatch(getImportStatus()))
    .catch((error) => {
      dispatch({ type: documentImportConstants.SET_LOADING, payload: false });
      dispatch(flashActions.showError(error));
    });
};

const clearLogItems = (logId) => (dispatch) => {
  dispatch({
    type: documentImportConstants.GET_IMPORT_LOG_ITEMS,
    payload: { id: logId, failedItems: [] }
  });
};

const getLogItems =
  (logId, page = 1, per_page = 25) =>
  async (dispatch) => {
    await axiosInstance
      .get(`${documentImportConstants.BASE_PATH}/${logId}/third_party_item_logs`, {
        params: { page, per_page }
      })
      .then((res) => {
        dispatch({
          type: documentImportConstants.GET_IMPORT_LOG_ITEMS,
          payload: {
            id: logId,
            logItems: res?.data?.third_party_item_logs,
            page: res?.data?.meta.page,
            totalPage: res?.data?.meta.total_pages
          }
        });
      })
      .catch((error) => {
        dispatch(flashActions.showError(error));
      });
  };

export const documentImportActions = {
  clearLogItems,
  createImportLogs,
  getLogItems,
  getImportStatus
};
