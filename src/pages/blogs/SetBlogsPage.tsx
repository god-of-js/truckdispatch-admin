import { useState } from 'react';

import DashboardTopNav from 'components/layout/DashboardTopNav';
import UiForm from 'ui/UiForm';
import UiRichTextArea from 'ui/UiRichTextArea';
import UiInput from 'ui/UiInput';
import styled from 'styled-components';
import UiButton from 'ui/UiButton';

export default function SetBlogsPage() {
  const [formData, setFormData] = useState({
    title: '',
    bannerImg: null,
    content: '',
    contentArr: [{
        type: '',
        value: ''
    }],
  });

  function onChange() {}
  function setBlog() {}

  function addExtraContent() {}
 
  return (
    <UiForm formData={formData} onSubmit={setBlog}>
      {() => (
        <div>
          <DashboardTopNav
            routeName="Set Blog"
            edgeNode={<UiButton>Submit Blog post</UiButton>}
          />
          <BlogFormStyling>
            <UiInput
              value={formData.title}
              name="title"
              label="Title"
              onChange={onChange}
            />
            <UiRichTextArea
              value={formData.content}
              label="Content"
              name="content"
              onChange={onChange}
            />
            <UiButton variant="neutral">Add another field</UiButton>
          </BlogFormStyling>
        </div>
      )}
    </UiForm>
  );
}

const BlogFormStyling = styled.div`
  padding: ${pxToRem(24)};
  display: grid;
  gap: ${pxToRem(12)};
`;
