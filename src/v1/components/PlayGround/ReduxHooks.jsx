import React from 'react';

export const ReduxHooks = (props) => {
  const { updateCount, undoCount, counter } = props;

  return (
    <>
      <button onClick={updateCount} type='button' className='button primary'>
        I have been clicked {counter.value} times
      </button>
      <div>
        {counter.value > 0 && (
          <button onClick={undoCount} type='button' className='button secondary'>
            Undo click
          </button>
        )}
      </div>
    </>
  );
};
