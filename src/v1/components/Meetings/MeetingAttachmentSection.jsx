import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { axiosInstance, warningSwal } from '../../../utils';
import { meetingAttachmentConstants } from '../../../constants';
import { flashActions, meetingAttachmentActions, modalActions } from '../../../actions';
import { Loading } from '../Loading';

//import './MeetingAttachmentSection.module.scss';

const menuPortalTarget = typeof window !== 'undefined' ? document.getElementById('__next') : null;
const MeetingAttachmentItem = ({
  item,
  handleDeleteAttachment,
  handlePreviewAttachment,
  currentUser
}) => {
  const meetingItemActions = [{ label: 'Download', value: 'download', href: item.links?.file_url }];
  if (currentUser?.isTenantManager) meetingItemActions.push({ label: 'Delete', value: 'delete' });

  return (
    <div key={item.id} className='meeting-attachment-thumbnail'>
      {item.links?.thumb_url ? (
        <a
          onClick={() => handlePreviewAttachment(item)}
          type='button'
          className='meeting-attachment-thumbnail-preview'
          style={{ backgroundImage: `url(${item.links?.thumb_url})` }}
        />
      ) : (
        <a
          onClick={() => handlePreviewAttachment(item)}
          type='button'
          className='meeting-attachment-thumbnail-preview'
        />
      )}
      <p className='meeting-attachment-thumbnail-details'>
        <a
          type='button'
          onClick={() => handlePreviewAttachment(item)}
          className='d-block meeting-attachment-thumbnail-name'
        >
          {item.title}
        </a>
        <span className='d-block attachment-thumbnail-details-title-options'>
          {item?.file_size && <span className='d-block text--secondary'>{item?.file_size}</span>}
        </span>
      </p>
      <div className='meeting-attachment-thumbnail-actions'>
        <Select
          options={meetingItemActions}
          value={{ label: '...', value: '' }}
          placeholder='...'
          classNamePrefix='react-select'
          menuPortalTarget={menuPortalTarget}
          components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
          styles={{
            valueContainer: (base) => ({ ...base, padding: 0, paddingRight: '20px' }),
            menu: (base) => ({ ...base, right: 0, width: 'max-content', minWidth: '100%' }),
            control: (base) => ({
              ...base,
              cursor: 'pointer',
              background: 'transparent !important',
              borderColor: 'transparent !important'
            }),
            singleValue: (base) => ({
              ...base,
              color: '#000 !important',
              fontWeight: 'bold',
              fontSize: '1.3rem'
            }),
            placeholder: (base) => ({
              ...base,
              fontWeight: 'bold',
              color: '#000 !important',
              fontSize: '1.3rem'
            }),
            input: (base) => ({ ...base, color: 'transparent' })
          }}
          onChange={(selectedOption) => {
            if (selectedOption?.value === 'download') {
              window.open(selectedOption.href, '_blank');
            }
            if (selectedOption?.value === 'delete') {
              handleDeleteAttachment(item.id);
            }
          }}
        />
      </div>
    </div>
  );
};

const MeetingAttachmentSection = ({ meeting, list, listLoading, dispatch }) => {
  const currentUser = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    dispatch(meetingAttachmentActions.getMeetingAttachments({ meeting_register_id: meeting?.id }));
  }, []);

  const handleDeleteAttachment = (itemId) => {
    const MySwal = withReactContent(Swal);

    MySwal.fire(warningSwal({ confirmButtonText: 'DELETE' })).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`${meetingAttachmentConstants.API_BASE_PATH}/${itemId}`)
          .then(() => {
            dispatch(
              meetingAttachmentActions.getMeetingAttachments({ meeting_register_id: meeting?.id })
            );
          })
          .catch((error) => {
            dispatch(flashActions.showError(error));
          });
      }
    });
  };

  const handlePreviewAttachment = (item) => {
    dispatch(
      modalActions.showModal('DOCUMENT_PREVIEW', {
        filename: item.title,
        fileExtension: item.file_extension,
        fileSize: item.file_size,
        addedDate: item.added_date,
        fileUrl: item.links?.file_url
      })
    );
  };

  if (listLoading) return <Loading />;

  return (
    <div className='meeting-attachment-section'>
      <div className='meeting-attachments'>
        {list.map((meetingAttachment) => (
          <MeetingAttachmentItem
            item={meetingAttachment}
            handleDeleteAttachment={handleDeleteAttachment}
            handlePreviewAttachment={handlePreviewAttachment}
            currentUser={currentUser}
            key={meetingAttachment.id}
          />
        ))}
      </div>
    </div>
  );
};

export default connect((state) => state.meetingAttachments)(MeetingAttachmentSection);
