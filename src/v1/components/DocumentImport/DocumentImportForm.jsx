import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { axiosInstance } from '../../../utils';
import { flashActions } from '../../../actions';
import { locationConstants } from '../../../constants';
import { documentImportActions } from '../../../actions/documentImport';

import './DocumentImportForm.module.scss';

export const DocumentImportForm = () => {
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState(null);
  const [selected, setSelected] = useState([]);
  const [filterResult, setFilterResult] = useState([]);
  const {
    handleSubmit,
    formState: { isSubmitting }
  } = useForm({});

  useEffect(() => {
    const getBuildings = async () => {
      const params = {
        q: searchInput,
        page: 1,
        per_page: 10
      };

      await axiosInstance
        .get(locationConstants.BASE_PATH, { params })
        .then((res) => {
          setFilterResult(res.data);
        })
        .catch((error) => {
          dispatch(flashActions.showError(error));
          setFilterResult([]);
        });
    };

    getBuildings();
  }, [searchInput]);

  const toggleSelected = (e) => {
    const selectedId = parseInt(e.target.dataset.id, 10);

    if (e.target.checked) {
      setSelected([...selected, filterResult.find((i) => i.id === selectedId)]);
    } else {
      setSelected(selected.filter((i) => i.id !== selectedId));
    }
  };

  const handleRemoveChipClick = (id) => {
    setSelected(selected.filter((i) => i.id !== id));
  };

  const onSubmit = (_data) => {
    // Careful, the BE response ALWAYS responses with 200 doesn't matter what is in the :account_ids
    const account_ids = [...new Set(selected.map((e) => e.account_id))].join(',');
    dispatch(documentImportActions.createImportLogs(account_ids));
  };

  return (
    <section className='no-connection-container'>
      <h3 className='no-connection-title'>SELECT BUILDINGS</h3>
      <fieldset>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='form__group filter__form'>
            <input
              placeholder='Search plan number, location name...'
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          {selected.length !== 0 && (
            <div className='chip-container'>
              {selected.map((i) => (
                <div className='chip' key={i.id}>
                  {i.site_plan_id}
                  <button
                    type='button'
                    className='chip-action'
                    onClick={() => handleRemoveChipClick(i.id)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className='filter__results'>
            <table className='table table--default'>
              <tbody>
                {filterResult.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className='checkboxes-field'>
                        <div className='option'>
                          <input
                            id={`selected-${item.id}`}
                            data-id={item.id}
                            onChange={(e) => toggleSelected(e)}
                            checked={selected.find((i) => i.id === item.id) !== undefined}
                            type='checkbox'
                          />
                          <label htmlFor={`selected-${item.id}`} />
                        </div>
                      </div>
                    </td>
                    <td>
                      {item.site_plan_id} - {item.location_name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='action-buttons'>
            <button
              type='submit'
              className='button button--primary'
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
              disabled={selected.length === 0 || isSubmitting}
            >
              IMPORT
            </button>
          </div>
        </form>
      </fieldset>
    </section>
  );
};
