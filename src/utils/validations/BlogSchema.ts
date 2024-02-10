import * as Yup from 'yup';
import { isRequiredMessage } from './validationVariables';

export default Yup.object({
  title: Yup.string().required(isRequiredMessage),
});
