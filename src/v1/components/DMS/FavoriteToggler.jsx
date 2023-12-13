import { useState } from 'react';
import { axiosInstance } from '../../../utils';
import { flashActions } from '../../../actions';

import './FavoriteToggler.module.scss';

const FavoriteToggler = ({ attachmentId, favorites, dispatch }) => {
  const [favorite, setFavorite] = useState(
    (favorites && favorites.includes(attachmentId)) || false
  );
  const [disabledFavorite, setDisabledFavorite] = useState(false);

  const onToggle = async () => {
    setDisabledFavorite(true);

    await axiosInstance
      .put(`/v1/documents/${attachmentId}/update_favorite`)
      .then((res) => {
        setTimeout(() => {
          dispatch(flashActions.showSuccess(res.data.message));
          setFavorite(!favorite);
          setDisabledFavorite(false);
        }, 300);
      })
      .catch((err) => {
        dispatch(flashActions.showError(err));
        setDisabledFavorite(false);
      });
  };

  return (
    <button
      type='button'
      onClick={onToggle}
      title={favorite ? 'Remove from favourites' : 'Favourite document'}
      disabled={disabledFavorite}
      className='favorite'
    >
      <span
        className={`icon icon ${favorite ? 'icon-heart-solid-red' : 'icon-heart-outline-dark'}`}
      />
    </button>
  );
};

export default FavoriteToggler;
