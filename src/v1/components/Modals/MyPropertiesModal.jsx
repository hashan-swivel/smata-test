import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Loading } from '../Loading';
import { locationContactActions } from '../../../actions';
import ModalContainer from './ModalContainer';

import './MyPropertiesModal.module.scss';

const MyPropertiesModal = ({ list, loading, dispatch }) => {
  useEffect(() => {
    dispatch(locationContactActions.getLocationContacts());
  }, []);

  const locationContactsList = () => {
    if (list.length === 0) {
      return (
        <h3 className='text--center' style={{ padding: '10px 0' }}>
          No Properties Found
        </h3>
      );
    }

    return list.map((locationContact) => (
      <div className='card my-properties-card-item-container' key={locationContact.id}>
        <div className='card-header'>
          <h4>{locationContact.site_plan_id}</h4>
        </div>
        <div className='card-body'>
          <div className='my-properties-card-item'>
            <div className='my-properties-card-item-row'>
              <div className='heading'>
                <strong>Lot Number</strong>
              </div>
              <div className='text'>{locationContact.lot_number || 'N/A'}</div>
            </div>
            <div className='my-properties-card-item-row'>
              <div className='heading'>
                <strong>Unit Number</strong>
              </div>
              <div className='text'>{locationContact.unit_number || 'N/A'}</div>
            </div>
            <div className='my-properties-card-item-row'>
              <div className='heading'>
                <strong>Location</strong>
              </div>
              <div className='text'>{locationContact.location_name}</div>
            </div>
            <div className='my-properties-card-item-row'>
              <div className='heading'>
                <strong>Role</strong>
              </div>
              <div className='text'>{locationContact.contact_role}</div>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <ModalContainer title='My Properties' reactModalProps={{ className: 'c-modal__container' }}>
      <div className='c-modal__body'>
        {loading ? <Loading fill='#000000' componentLoad /> : locationContactsList()}
      </div>
    </ModalContainer>
  );
};

export default connect((state) => state.locationContacts)(MyPropertiesModal);
