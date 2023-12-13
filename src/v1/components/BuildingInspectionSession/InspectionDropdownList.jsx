import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Loading } from '../Loading';
import { buildingInspectionSessionActions, modalActions } from '../../../actions';
import InspectionDropdownItem from './InspectionDropdownItem';

const InspectionDropdownList = ({ list, listLoading, setDropdownOpen, dispatch }) => {
  useEffect(() => {
    dispatch(buildingInspectionSessionActions.getInspectionSessions());
  }, []);

  const handleItemOnclick = (item) => {
    dispatch(modalActions.showModal('BUILDING_INSPECTION_SESSION', { item }));
    setDropdownOpen(false);
  };

  const inspectionList = () => {
    if (list.length === 0) {
      return (
        <div className='building-inspection-dropdown-list-item'>
          <div className='building-inspection-session-header'>
            <div className='building-inspection-session-title'>
              <h4>No Active Inspection found</h4>
            </div>
          </div>
        </div>
      );
    }

    return list.map((item) => (
      <InspectionDropdownItem key={item.id} item={item} handleItemOnclick={handleItemOnclick} />
    ));
  };

  return (
    <div className='building-inspection-session-dropdown-list'>
      {listLoading ? <Loading /> : inspectionList()}
    </div>
  );
};

export default connect((state) => state.buildingInspectionSessions)(InspectionDropdownList);
