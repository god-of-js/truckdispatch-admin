import { useState } from 'react';
import styled from 'styled-components';
import UiButton from 'ui/UiButton';
import UiForm from 'ui/UiForm';
import UiInput, { OnChangeParams } from 'ui/UiInput';
import UiModal from 'ui/UiModal';
import UiSelect from 'ui/UiSelect';

interface Props {
  isVisible: boolean;
  onClose: () => void;
}
export default function AdminForm({ isVisible, onClose }: Props) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    type: '',
  });
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
  function createAdmin() {}
  return (
    <UiModal
      title="Add Admin"
      isVisible={isVisible}
      size="sm"
      onClose={onClose}
    >
      <UiForm formData={formData} onSubmit={createAdmin}>
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
              name="type"
              value={formData.type}
              onChange={handleChange}
            />
            <UiButton isFullWidth>Create Admin</UiButton>
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
