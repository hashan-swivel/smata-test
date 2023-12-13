import {
  SET_SEARCH_FILTERS,
  SET_TOGGLE_VALUE,
  GET_DOCUMENTS,
  GET_DOCUMENTS_SUCCESS,
  GET_DOCUMENTS_ERROR,
  GET_SINGLE_DOCUMENT,
  GET_ALL_GL_CODES,
  GET_RECENT_GL_CODES,
  GET_ADMIN_GL_CODES,
  GET_CWF_GL_CODES,
  GET_GROUP_CODES,
  RESET_INVOICE,
  SET_EXPORT_DOCUMENTS,
  SET_SEARCH_VALUE,
  SET_SEARCH_RESULTS,
  SET_DOCUMENTS_LOADING,
  SET_SORT_OPTIONS
} from '../actions/types';

export const initialState = {
  searchFilters: [],
  searchValue: '',
  searchDocuments: null,
  searchMeta: {
    total_count: 0,
    page: 1,
    per_page: 50,
    total_pages: 1
  },
  toggleActions: {
    favorite: false,
    all: false,
    task: false,
    priority_invoice: false,
    deleted: false
  },
  loading: true,
  documents: [],
  currentDocument: null,
  allGlCodes: null,
  glCodes: null,
  recentGlCodes: null,
  adminGlCodes: null,
  cwfGlCodes: null,
  groupCodes: null,
  errorCode: false,
  meta: {
    total_count: 0,
    page: 1,
    per_page: 50,
    total_pages: 1
  },
  // filteredDocuments: [],
  error: null,
  exportDocuments: {
    status: '',
    exportedPercent: 0
  },
  sortOptions: {
    order: null,
    sort: null
  }
};

export const dms = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_FILTERS:
      return {
        ...state,
        searchFilters: action.payload
      };
    case SET_SEARCH_VALUE:
      return {
        ...state,
        searchValue: action.payload
      };
    case SET_TOGGLE_VALUE:
      return {
        ...state,
        toggleActions: action.payload
      };
    case GET_DOCUMENTS:
      return {
        ...state,
        loading: true
      };
    case GET_DOCUMENTS_SUCCESS:
      return {
        ...state,
        documents: action.payload.documents,
        meta: action.payload.meta,
        loading: false
      };
    case GET_DOCUMENTS_ERROR:
      return {
        ...state,
        error: action.error,
        loading: false
      };
    case GET_SINGLE_DOCUMENT:
      return {
        ...state,
        currentDocument: action.payload?.currentDocument,
        errorCode: action.payload?.errorCode
      };
    case GET_ADMIN_GL_CODES:
      return {
        ...state,
        adminGlCodes: action.payload
      };
    case GET_RECENT_GL_CODES:
      return {
        ...state,
        recentGlCodes: action.payload
      };
    case GET_CWF_GL_CODES:
      return {
        ...state,
        cwfGlCodes: action.payload
      };
    case GET_ALL_GL_CODES:
      return {
        ...state,
        allGlCodes: action.payload
      };
    case GET_GROUP_CODES:
      return {
        ...state,
        groupCodes: action.payload
      };
    case RESET_INVOICE:
      return {
        ...state,
        currentDocument: null,
        groupCodes: null,
        glCodes: null
      };
    case SET_EXPORT_DOCUMENTS:
      return {
        ...state,
        exportDocuments: action.payload
      };
    case SET_SEARCH_RESULTS:
      return {
        ...state,
        searchDocuments: action.payload?.documents,
        searchMeta: action.payload?.meta
      };
    case SET_DOCUMENTS_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SET_SORT_OPTIONS:
      return {
        ...state,
        sortOptions: action.payload
      };
    default:
      return state;
  }
};
