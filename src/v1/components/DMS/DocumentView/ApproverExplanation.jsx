import { Avatar } from '../../Avatar';

import './ApproverExplanation.module.scss';

function ApproverExplanation() {
  return (
    <div className='approver-explanation-tooltip-content'>
      <div className='row'>
        <Avatar size='xsmall' approved approverClass='approver' />
        <span className='hint'>Has approved the invoice</span>
      </div>
      <div className='row'>
        <Avatar size='xsmall' onHold approverClass='approver' />
        <span className='hint'>Has placed the invoice on hold</span>
      </div>
      <div className='row'>
        <Avatar size='xsmall' currentlyWith approverClass='approver' firstName='A' />
        <span className='hint'>Is assigned the invoice with action required</span>
      </div>
      <div className='row'>
        <Avatar size='xsmall' approverClass='approver' firstName='A' />
        <span className='hint'>Is not assigned</span>
      </div>
      <div className='row'>
        <Avatar size='xsmall' approverClass='approver' firstName='B' />
        <span className='hint'>User is active</span>
      </div>
      <div className='row'>
        <Avatar size='xsmall' firstName='B' state='invited' />
        <span className='hint'>User is not active</span>
      </div>
      <div className='row'>
        <Avatar size='xsmall' firstName='C' approverClass='disabled' />
        <span className='hint'>Approval not required as per Building Rules</span>
      </div>
    </div>
  );
}

export default ApproverExplanation;
