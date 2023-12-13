import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from '../../Link';
import { setToggleActions } from '../../../../actions/dms';
import { Tooltip } from 'react-tippy';
import './Action.module.scss';

export const Action = ({ actions, closeAlert }) => {
  const dispatch = useDispatch();
  const toggleActionsDMS = () => {
    dispatch(
      setToggleActions({
        favorite: false,
        all: false,
        task: true,
        priority_invoice: false
      })
    );
  };

  return (
    <div className='building-alert-active'>
      <Link
        classNameProp='building-alert-message icon icon-info-white'
        href='/v1/documents'
        onClick={toggleActionsDMS}
      >
        <Tooltip
          arrow
          title='These are the invoices that require your action'
          animation='fade'
          theme='light'
          duration='200'
          position='bottom-start'
          className='alert-text'
        >
          {actions >= 1
            ? `You have ${actions} actions`
            : 'Nothing to action right now, come back later'}
        </Tooltip>
      </Link>
      <div
        role='presentation'
        className='building-alert-close icon icon-cross-with-border-white'
        onClick={() => closeAlert()}
      />
    </div>
  );
};
