import { RootState } from 'modules/index';
import { deleteAdmin, getAdmins } from 'modules/Admins';
import { lazy, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import UiButton from 'ui/UiButton';
import UiIcon from 'ui/UiIcon';
import UiTable from 'ui/UiTable';
import { toAnyAction } from 'utils/helpers';
import UserDetails from 'ui/UserDetails';
import SetAdminForm from 'components/admins/SetAdminForm';
import UiConfirmModal from 'ui/UiConfirmModal';

const DashboardTopNav = lazy(() => import('components/layout/DashboardTopNav'));

export default function AdminsPage() {
  const dispatch = useDispatch();
  const [isSetAdminVisible, setIsSetAdminVisible] = useState(false);
  const [isDeleteAdminVisible, setIsDeleteAdminVisible] = useState(false);
  const [activeAdminId, setActiveAdminId] = useState('');
  const [loading, setLoading] = useState(false);

  const admins = useSelector((state: RootState) => state.admins.admins);

  const tableOptions = [
    {
      label: 'Remove Admin',
      func: openDeleteAdminModal,
    },
  ];

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

  const activeAdmin = useMemo(() => {
    if (!activeAdminId) return null;
    return admins.find(({ _id }) => _id === activeAdminId);
  }, [activeAdminId]);

  const activeAdminName = useMemo(() => {
    if (activeAdmin) return activeAdmin.firstName + ' ' + activeAdmin.lastName;
  }, [activeAdmin, activeAdminId]);

  function openDeleteAdminModal(adminId: string) {
    setActiveAdminId(adminId);
    setIsDeleteAdminVisible(true);
  }

  function closeDeleteAdminModal() {
    setIsDeleteAdminVisible(false);
  }

  function deleteSelectedAdmin() {
    setLoading(true);
    dispatch(toAnyAction(deleteAdmin(activeAdminId)))
      .then(closeDeleteAdminModal)
      .finally(() => setLoading(false));
  }

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
        <UiTable data={tableData} headers={headers} options={tableOptions} />
      </AdminsPageStyling>
      <SetAdminForm
        isVisible={isSetAdminVisible}
        onClose={() => setIsSetAdminVisible(false)}
      />
      <UiConfirmModal
        isVisible={isDeleteAdminVisible}
        loading={loading}
        onClose={closeDeleteAdminModal}
        onProceed={deleteSelectedAdmin}
        title="Delete Admin"
        children={`Are you sure you want to delete ${activeAdminName}? This action is irrvocable.`}
        variant="danger"
      />
    </div>
  );
}

const AdminsPageStyling = styled.div`
  padding: ${pxToRem(24)};
`;
