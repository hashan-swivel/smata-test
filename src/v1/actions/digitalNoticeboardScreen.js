import { axiosInstance } from '../utils';
import { digitalNoticeboardScreenConstants } from '../constants';

const loadDigitalNoticeboardScreenOptions = (buildingProfile, inputValue, callback) => {
  const params = {
    by_account: buildingProfile.id,
    q: inputValue?.length > 0 ? inputValue : null
  };

  axiosInstance
    .get(digitalNoticeboardScreenConstants.BASE_PATH, { params })
    .then((res) => callback(res.data))
    .catch(() => callback([]));
};

export const digitalNoticeboardScreenActions = {
  loadDigitalNoticeboardScreenOptions
};
