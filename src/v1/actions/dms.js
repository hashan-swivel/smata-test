import queryString from 'query-string';
import axios from 'axios';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import {
  SET_SEARCH_FILTERS,
  SET_TOGGLE_VALUE,
  GET_DOCUMENTS,
  GET_DOCUMENTS_SUCCESS,
  GET_DOCUMENTS_ERROR,
  GET_SINGLE_DOCUMENT,
  GET_RECENT_GL_CODES,
  GET_ADMIN_GL_CODES,
  GET_CWF_GL_CODES,
  GET_ALL_GL_CODES,
  GET_GROUP_CODES,
  RESET_INVOICE,
  SET_EXPORT_DOCUMENTS,
  SET_SEARCH_VALUE,
  SET_SEARCH_RESULTS,
  SET_DOCUMENTS_LOADING,
  SET_SORT_OPTIONS
} from './types';
import { axiosInstance, chunk } from '../utils';
import { documentConstants } from '../constants';
import { flashActions } from './flash';

const { CancelToken } = axios;
let documentCancel;

export const setToggleActions = (payload) => (dispatch) => {
  dispatch({
    type: SET_TOGGLE_VALUE,
    payload
  });
};

export const setFilters = (payload) => (dispatch) => {
  dispatch({
    type: SET_SEARCH_FILTERS,
    payload
  });
};

export const setSortOptions = (order, sort) => (dispatch) => {
  dispatch({
    type: SET_SORT_OPTIONS,
    payload: { order, sort }
  });
};

export const setSearchValue = (payload) => (dispatch) => {
  dispatch({
    type: SET_SEARCH_VALUE,
    payload
  });
};

export const setFilteredItems = (payload) => (dispatch) => {
  dispatch({
    type: GET_DOCUMENTS_SUCCESS,
    payload
  });
};

export const setSearchItems = (payload) => (dispatch) => {
  dispatch({
    type: SET_SEARCH_RESULTS,
    payload
  });
};

export const setDocumentsLoading = (payload) => (dispatch) => {
  dispatch({
    type: SET_DOCUMENTS_LOADING,
    payload
  });
};

export const getDocuments =
  (
    currentPage,
    perPage,
    order,
    sort,
    favorites,
    deleted,
    duplicates,
    myTasks,
    priority_invoices,
    dateRange = [],
    viewType,
    organisationId,
    searchFilters = []
  ) =>
  async (dispatch) => {
    const [dateStart, dateEnd] = dateRange;
    const filters = {};
    const organisation = organisationId !== null ? { organisation_id: organisationId } : {};

    searchFilters.forEach((searchFilter) => {
      let queryKey = searchFilter.type;
      const queryValue = searchFilter.item;

      if (queryKey === 'type') queryKey = 'category';
      if (queryKey === 'tag') queryKey = 'tags';

      filters[queryKey] = queryValue;
    });

    if (
      filters.category &&
      documentConstants.LEVY_NOTICES_CATEGORIES.includes(filters.category.trim().toLowerCase())
    ) {
      filters.is_levy_notice = true;
      filters.category = null;
    } else {
      filters.is_levy_notice = null;
    }

    const queries = queryString.stringify({
      page: currentPage || 1,
      per_page: perPage,
      order,
      sort,
      my_tasks: myTasks,
      favorites,
      only_deleted: deleted,
      invoice_duplicate: duplicates,
      priority_invoices,
      start_date: dateStart,
      end_date: dateEnd,
      is_invoice: viewType === 'invoices',
      scope: organisationId ? 'all' : null,
      time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ...organisation,
      ...filters
    });

    documentCancel && documentCancel();

    try {
      dispatch({ type: GET_DOCUMENTS });
      const endpoint = organisationId ? '/organisation_documents' : '';
      const apiUrl = `/v1/documents${endpoint}${queries ? `?${queries}` : ''}`;
      const documentsReq = await axiosInstance.get(apiUrl, {
        cancelToken: new CancelToken(function executor(c) {
          documentCancel = c;
        })
      });

      dispatch({
        type: GET_DOCUMENTS_SUCCESS,
        payload: documentsReq.data
      });
    } catch (error) {
      if (axios.isCancel(error)) {
        //  Do nothing
      } else {
        dispatch({
          type: GET_DOCUMENTS_ERROR,
          error
        });
      }
    }
  };

