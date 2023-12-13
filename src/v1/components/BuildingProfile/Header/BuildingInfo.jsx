import React from 'react';
import './BuildingInfo.module.scss';

export const BuildingInfo = ({ building }) => (
  <>
    <span className='building-info-point'>Leased until {building.leaseEnd}</span>
    <span className='building-info-point'>Tenant: {building.tenant}</span>
    <span className='building-info-point'>Estate Agent: {building.estateAgent}</span>
    <span className='building-info-point'>Lots: {building.totalLots}</span>
    <span className='building-info-point'>Built: {building.built}</span>
    <span className='building-info-point'>Council: {building.council}</span>
    <span className='building-info-point'>Plan ID: {building.plan}</span>
  </>
);
