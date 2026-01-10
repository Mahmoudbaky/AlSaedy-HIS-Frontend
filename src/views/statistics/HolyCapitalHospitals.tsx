import React from 'react';
import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Holy Capital Hospital Statistics',
  },
];
const HolyCapitalHospitals = () => {
  return (
    <>
      <BreadcrumbComp title="Holy Capital Hospital Statistics" items={BCrumb} />
    </>
  );
};

export default HolyCapitalHospitals;
