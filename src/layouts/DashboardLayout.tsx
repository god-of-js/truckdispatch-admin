import React, { lazy, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import { toAnyAction } from 'utils/helpers';
import sizes from '../utils/sizes';

import { getDashboardUser } from 'modules/Account';

import { Toast } from 'utils/toast';

const DashboardSidebar = lazy(
  () => import('components/layout/DashboardSidebar'),
);
const Loader = lazy(() => import('components/layout/Loader'));

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  function loadDashboardData() {
    dispatch(toAnyAction(getDashboardUser()))
      .catch((err: Error) => {
        Toast.error({ msg: err.message });
      })
      .then(() => setLoading(false));
  }

  useEffect(() => {
    loadDashboardData();
  }, [loading]);

  return (
    <Layout>
      <DashboardSidebar />
      <Body>{loading ? <Loader isPage /> : <Outlet />}</Body>
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: var(--color-gray-20);
  overflow: hidden;
`;

const Body = styled.div`
  position: relative;
  overflow-x: auto;
  width: 100%;
  padding-bottom: 100px;

  .alert-container {
    .ui-alert {
      margin: 16px 16px 0 16px;
    }

    .text {
      font-size: 14px;
      font-weight: 600;
      line-height: 140%;
      letter-spacing: -0.4px;
    }

    .alert-body {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
    .no-text-decoration {
      text-decoration: none;
    }
  }
  @media only screen and (min-width: ${sizes.tabletSmallWidth}) {
    width: 97%;
    border-top: none;
    position: static;
    border-right: 1px solid var(--color-gray-200);
    padding-bottom: 0;
  }

  @media only screen and (min-width: ${sizes.laptopSmallWidth}) {
    width: 95%;
  }
`;
