import { createAdmin } from 'modules/Admins';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Admin from 'types/Admin';
import UiButton from 'ui/UiButton';
import UiForm from 'ui/UiForm';
import UiInput, { OnChangeParams } from 'ui/UiInput';
import UiModal from 'ui/UiModal';
import UiSelect from 'ui/UiSelect';
import { toAnyAction } from 'utils/helpers';

interface Props {
  isVisible: boolean;
  onClose: () => void;
}
export default function AdminForm({ isVisible, onClose }: Props) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '' as Admin['role'],
  });
  const [loading, setLoading] = useState(false);
  const roles = [
    {
      value: 'super-admin',
      label: 'Super Admin',
    },
    {
      value: 'support',
      label: 'Support',
    },
    {
      value: 'marketer',
      label: 'Marketer',
    },
  ];
  function handleChange({ name, value }: OnChangeParams) {
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  }

  function addAdmin() {
    setLoading(true);
    dispatch(toAnyAction(createAdmin(formData)))
      .then(() => {
        onClose();
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <UiModal
      title="Add Admin"
      isVisible={isVisible}
      size="sm"
      onClose={onClose}
    >
      <UiForm formData={formData} onSubmit={addAdmin}>
        {() => (
          <AdminFormStyling>
            <UiInput
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            <UiInput
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            <UiInput
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <UiSelect
              label="Role"
              options={roles}
              name="role"
              value={formData.role}
              onChange={handleChange}
            />
            <UiButton isFullWidth loading={loading}>
              Create Admin
            </UiButton>
          </AdminFormStyling>
        )}
      </UiForm>
    </UiModal>
  );
}

const AdminFormStyling = styled.div`
  display: grid;
  gap: ${pxToRem(20)};
  padding: ${pxToRem(20)};
`;
