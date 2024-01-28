import { RootState } from 'modules/index';
import { getAdmins } from 'modules/Admins';
import { lazy, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import UiButton from 'ui/UiButton';
import UiIcon from 'ui/UiIcon';
import UiTable from 'ui/UiTable';
import { toAnyAction } from 'utils/helpers';
import UserDetails from 'ui/UserDetails';
import SetAdminForm from 'components/admins/SetAdminForm';

const DashboardTopNav = lazy(() => import('components/layout/DashboardTopNav'));

export default function AdminsPage() {
  const dispatch = useDispatch();
  const [isSetAdminVisible, setIsSetAdminVisible] = useState(false);

  const admins = useSelector((state: RootState) => state.admins.admins);

  const tableOptions = [];

  const headers = [
    {
      title: 'Admin',
      query: 'admin',
    },
    {
      title: 'Email',
      query: 'email',
    },
    {
      title: 'Role',
      query: 'role',
    },
    {
      title: 'Date Joined',
      query: 'createdAt',
    },
  ];

  const tableData = useMemo(() => {
    return admins.map((admin) => ({
      ...admin,
      admin: <UserDetails userName={`${admin.firstName} ${admin.lastName}`} />,
    }));
  }, [admins]);

  useEffect(() => {
    dispatch(toAnyAction(getAdmins()));
  }, []);

  return (
    <div>
      <DashboardTopNav
        routeName="Admins"
        edgeNode={
          <UiButton size="md" onClick={() => setIsSetAdminVisible(true)}>
            <UiIcon icon="UserCircleAdd" /> <span>Add new Admin</span>
          </UiButton>
        }
      />
      <AdminsPageStyling>
        <UiTable data={tableData} headers={headers} options={[]} />
      </AdminsPageStyling>
      <SetAdminForm
        isVisible={isSetAdminVisible}
        onClose={() => setIsSetAdminVisible(false)}
      />
    </div>
  );
}

const AdminsPageStyling = styled.div`
  padding: ${pxToRem(24)};
`;
