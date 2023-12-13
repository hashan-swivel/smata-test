import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { getOrganisations, getAvailableResources } from '@/actions/strataMasterDataLogs';
import { Layout, Loading } from '@v1/components';
import { ResourceDataLogs } from '@v1/components/StrataMasterDataLogs';

import './strata-master-data-logs.module.scss';

const StrataMasterDataLogs = ({ dms, query }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const [organisationId, setOrganisationId] = useState();
  const organisations = useSelector((state) => state.strataMasterDataLogs?.organisations);
  const organisationOptions = organisations.map((o) => ({
    value: o.id,
    label: o.name
  }));

  const availableResources = useSelector((state) => state.strataMasterDataLogs?.availableResources);
  const [resourceName, setResourceName] = useState();
  const availableResourcesOptions = availableResources.map((o) => ({
    value: o.name,
    label: o.pretty_name
  }));
  const selectedResource = availableResources.find((r) => r.name === resourceName);

  const handleSelectOrganisation = (selectedOption) => {
    if (organisationId) {
      setReload(true);
    }
    setOrganisationId(selectedOption.value);
  };

  const handleSelectResourceName = (selectedOption) => {
    if (resourceName) {
      setReload(true);
    }
    setResourceName(selectedOption.value);
  };

  useEffect(() => {
    dispatch(getOrganisations());
    dispatch(getAvailableResources());
  }, []);

  return (
    <Layout
      seo={{ title: 'Strata Master Data Logs Details' }}
      bodyClassName='strata-data-logs-list-body'
      headerClassName='mw-100'
    >
      <h2 className='heading-title'>Strata Master Data Logs Synchronization</h2>
      <div className='wrapper strata-data-logs-list-wrapper'>
        <div className='strata-data-logs-select-orgs'>
          <Select
            defaultValue={{ value: '', label: 'Select organisation' }}
            options={organisationOptions}
            onChange={handleSelectOrganisation}
            className='select-org-input'
          />
          <Select
            defaultValue={{ value: '', label: 'Select resource name' }}
            options={availableResourcesOptions}
            onChange={handleSelectResourceName}
            className='select-org-input'
          />
          {loading && <Loading componentLoad />}
        </div>
        <ResourceDataLogs
          organisationId={organisationId}
          setLoading={setLoading}
          reload={reload}
          resource={selectedResource}
        />
      </div>
    </Layout>
  );
};

export default StrataMasterDataLogs;
