import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../../../utils';
import { NotFound } from '../index';
import { Loading } from '../../Loading.jsx';
import ReportItem from './ReportItem';
import { Form } from 'redux-form';

const ReportListTabPanelContent = (props) => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    fetchCrystalReports();
  }, []);

  const fetchCrystalReports = async () => {
    setLoading(true);
    await axiosInstance
      .get('/v1/crystal_report_request_items')
      .then((res) => {
        setReportData(res.data.crystal_report_request_items);
        setLoading(false);
      })
      .catch(() => {
        setReportData([]);
        setLoading(false);
      });
  };

  if (loading) {
    return <Loading />;
  }
  if (reportData.length === 0) {
    return <NotFound text='No Reports Found' />;
  }
  return (
    <>
      <div className='alert alert--info'>There are the reports that you have generated.</div>
      {reportData.map((item) => (
        <ReportItem crystalReport={item} key={item.id} />
      ))}
    </>
  );
};

export default ReportListTabPanelContent;
