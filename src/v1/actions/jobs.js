import queryString from 'query-string';
import { axiosInstance } from '../utils/axiosInstance';

export const getJobs = (params) => async (dispatch) => {
  const queries = queryString.stringify({
    ...params
  });
  try {
    const apiUrl = `/v1/jobs${queries ? `?${queries}` : ''}`;
    const res = await axiosInstance.get(apiUrl);
    return res.data;
  } catch (error) {
    console.error('Error @jobs.js getJobs', error);
  }
};
