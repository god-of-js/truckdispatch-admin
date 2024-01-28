import { RootState } from 'modules/index';
import { lazy, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { serviceBasedUserTypes } from 'utils/constants';

const UiIcon = lazy(() => import('ui/UiIcon'));
const UiButton = lazy(() => import('ui/UiButton'));
const UiAvatar = lazy(() => import('ui/UiAvatar'));

type Sizes = 'large' | 'sm' | 'md';
interface Props {
  userId?: string;
  avatar?: string;
  userName: string;
  size?: Sizes;
  profileSubtitle?: string;
  hideProfileSubtitle?: boolean;
  showViewProfile?: boolean;
  showMessage?: boolean;
  avatarIsHalfCurved?: boolean;
}
export default function UserDetails({
  avatar,
  userName,
  profileSubtitle,
  userId,
  avatarIsHalfCurved,
  size = 'large',
  showMessage,
  hideProfileSubtitle,
}: Props) {
  const user = useSelector((state: RootState) => state.account.user);
  const chatLink = useMemo(() => {
    if (!user) return;
    if (serviceBasedUserTypes.includes(user.userType!)) {
      return `/chat?clientId=${userId}&transporterId=${user._id}`;
    }

    return `/chat?clientId=${user._id}&transporterId=${userId}`;
  }, [user, userId]);
  function messageUser() {}
  return (
    <UserDetailsStyling size={size}>
      <div className="user-profile">
        <UiAvatar avatar={avatar} isHalfCurved={avatarIsHalfCurved} />
        <div>
          <div className="user-details-name">{userName}</div>
          {!hideProfileSubtitle && (
            <div className="profile-subtitle">
              {profileSubtitle || '----------------------------'}
            </div>
          )}
        </div>
      </div>
      <div className="user-details-actions">
        {false && (
          <UiButton variant="secondary" size="md">
            View Profile
          </UiButton>
        )}
        {showMessage && chatLink && (
          <Link to={chatLink}>
            <UiButton size="md">
              <UiIcon icon="DoubleChat" />
            </UiButton>
          </Link>
        )}
      </div>
    </UserDetailsStyling>
  );
}

const UserDetailsStyling = styled.div<{ size: Sizes }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${pxToRem(16)};
  .user-profile {
    display: flex;
    gap: ${pxToRem(8)};
    align-items: center;
  }

  .user-details-name {
    font-style: normal;
    font-weight: 600;
    font-size: ${({ size }) => (size === 'sm' ? pxToRem(14) : pxToRem(16))};
    line-height: 140%;
    letter-spacing: -0.02em;
    color: var(--color-neutralBlack);
    text-transform: capitalize;
    white-space: nowrap;
  }

  .profile-subtitle {
    font-style: normal;
    font-weight: 400;
    font-size: ${({ size }) => (size === 'sm' ? pxToRem(10) : pxToRem(14))};
    line-height: 140%;
    letter-spacing: -0.02em;
    color: var(--color-gray-80);
    text-transform: uppercase;
  }

  .user-details-actions {
    display: flex;
    align-items: center;
    gap: ${pxToRem(8)};
  }
`;
