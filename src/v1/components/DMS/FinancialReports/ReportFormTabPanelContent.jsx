import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import * as moment from 'moment';
import Flatpickr from 'react-flatpickr';
import { crystalReportActions, lotNumberActions, strataPlanActions } from '../../../../actions';
import { datetimeConstants, lotNumberConstants } from '../../../../constants';
import { axiosInstance } from '../../../../utils';

import '../../Form/Fields/ReactSelect.module.scss';
import './ReportFormTabPanelContent.module.scss';

const ReportFormTabPanelContent = ({ setActiveTabIndex, buildingId }) => {
  const dispatch = useDispatch();

  const [associationFilter, setAssociationFilter] = useState(false);
  const [filteredStrataPlans, setFilteredStrataPlans] = useState([]);
  const [financialYearPeriod, setFinancialYearPeriod] = useState(null);
  const [currentStep, setCurrentStep] = useState('not_triggered');
  const [reportID, setReportID] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('#');
  const refreshStatusInterval = useRef(null);
  const [showCurrentOwnerAccountWarning, setShowCurrentOwnerAccountWarning] = useState(false);
  const [showStrataRollWarning, setShowStrataRollWarning] = useState(false);

  const currentUser = useSelector((state) => state.auth.currentUser);
  const strataPlans = useSelector((state) => state.strataPlans);
  const crystalReports = useSelector((state) => state.crystalReports);
  const lotNumbers = useSelector((state) => state.lotNumbers);
  const annualGeneralMeetingCrystalReports = crystalReports?.list?.filter((r) =>
    r.categories.includes('annual_general_meeting')
  );

  const {
    control,
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors }
  } = useForm({
    defaultValues: {
      annual_general_meeting: false,
      accounts: [],
      account: null,
      crystal_reports: [],
      lot_number_ids: null,
      datetime: moment().format(datetimeConstants.FORMAT.DEFAULT),
      financial_year_period: null
    }
  });

  const watchedAccount = watch('account');
  const watchedAccounts = watch('accounts');
  const watchedFinancialYearPeriod = watch('financial_year_period');
  const watchedAnnualGeneralMeeting = watch('annual_general_meeting');
  const selectedReports = watch('crystal_reports');

  useEffect(() => {
    if (strataPlans?.list?.length < 1) {
      dispatch(strataPlanActions.getStrataPlans());
    }
    if (currentUser && !currentUser.isStrataMember && crystalReports?.list?.length < 1) {
      dispatch(crystalReportActions.getCrystalReports());
    }
  }, []);

  useEffect(() => {
    if (associationFilter) {
      setFilteredStrataPlans(
        strataPlans?.list.filter((sp) => sp.association_type_name === 'Home Unit Company')
      );
      setValue(
        'accounts',
        watchedAccounts.filter((sp) => sp.association_type_name === 'Home Unit Company')
      );
      if (watchedAccount && watchedAccount.association_type_name !== 'Home Unit Company') {
        setValue('account', null);
      }
    } else {
      setFilteredStrataPlans(strataPlans?.list);
    }
  }, [strataPlans?.list, associationFilter]);

  useEffect(() => {
    if (watchedFinancialYearPeriod) {
      setValue('datetime', watchedFinancialYearPeriod);
    }
  }, [watchedFinancialYearPeriod]);

  const handleAnnualGeneralMeetingChanged = (e) => {
    let result = selectedReports || [];

    if (e.currentTarget.checked) {
      result = [...new Set(result.concat(annualGeneralMeetingCrystalReports))];

      if (watchedAccount?.id && watchedAccount?.financial_year_end) {
        setFinancialYearPeriod(watchedAccount?.financial_year_end);
        setValue(
          'financial_year_period',
          moment.unix(watchedAccount?.financial_year_end).format(datetimeConstants.FORMAT.DEFAULT)
        );
      } else {
        setFinancialYearPeriod(null);
        setValue('financial_year_period', null);
      }
    } else {
      result = result.filter((r) => !annualGeneralMeetingCrystalReports.includes(r));
    }

    setValue('crystal_reports', result);
  };

  const handleAccountChanged = (selectedAccount) => {
    setValue('crystal_reports', []);
    setValue('annual_general_meeting', false);

    if (selectedAccount?.id) {
      dispatch(crystalReportActions.getCrystalReports(selectedAccount?.id));
    }

    if (selectedAccount?.id && selectedAccount?.lotable) {
      dispatch(lotNumberActions.getLotNumbers({ spNumber: selectedAccount?.name }));
    } else {
      dispatch({ type: lotNumberConstants.GET_LOT_NUMBERS, payload: [] });
    }
    setValue('lot_number_ids', null);

    setFinancialYearPeriod(null);
    setValue('financial_year_period', null);
  };

  const handleReportTypesChanged = (selectedReportTypes) => {
    if (
      watchedAccount?.id &&
      selectedReportTypes?.length === 1 &&
      selectedReportTypes[0]?.lotable
    ) {
      dispatch(lotNumberActions.getLotNumbers({ spNumber: watchedAccount?.name }));
    } else {
      dispatch({ type: lotNumberConstants.GET_LOT_NUMBERS, payload: [] });
    }

    setValue('lot_number_ids', null);

    if (
      selectedReportTypes &&
      selectedReportTypes.find((type) => type.key === 'Current Owner Account')
    ) {
      setShowCurrentOwnerAccountWarning(true);
      setShowStrataRollWarning(false);
      setAssociationFilter(false);
      // clear out other report types as CurrentOwnerAccount reports cannot be combined with others
      setValue(
        'crystal_reports',
        selectedReportTypes.filter((type) => type.key === 'Current Owner Account')
      );
      return;
    }

    if (
      selectedReportTypes &&
      selectedReportTypes.find(
        (type) => type.key === 'Strata Roll' || type.key === 'StrataRollSelectedLots'
      )
    ) {
      setShowStrataRollWarning(true);
      setAssociationFilter(false);
      setShowCurrentOwnerAccountWarning(false);
      // clear out other report types as StrataRoll & StrataRollSelectedLots reports cannot be combined with others
      setValue('crystal_reports', [
        selectedReportTypes.find(
          (type) => type.key === 'Strata Roll' || type.key === 'StrataRollSelectedLots'
        )
      ]);
      return;
    }

    setShowStrataRollWarning(false);
    setShowCurrentOwnerAccountWarning(false);
    setAssociationFilter(
      selectedReportTypes && selectedReportTypes.some((e) => e.trigger_association_filter)
    );
  };

  useEffect(() => {
    if (currentStep === 'triggered' || currentStep === 'processing') getReportStatus();
  }, [currentStep]);

  const getReportStatus = async () => {
    await axiosInstance.get(`/v1/crystal_report_request_items/${reportID}`).then((response) => {
      const reportStatus = response.data.status;
      if (
        reportStatus === 'initiated' ||
        reportStatus === 'scheduled' ||
        reportStatus === 'in-progress'
      ) {
        refreshStatusInterval.current = setTimeout(getReportStatus, 3000); // call again in 2 seconds
        return;
      }
      if (reportStatus === 'error') {
        clearTimeout(refreshStatusInterval.current);
        setCurrentStep('error');
        return;
      }
      if (reportStatus === 'completed') {
        clearTimeout(refreshStatusInterval.current);
        setDownloadUrl(response.data.file_url);
        setCurrentStep('completed');
      }
    });
  };

  const onSubmit = async (data) => {
    const datetime = data.datetime.constructor === Array ? data.datetime[0] : data.datetime;
    const params = {
      crystal_report_ids:
        data.crystal_reports.constructor === Array ? data.crystal_reports.map((i) => i.id) : [],
      request_period: datetime
        ? moment(datetime, datetimeConstants.FORMAT.DEFAULT).format(
            datetimeConstants.FORMAT.BACK_END_DEFAULT
          )
        : moment().format(datetimeConstants.FORMAT.BACK_END_DEFAULT),
      organisation_id: currentUser?.organisation_id,
      lot_number_ids: data.lot_number_ids?.id
    };

    if (data.account) {
      params.account_ids = data.account.id;
    }

    if (data.accounts && data.accounts.length > 0) {
      params.account_ids = [...new Set(data.accounts.map((i) => i.id))];
    }

    await axiosInstance
      .post('/v1/crystal_report_request_items', params)
      .then((res) => {
        const { id } = res.data;
        setReportID(id);
        setCurrentStep('triggered');
      })
      .catch(() => {
        setCurrentStep('error');
      });
  };

  const actionButtons = () => {
    if (currentStep === 'not_triggered') {
      return (
        <button type='submit' className='button primary'>
          Generate Report
        </button>
      );
    }
    if (currentStep === 'triggered' || currentStep === 'processing') {
      return (
        <button type='button' className='button primary'>
          Processing...
        </button>
      );
    }
    if (currentStep === 'completed') {
      return (
        <a
          className='button download-btn'
          href={downloadUrl}
          target='_blank'
          rel='noopener noreferrer'
          onClick={() => setActiveTabIndex()}
        >
          Open
        </a>
      );
    }
    if (currentStep === 'error') {
      return (
        <span className='text--danger'>Oops, something went wrong! Please try again later.</span>
      );
    }
  };

  const warnings = () => {
    const list = [];

    if (associationFilter) {
      list.push('Selected report type(s) is only available for specific Strata Plans.');
    }

    if (watchedAnnualGeneralMeeting) {
      list.push('Annual General Meeting Reports are restricted to 1 per Plan Number.');
    }

    if (showCurrentOwnerAccountWarning) {
      list.push('Current Owner Account reports cannot be combined with other report types.');
    }

    if (showStrataRollWarning) {
      list.push('Strata Role reports cannot be combined with other report types.');
    }

    if (list.length > 0) {
      return (
        <ul className='alert alert--warning'>
          {list.map((i) => (
            <li style={{ listStyle: 'inside' }} key={i}>
              {i}
            </li>
          ))}
        </ul>
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='alert alert--info'>
        Financial reports are generated in real time and can take some time to run.
      </div>
      {warnings()}
      <fieldset disabled={isSubmitting} className='fieldset'>
        {currentUser ? (
          <div className='form__group'>
            <div className='form__control'>
              <label htmlFor='account'>Plan Number</label>
            </div>
            <div className='form__control'>
              <Controller
                name='account'
                control={control}
                rules={{ required: 'Can not be blank' }}
                render={({ field: { onChange, value, ref, ..._rest } }) => (
                  <Select
                    inputRef={ref}
                    options={filteredStrataPlans}
                    isLoading={strataPlans?.listLoading}
                    classNamePrefix='react-select'
                    styles={{ menuPortal: (base) => ({ ...base }) }}
                    placeholder='Select...'
                    value={value}
                    onChange={(v) => {
                      onChange(v);
                      handleAccountChanged(v);
                    }}
                    blurInputOnSelect
                    isMulti={false}
                    menuPortalTarget={document.body}
                  />
                )}
              />
            </div>
            {errors.account && <div className='invalid-feedback'>{errors.account.message}</div>}
          </div>
        ) : (
          <div className='form__group'>
            <div className='form__control'>
              <label htmlFor='accounts'>Plan Number</label>
            </div>
            <div className='form__control'>
              <Controller
                name='accounts'
                control={control}
                rules={{ required: 'Can not be blank' }}
                render={({ field: { onChange, value, ref, ..._rest } }) => (
                  <Select
                    inputRef={ref}
                    options={strataPlans?.list}
                    isLoading={strataPlans?.listLoading}
                    classNamePrefix='react-select'
                    styles={{ menuPortal: (base) => ({ ...base }) }}
                    placeholder='Select...'
                    value={value}
                    onChange={(v) => onChange(v)}
                    blurInputOnSelect
                    isMulti
                    menuPortalTarget={document.body}
                  />
                )}
              />
            </div>
            {errors.accounts && <div className='invalid-feedback'>{errors.accounts.message}</div>}
          </div>
        )}
        <div className='form__group'>
          <div className='form__control'>
            <label htmlFor='crystal_reports'>Report Type</label>
          </div>
          <div className='form__control'>
            <Controller
              name='crystal_reports'
              control={control}
              rules={{ required: 'Can not be blank' }}
              render={({ field: { onChange, value, ref, ..._rest } }) => (
                <Select
                  inputRef={ref}
                  options={crystalReports?.list}
                  isLoading={crystalReports?.listLoading}
                  classNamePrefix='react-select'
                  styles={{ menuPortal: (base) => ({ ...base }) }}
                  placeholder='Select...'
                  value={value}
                  onChange={(v) => {
                    onChange(v);
                    handleReportTypesChanged(v);
                  }}
                  blurInputOnSelect
                  isMulti
                  menuPortalTarget={document.body}
                />
              )}
            />
          </div>
          {errors.crystal_reports && (
            <div className='invalid-feedback'>{errors.crystal_reports.message}</div>
          )}
        </div>

        <div className='form__group'>
          <div className='form__control'>
            <label className='checkbox-container' htmlFor='annual_general_meeting'>
              Annual General Meeting Reports
              <Controller
                name='annual_general_meeting'
                control={control}
                render={({ field: { onChange, value, ref, ..._rest } }) => (
                  <input
                    ref={ref}
                    type='checkbox'
                    id='annual_general_meeting'
                    value={value}
                    checked={value}
                    onChange={(e) => {
                      onChange(e);
                      handleAnnualGeneralMeetingChanged(e);
                    }}
                  />
                )}
              />
              <span className='checkmark' />
            </label>
          </div>
        </div>

        <div className={`form__group ${lotNumbers?.list?.length > 0 ? '' : 'hidden'}`}>
          <div className='form__control'>
            <label htmlFor='lot_number_ids'>Lot Number</label>
          </div>
          <div className='form__control'>
            <Controller
              name='lot_number_ids'
              control={control}
              render={({ field: { onChange, value, ref, ..._rest } }) => (
                <Select
                  inputRef={ref}
                  options={lotNumbers?.list}
                  isLoading={lotNumbers?.listLoading}
                  classNamePrefix='react-select'
                  styles={{ menuPortal: (base) => ({ ...base }) }}
                  placeholder='Select...'
                  value={value}
                  onChange={(v) => onChange(v)}
                  blurInputOnSelect
                  menuPortalTarget={document.body}
                />
              )}
            />
          </div>
        </div>

        {watchedFinancialYearPeriod && watchedAnnualGeneralMeeting && (
          <div className='form__group'>
            <div className='form__control'>
              <label htmlFor='financialYearPeriod'>
                Financial year end date:{' '}
                {
                  <span className='color-blue'>
                    {moment.unix(financialYearPeriod).format('DD.MM')}
                  </span>
                }
              </label>
            </div>

            <div className='form__control'>
              <label className='checkbox-container' htmlFor='this_year_financial_period'>
                {moment.unix(financialYearPeriod).format(datetimeConstants.FORMAT.DEFAULT)}
                <input
                  {...register('financial_year_period')}
                  type='radio'
                  value={moment.unix(financialYearPeriod).format(datetimeConstants.FORMAT.DEFAULT)}
                  id='this_year_financial_period'
                />
                <span className='checkmark' />
              </label>
            </div>
            <div className='form__control'>
              <label className='checkbox-container' htmlFor='last_year_financial_period'>
                {moment
                  .unix(financialYearPeriod)
                  .subtract(1, 'Y')
                  .format(datetimeConstants.FORMAT.DEFAULT)}
                <input
                  {...register('financial_year_period')}
                  type='radio'
                  value={moment
                    .unix(financialYearPeriod)
                    .subtract(1, 'Y')
                    .format(datetimeConstants.FORMAT.DEFAULT)}
                  id='last_year_financial_period'
                />
                <span className='checkmark' />
              </label>
            </div>
          </div>
        )}
        <div className='form__group'>
          <div className='form__control'>
            <label htmlFor='datetime'>At this date</label>
          </div>
          <Controller
            control={control}
            name='datetime'
            rules={{ required: 'Can not be blank' }}
            render={({ field: { onChange, value } }) => (
              <Flatpickr
                options={{ dateFormat: 'd/m/Y', mode: 'single', allowInput: false }}
                value={value}
                className='input'
                onChange={(selectedDates, _dateStr, _instance) => {
                  onChange(selectedDates);
                }}
              />
            )}
          />
          {errors.datetime && <div className='invalid-feedback'>{errors.datetime.message}</div>}
        </div>

        <div className='form__group' style={{ marginBottom: 0 }}>
          <div className='form__control' style={{ display: 'flex', justifyContent: 'center' }}>
            {actionButtons()}
          </div>
        </div>
      </fieldset>
    </form>
  );
};

export default ReportFormTabPanelContent;
