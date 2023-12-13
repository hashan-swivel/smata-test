import { components } from 'react-select';
import { Avatar } from '../Avatar';

export const UserMultiValueLabel = ({ children, ...props }) => {
  const { data } = props;
  const { fullName, full_name } = data;

  return (
    <components.MultiValueLabel {...props}>
      <div className='react-select-user-label'>
        <Avatar {...data} size='tiny' />
        {fullName || full_name}
      </div>
    </components.MultiValueLabel>
  );
};

export const UserOption = ({ data, ...props }) => {
  const {
    fullName,
    firstName,
    lastName,
    role,
    approved,
    inProcess,
    approver_type: approverType
  } = data;

  return (
    <components.Option className={`${inProcess && approved && 'disabled'}`} {...props}>
      <div className='react-select-avatar-name'>
        <Avatar {...data} size='tiny' />
        {fullName || [firstName, lastName].filter((e) => e !== null && e !== '').join(' ')}
      </div>
      {role && <span className='react-select-user-role'>{role.replace(/_/g, ' ')}</span>}
      {approverType && (
        <span className='react-select-user-role'>
          {approverType.charAt(0).toUpperCase() + approverType.slice(1)}
        </span>
      )}
      {approved && <div className={`${approved && 'react-select-approved'}`} />}
    </components.Option>
  );
};
