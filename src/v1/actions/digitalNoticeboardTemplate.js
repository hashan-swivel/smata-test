import { axiosInstance } from '../utils';
import { flashActions } from './flash';
import { digitalNoticeboardTemplateConstants } from '../constants';

const constants = digitalNoticeboardTemplateConstants;

const getDigitalNoticeboardTemplates = () => async (dispatch) => {
  dispatch({ type: constants.SET_DIGITAL_NOTICEBOARDS_TEMPLATES_LOADING, payload: true });

  await axiosInstance
    .get(constants.BASE_PATH)
    .then((res) => {
      const { data } = res;
      dispatch({
        type: constants.GET_DIGITAL_NOTICEBOARD_TEMPLATES,
        payload: data.digital_noticeboard_templates
      });
    })
    .catch((error) => {
      dispatch({ type: constants.SET_DIGITAL_NOTICEBOARDS_TEMPLATES_LOADING, payload: false });
      dispatch(flashActions.showError(error));
    });
};

export const digitalNoticeboardTemplateActions = { getDigitalNoticeboardTemplates };
