import React, { lazy, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { loginUser } from 'modules/Account';

import { toAnyAction } from 'utils/helpers';
import loginSchema from 'utils/validations/loginSchema';
import { getPendingRoute } from 'utils/localStorageMethods';

const UiForm = lazy(() => import('ui/UiForm'));
const UiInput = lazy(() => import('ui/UiInput'));
const UiButton = lazy(() => import('ui/UiButton'));
const AuthLayoutStyling = lazy(
  () => import('components/layout/AuthLayoutStyling'),
);
const StyledAuthContent = lazy(
  () => import('components/auth/StyledAuthContent'),
);

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{ email: string; password: string }>(
    {
      email: '',
      password: '',
    },
  );

  const [loading, setLoading] = useState(false);

  function handleChange(event: { name: string; value: string | null }) {
    setFormData({
      ...formData,
      [event.name]: event.value,
    });
  }

  function handleSubmit() {
    setLoading(true);
    dispatch(toAnyAction(loginUser(formData)))
      .then(() => {
        const pendingRoute = getPendingRoute();
        if (pendingRoute) {
          navigate(pendingRoute);
        }
        window.location.reload();
      })
      .catch((err: Error) => {
        let msg = err.message;
        if (msg === 'Phone has not been verified') {
          navigate('/auth/verify-phone');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <AuthLayoutStyling img invert isInvertedForm>
      <StyledAuthContent inverted>
        <div className="form-container">
          <header>
            <h1>Welcome back</h1>
            <p className="info-text">Sign in to continue to your account</p>
          </header>
          <UiForm
            schema={loginSchema}
            formData={formData}
            onSubmit={handleSubmit}
          >
            {({ errors }) => (
              <div className="form-container__inner">
                <UiInput
                  label="Email Adress*"
                  placeholder="Enter your email adress"
                  value={formData.email}
                  name="email"
                  error={errors.email}
                  onChange={handleChange}
                />
                <UiInput
                  type="password"
                  placeholder="Enter your password"
                  label="Password*"
                  name="password"
                  value={formData.password!}
                  error={errors.password}
                  onChange={handleChange}
                />
                <p>
                  Forgot Password?
                  <Link to="/auth/forgot-password">Reset Password</Link>
                </p>
                <div className="hidden-in-mobile">
                  <UiButton
                    isFullWidth
                    loading={loading}
                    size="large"
                    variant="primary"
                  >
                    Sign In
                  </UiButton>
                </div>

                <div className="bottom-actions">
                  <div className="visible-in-mobile">
                    <UiButton
                      isFullWidth
                      loading={loading}
                      size="large"
                      variant="primary"
                    >
                      Sign In
                    </UiButton>
                  </div>
                  <p>
                    <span>New to TruckDispatch?</span>
                    <Link to="/auth/join">Sign Up</Link>
                  </p>
                </div>
              </div>
            )}
          </UiForm>
        </div>
      </StyledAuthContent>
    </AuthLayoutStyling>
  );
}
