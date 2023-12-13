import { useEffect, useState } from 'react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFieldArray, useForm } from 'react-hook-form';
import { faFlag, faPaperPlane, faTimes, faVoteYea } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { flashActions, meetingAgendaActions } from '../../../actions';
import { Loading } from '../Loading';
import { axiosInstance } from '../../../utils';
import { meetingRecordConstants } from '../../../constants';

import '../Shared/Accordion.module.scss';
import './MeetingAgendaSection.module.scss';

const voteTranslation = {
  A: (
    <span data-vote='A'>
      <FontAwesomeIcon icon={faFlag} />
      &nbsp;ABSTAIN
    </span>
  ),
  Y: (
    <span data-vote='Y'>
      <FontAwesomeIcon icon={faVoteYea} />
      &nbsp;IN FAVOUR
    </span>
  ),
  N: (
    <span data-vote='N'>
      <FontAwesomeIcon icon={faTimes} />
      &nbsp;AGAINST
    </span>
  )
};

const AgendaItem = ({ item, index, canVote, register, errors, isSubmitted }) => {
  const [collapse, setCollapse] = useState(true);
  const firstMeetingRecord = item?.meeting_records?.[0];

  useEffect(() => {
    if (!isSubmitted) {
      const hasError =
        errors.agendas?.[index]?.vote !== undefined ||
        errors.agendas?.[index]?.server !== undefined;
      setCollapse(!hasError);
    }
  }, [errors, isSubmitted]);

  const AccordionTitle = () => {
    let content;

    if (collapse) {
      content = (
        <div>
          <span>{`${item.agenda_number} - ${item.description}`}</span>
          <br />
          <div className='last-vote'>
            <strong>Last Vote:</strong>
            &nbsp;
            {voteTranslation[firstMeetingRecord?.vote] || 'N/A'}
            &nbsp;&nbsp;-&nbsp;&nbsp;
            <strong>Last Proxy Used:</strong>
            &nbsp;
            {firstMeetingRecord?.proxy_used || 'N/A'}
          </div>
        </div>
      );
    } else {
      content = `${item.agenda_number} - ${item.description}`;
    }

    return (
      <button
        className={`accordion__button ${collapse ? 'collapsed' : ''}`}
        type='button'
        aria-expanded='true'
        onClick={() => setCollapse(!collapse)}
      >
        {content}
        <h3 style={{ fontWeight: 'normal' }}>&#8964;</h3>
      </button>
    );
  };

  return (
    <div className='accordion'>
      <h2 className='accordion__header'>{AccordionTitle()}</h2>
      <div className={`accordion__collapse ${collapse ? '' : 'show'}`}>
        <div className='accordion__body'>
          <div dangerouslySetInnerHTML={{ __html: item.formatted_text }} />
          {canVote && (
            <>
              <input
                {...register(`agendas.${index}.index`)}
                type='hidden'
                value={index}
                id={`agendas.${index}.index`}
              />
              <div className='vote-options'>
                <input
                  {...register(`agendas.${index}.vote`)}
                  type='radio'
                  value='Y'
                  id={`agendas.${index}.vote_in_favour`}
                />
                <label htmlFor={`agendas.${index}.vote_in_favour`}>
                  <FontAwesomeIcon icon={faVoteYea} />
                  &nbsp;In Favour
                </label>

                <input
                  {...register(`agendas.${index}.vote`)}
                  type='radio'
                  value='N'
                  id={`agendas.${index}.vote_against`}
                />
                <label htmlFor={`agendas.${index}.vote_against`}>
                  <FontAwesomeIcon icon={faTimes} />
                  &nbsp;Against
                </label>

                <input
                  {...register(`agendas.${index}.vote`)}
                  type='radio'
                  value='A'
                  id={`agendas.${index}.vote_abstain`}
                />
                <label htmlFor={`agendas.${index}.vote_abstain`}>
                  <FontAwesomeIcon icon={faFlag} />
                  &nbsp;Abstain
                </label>
              </div>
            </>
          )}
          {firstMeetingRecord && (
            <div className='last-vote'>
              <strong>Last Vote:</strong>
              &nbsp;
              {voteTranslation[firstMeetingRecord?.vote]}
              &nbsp;&nbsp;-&nbsp;&nbsp;
              <strong>Last Proxy Used:</strong>
              &nbsp;
              {firstMeetingRecord?.proxy_used || 'N/A'}
            </div>
          )}

          {errors.agendas?.[index]?.server && (
            <div className='alert alert--danger' style={{ marginTop: '.5rem', marginBottom: 0 }}>
              {errors.agendas?.[index]?.server.message}
            </div>
          )}

          {errors.agendas?.[index]?.vote && (
            <div className='alert alert--danger' style={{ marginTop: '.5rem', marginBottom: 0 }}>
              {errors.agendas?.[index]?.vote?.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MeetingAgendaSection = ({ meeting, list, listLoading, dispatch }) => {
  const {
    register,
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { isSubmitting, errors, isSubmitted }
  } = useForm({
    defaultValues: { agendas: [] }
  });

  const { fields, replace } = useFieldArray({
    name: 'agendas',
    keyName: 'field_id',
    control
  });

  useEffect(() => {
    dispatch(meetingAgendaActions.getMeetingAgendas(meeting?.id));
  }, []);

  useEffect(() => {
    replace(list);
  }, [list]);

  async function onSubmit(data) {
    clearErrors();
    let anyError = false;

    let meetingRecordData = [];

    data.agendas.forEach((meetingAgenda) => {
      let params = {
        meeting_agenda_id: meetingAgenda.id,
        vote: meetingAgenda.vote,
        proxy_used: data.proxy_used,
        meeting_agenda_index: meetingAgenda.index
      };

      meeting.lot_numbers.forEach((lotNumber) => {
        const lotNumberId = lotNumber.id;
        const meetingRecordId = meetingAgenda.meeting_records.find(
          (meetingRecord) => parseInt(meetingRecord.lot_number_id, 0) === parseInt(lotNumberId, 0)
        )?.id;
        params = { ...params, id: meetingRecordId, lot_number_id: lotNumberId };

        if (
          (params.id === null || params.id === undefined) &&
          (params.vote === null || params.vote === undefined)
        ) {
          anyError = true;
          setError(`agendas.${meetingAgenda.index}.vote`, {
            type: 'required',
            message: 'Vote must be present'
          });
        } else {
          if (params.vote !== null && params.vote !== undefined)
            meetingRecordData = [...meetingRecordData, params];
        }
      });
    });

    if (anyError) return;

    if (meetingRecordData.length === 0) {
      // Change to use SweetAlert
      dispatch(flashActions.showError('Vote not found.'));
      return;
    }

    const submitVote = async (v) => {
      const { id, meeting_agenda_index, ...voteParams } = v;

      if (id) {
        await axiosInstance
          .put(`${meetingRecordConstants.API_BASE_PATH}/${v.id}`, voteParams)
          .then(() => {})
          .catch((err) => {
            anyError = true;
            setError(`agendas.${meeting_agenda_index}.server`, {
              type: 'custom',
              message: flashActions.errorMessage(err)
            });
          });
      } else {
        await axiosInstance
          .post(meetingRecordConstants.API_BASE_PATH, voteParams)
          .then(() => {})
          .catch((err) => {
            anyError = true;
            setError(`agendas.${meeting_agenda_index}.server`, {
              type: 'custom',
              message: flashActions.errorMessage(err)
            });
          });
      }
    };

    const MySwal = withReactContent(Swal);

    MySwal.fire({
      title: 'Submitting...',
      didOpen() {
        MySwal.showLoading();
      },
      allowEscapeKey: false,
      allowOutsideClick: false
    });

    Promise.all(meetingRecordData.map((voteRecord) => submitVote(voteRecord))).then(() => {
      if (anyError) {
        MySwal.fire({
          title: 'Error!',
          html: 'Some of the votes failed to record. Please review them individually.',
          type: 'error',
          showConfirmButton: false,
          timer: 1000
        });
      } else {
        MySwal.fire({
          title: 'Done!',
          html: 'Your vote(s) are recorded successfully..',
          type: 'success',
          showConfirmButton: false,
          timer: 1000
        });

        dispatch(meetingAgendaActions.getMeetingAgendas(meeting?.id));
      }
    });
  }

  if (listLoading) return <Loading />;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset disabled={isSubmitting}>
        {meeting?.can_vote && (
          <section style={{ marginBottom: '1.5rem' }}>
            <div className='form__group'>
              <div className='form__control text--danger'>
                <label htmlFor='proxy_holder_name'>
                  Proxy Holder: If you are voting on behalf of this Lot as a Proxy for the Owner
                  please confirm the name of the Proxy Holder.
                </label>
              </div>
              <input className='form__control' type='text' {...register('proxy_used')} />
            </div>
          </section>
        )}

        <section>
          <h5 style={{ paddingBottom: '.5rem' }}>Meeting Agendas</h5>
          {fields.map((field, index) => (
            <div className='accordions' key={field.field_id} style={{ marginBottom: '1.5rem' }}>
              <AgendaItem
                item={field}
                index={index}
                canVote={meeting?.can_vote}
                register={register}
                errors={errors}
                isSubmitted={isSubmitted}
              />
            </div>
          ))}
        </section>

        {meeting?.can_vote && (
          <div className='action-buttons' style={{ marginBottom: '1rem' }}>
            <button
              type='submit'
              className='button button--primary'
              style={{ width: '100%' }}
              disabled={isSubmitting}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
              &nbsp;Submit
            </button>
          </div>
        )}
      </fieldset>
    </form>
  );
};

export default connect((state) => state.meetingAgendas)(MeetingAgendaSection);
