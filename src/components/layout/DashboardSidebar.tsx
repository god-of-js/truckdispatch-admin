import React, { lazy, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import sizes from 'utils/sizes';

import { RootState } from 'modules/index';
import { removeUserSessionId } from 'utils/localStorageMethods';
import { shipperRoutes, transporterRoutes } from './routes';
import { setUser } from 'modules/Account';

const AppLogo = lazy(() => import('ui/AppLogo'));
const UiButton = lazy(() => import('ui/UiButton'));
const UiAvatar = lazy(() => import('ui/UiAvatar'));
const UiIcon = lazy(() => import('ui/UiIcon'));

export default function DashboardSidebar() {
  const user = useSelector((state: RootState) => state.account.user);
  const dispatch = useDispatch();
  const appLocation = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const userType = useMemo(() => {
    if (user?.userType === 'transporter') return 'transporter';
    if (user?.userType === 'shipper') return 'shipper';
    if (user?.userType === 'transportCompany') return 'Transport Company';

    return 'company';
  }, [user]);

  const routes = useMemo(() => {
    if (!user) return [];
    // TODO: filter routes about to user admin levels
    return user?.userType === 'transporter' ? transporterRoutes : shipperRoutes;
  }, [user]);

  function isRouteActive(route: string) {
    if (route === '/') return route === appLocation.pathname;

    return appLocation.pathname.includes(route);
  }

  function logOutUser() {
    removeUserSessionId();
    dispatch(setUser(null));
    window.location.reload();
  }

  function toggleShowNames() {
    setIsExpanded(!isExpanded);
  }

  function closeIsMobileExpandedIfOpen() {
    if (isMobileExpanded) setIsMobileExpanded(false);
  }

  return (
    <>
      <Sidebar isExpanded={isExpanded} isMobileExpanded={isMobileExpanded}>
        <div className="sidebar__inner">
          <header className="hide-in-small-screen">
            <Link to="/my-trips" onClick={closeIsMobileExpandedIfOpen}>
              <AppLogo />
              <span className="app-name hide-in-unexpanded-large-screen">
                TruckDispatch
              </span>
            </Link>
            <button className="toggle-btn" onClick={toggleShowNames}>
              <UiIcon
                icon={isExpanded ? 'ArrowCircleLeft' : 'ArrowCircleRight'}
                size="20"
              />
            </button>
          </header>
          <div className="side-menu-text hide-in-large-screen">SIDE MENU</div>

          <ul>
            {routes.map((route, index) => (
              <Link
                to={route.path}
                key={index}
                onClick={closeIsMobileExpandedIfOpen}
              >
                <li className={isRouteActive(route.path) ? 'active' : ''}>
                  <div className="list-item-content">
                    <UiIcon icon={route.iconName} size="24" />{' '}
                    <span className="hide-in-unexpanded-large-screen">
                      {route.name}
                    </span>
                  </div>
                  <div className="hide-in-large-screen">
                    {isRouteActive(route.path) && <UiIcon icon="Tick" />}
                  </div>
                </li>
              </Link>
            ))}
          </ul>

          <div className="bottom-actions">
            <Link to="/profile" onClick={closeIsMobileExpandedIfOpen}>
              <div className="profile">
                <div className="user-details">
                  <UiAvatar avatar={user?.avatar} />
                  <div className="hide-in-unexpanded-large-screen">
                    <div className="user-name">{`${user?.firstName} ${user?.lastName}`}</div>
                    <div className="user-type">{userType}</div>
                  </div>
                </div>
                <div className="hide-in-large-screen">
                  <UiButton variant="secondary">View profile</UiButton>
                </div>
              </div>
            </Link>
            <div className="logout-container">
              <div className="logout-content" onClick={logOutUser}>
                <span className="hide-in-small-screen">
                  <UiIcon icon="Logout" size="24" />
                </span>
                <span className="logout-text hide-in-unexpanded-large-screen">
                  Logout
                </span>
              </div>
              <Button
                className="hide-in-large-screen"
                onClick={closeIsMobileExpandedIfOpen}
              >
                <span>Close</span> <UiIcon icon="CloseThick" size="15" />
              </Button>
            </div>
          </div>
        </div>
      </Sidebar>
      <BottomNav>
        <Button onClick={() => setIsMobileExpanded(true)}>
          <UiIcon icon="Menu" size="24" />
        </Button>
        {routes.slice(0, 2).map((route) => (
          <Link to={route.path} key={route.path}>
            <Button className={isRouteActive(route.path) ? 'active' : ''}>
              {route.name}
            </Button>
          </Link>
        ))}
        <Link to="/chat">
          <Button className={isRouteActive('/chat') ? 'active' : ''}>
            Chat
          </Button>
        </Link>
      </BottomNav>
    </>
  );
}

const Sidebar = styled.nav<{ isExpanded: boolean; isMobileExpanded: boolean }>`
  display: ${({ isMobileExpanded }) => (isMobileExpanded ? 'block' : 'none')};
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  z-index: 2;
  /* TODO: calc the height of 100% - nav bar height */
  height: ${({ isMobileExpanded }) =>
    isMobileExpanded ? 'calc(100% - 72px)' : 'none'};

  .hide-in-small-screen {
    display: none;
  }

  .side-menu-text {
    margin: ${pxToRem(24)} ${pxToRem(16)};
    font-family: 'thiccboi-extrabold';
    font-style: normal;
    font-weight: 700;
    font-size: ${pxToRem(14)};
    line-height: 140%;
    letter-spacing: 0.05em;
    color: var(--color-gray-70);
  }

  ul {
    margin: 0 ${pxToRem(16)};
    display: grid;
    gap: ${pxToRem(12)};

    a {
      text-decoration: none;
    }

    li {
      border-radius: ${pxToRem(8)};
      padding: ${pxToRem(8)};
      height: ${pxToRem(36)};
      color: var(--color-gray-70);
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;

      .list-item-content {
        display: flex;
        align-items: center;
        gap: ${pxToRem(8)};
      }

      &.active {
        background: var(--color-primary-10);
        color: var(--color-primary);

        svg {
          fill: var(--color-primary);
        }
      }
    }
  }

  .bottom-actions {
    position: absolute;
    bottom: 0;
    width: 100%;

    .profile {
      border-bottom: ${pxToRem(1)} solid var(--color-gray-30);
      border-top: ${pxToRem(1)} solid var(--color-gray-30);
      padding: ${pxToRem(24)};
      display: flex;
      align-items: center;
      justify-content: space-between;

      .user-details {
        display: flex;
        align-items: center;
        gap: ${pxToRem(8)};

        .user-name {
          font-style: normal;
          font-weight: 600;
          font-size: ${pxToRem(16)};
          line-height: 140%;
          letter-spacing: -0.02em;
          color: var(--color-gray-80);
        }
        .user-type {
          font-style: normal;
          font-weight: 400;
          font-size: ${pxToRem(10)};
          line-height: 140%;
          letter-spacing: 0.05em;
          color: var(--color-gray-80);
          text-transform: uppercase;
        }
      }
    }
    .logout-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: ${pxToRem(24)};
      .logout-content {
        flex-grow: 1;
        cursor: pointer;
      }

      .logout-text {
        font-style: normal;
        font-weight: 600;
        font-size: ${pxToRem(16)};
        line-height: 140%;
        letter-spacing: -0.02em;
        color: var(--color-danger);
      }
    }
  }

  @media screen and (max-height: ${pxToRem(770)}) {
    max-width: 100%;
    .sidebar__inner {
      overflow-y: auto;
      scrollbar-width: ${pxToRem(0)};
      scrollbar-color: transparent transparent;
    }
    .sidebar__inner::-webkit-scrollbar {
      width: ${pxToRem(0)};
    }
    .sidebar__inner::-webkit-scrollbar-thumb {
      background-color: transparent;
    }
    .bottom-actions {
      margin-top: ${pxToRem(20)};
      position: relative;
    }
  }

  @media only screen and (min-width: ${sizes.mobileLargeWidth}) {
    display: block;
    width: ${({ isExpanded }) => (isExpanded ? '16%' : '7%')};
    min-width: ${({ isExpanded }) =>
      isExpanded ? pxToRem(260) : pxToRem(124)};
    border-top: none;
    position: static;
    border-right: ${pxToRem(1)} solid var(--color-gray-200);

    .sidebar__inner {
      height: 100%;
      width: 100%;
      position: relative;
    }

    header {
      border-bottom: ${pxToRem(1)} solid var(--color-gray);
      margin-bottom: ${pxToRem(32)};
      padding: ${pxToRem(28)} ${pxToRem(24)};
      display: flex !important;
      align-items: center;

      a {
        width: 100%;
        height: 100%;
        text-decoration: none;
        font-style: normal;
        font-family: 'thiccboi-extrabold';
        font-weight: 700;
        font-size: ${pxToRem(18)};
        line-height: 140%;
        letter-spacing: -0.02em;
        color: var(--color-neutralBlack);
        display: flex;
        align-items: center;
        gap: ${pxToRem(8)};
        justify-content: ${({ isExpanded }) => (isExpanded ? '' : 'center')};
      }

      .toggle-btn {
        position: absolute;
        background-color: white;
        height: ${pxToRem(32)};
        width: ${pxToRem(32)};
        border-radius: 50%;
        outline: 0;
        border: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
        right: 0;
        margin-right: -${pxToRem(12)};
      }
    }

    .hide-in-unexpanded-large-screen {
      display: ${({ isExpanded }) => (isExpanded ? '' : 'none')};
    }

    .side-menu-text {
      display: none;
    }
    .hide-in-large-screen {
      display: none;
    }
    .hide-in-small-screen {
      display: block;
    }

    ul {
      gap: ${pxToRem(20)};
      margin: 0 ${pxToRem(24)};
      li {
        border-left: ${pxToRem(4)} solid transparent;
        border-top-left-radius: ${pxToRem(0)};
        border-bottom-left-radius: ${pxToRem(0)};

        .list-item-content {
          justify-content: ${({ isExpanded }) =>
            isExpanded ? 'flex-start' : 'center'};
          flex-grow: 1;
        }
        &.active,
        &:hover,
        &:focus {
          border-left: ${pxToRem(4)} solid var(--color-primary);
          background: var(--color-primary-10);
          color: var(--color-primary);
          svg {
            fill: var(--color-primary);
          }
        }
      }
    }
    .bottom-actions {
      .profile {
        border-bottom: transparent;
        padding: ${pxToRem(20)} ${pxToRem(24)} ${pxToRem(8)} ${pxToRem(24)};

        .user-details {
          flex-grow: 1;
          justify-content: ${({ isExpanded }) => (isExpanded ? '' : 'center')};
        }
      }

      .logout-container {
        padding: ${pxToRem(8)} ${pxToRem(24)};
        margin: ${pxToRem(16)} 0;

        .logout-content {
          display: flex;
          align-items: flex-start;
          gap: ${pxToRem(8)};
          justify-content: ${({ isExpanded }) => (isExpanded ? '' : 'center')};
        }
      }
    }
  }
`;

const BottomNav = styled.footer`
  background: white;
  border-radius: ${pxToRem(16)} ${pxToRem(16)} 0 0;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: ${pxToRem(20)} ${pxToRem(16)};
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: ${pxToRem(10)};
  z-index: 1;

  @media screen and (min-width: ${sizes.mobileLargeWidth}) {
    display: none;
  }
`;

const Button = styled.button`
  padding: ${pxToRem(12)};
  gap: ${pxToRem(33)};
  height: ${pxToRem(44)};
  background: var(--color-gray-20);
  border-radius: ${pxToRem(8)};
  outline: none;
  border: transparent;
  font-family: 'thiccboi-bold';
  letter-spacing: -0.02em;
  color: var(--color-gray-70);
  font-style: normal;
  font-weight: 600;
  font-size: ${pxToRem(16)};
  line-height: 140%;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  gap: ${pxToRem(12)};

  &.active {
    border-color: var(--color-primary);
    background: var(--color-primary-10);
    color: var(--color-primary);
    svg {
    }
  }
`;