export const getSingleDocument = (id) => async (dispatch) => {
  await axiosInstance
    .get(`/v1/documents/${id}`)
    .then((res) => {
      dispatch({
        type: GET_SINGLE_DOCUMENT,
        payload: { currentDocument: res.data, errorCode: false }
      });
    })
    .catch((error) => {
      dispatch({ type: GET_SINGLE_DOCUMENT, payload: { errorCode: error?.response?.status } });
    });
};

export const updateCurrentDocument = (data) => async (dispatch) => {
  dispatch({ type: GET_SINGLE_DOCUMENT, payload: { currentDocument: data, errorCode: false } });
  dispatch(flashActions.showSuccess('Document has been saved'));
};

export const updateDocumentStatus =
  (documentName, id, status, note = null, notifyContractor = false) =>
  async (dispatch) => {
    try {
      // DISPATCH ACTION TO TOGGLE LOADING IN DMS GLOBAL STATE - SHOW THIS ON THE FRONTEND
      await axiosInstance.put(
        `/v1/documents/${id}?invoice_attributes[status]=${status}&status_note=${note}&${
          notifyContractor ? `notify_contractor=true` : ''
        }`
      );
      dispatch(flashActions.showSuccess(`You have ${status} ${documentName}`));
    } catch (error) {
      dispatch(flashActions.showError(error));
    }
  };

export const getGroupCodes = (spNumber) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.get(`/v1/documents/group_codes?sp_number=${spNumber}`);
    dispatch({ type: GET_GROUP_CODES, payload: data.group_codes });
  } catch (error) {
    dispatch(flashActions.showError(error));
  }
};

export const resetInvoice = () => (dispatch) => {
  dispatch({ type: RESET_INVOICE });
};

export const bulkRemindDocumentsActionUsers = (documents) => async (dispatch) => {
  try {
    dispatch(
      flashActions.showSuccess(
        `Remind actions users ${documents.length} documents, please wait for it to complete`
      )
    );
    await Promise.all(
      documents.map(async (doc) => {
        if (doc.currently_with && doc.currently_with.length) {
          const queries = queryString.stringify(
            { remind_user_ids: doc.currently_with },
            { arrayFormat: 'bracket' }
          );
          const apiUrl = `/v1/documents/${doc.id}/remind_action_users?${queries}`;
          await axiosInstance.post(apiUrl);
        }
      })
    );

    dispatch(
      flashActions.showSuccess(`Remind actions users ${documents.length} documents complete`)
    );
  } catch (error) {
    dispatch(flashActions.showError(error));
  }
};

export const bulkDeleteDocuments = (documents, setReload) => async () => {
  const MySwal = withReactContent(Swal);
  MySwal.fire({
    text: `Deleting ${documents.length} documents`,
    didOpen() {
      MySwal.showLoading();
    },
    allowEscapeKey: false,
    allowOutsideClick: false
  });

  const failedDocIds = [];
  const deleteItem = async (itemId) => {
    await axiosInstance
      .delete(`/v1/documents/${itemId}`)
      .then()
      .catch((err) => failedDocIds.push(itemId));
  };

  const batches = chunk(
    documents.map((doc) => doc.id),
    5
  ); // [[item1, item2, ..., item15], [item16, ..., item30]]

  while (batches.length) {
    const batch = batches.shift();
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(batch.map((promiseItem) => deleteItem(promiseItem)));
  }

  MySwal.close(); // close progress message

  if (failedDocIds.length > 0) {
    const messageHtml = `
        <ul>
          ${failedDocIds
            .map((id) => `<li>${documents.find((doc) => doc.id === id)?.display_name}</li>`)
            .join('')}
        </ul>
      `;
    MySwal.fire({
      title: 'Failed to delete below documents',
      html: messageHtml,
      didOpen(popup) {
        MySwal.hideLoading();
      },
      confirmButtonText: 'Close',
      customClass: {
        confirmButton: 'button button--secondary'
      }
    });
  }

  setTimeout(() => setReload(true), 1200); // Because of Elasticsearch 1 second delay issue
};
