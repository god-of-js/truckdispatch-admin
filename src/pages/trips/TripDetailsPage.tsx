import React, { lazy, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import sizes from 'utils/sizes';
import { Toast } from 'utils/toast';
import { RootState } from 'modules/index';
import { clientBasedUserTypes, serviceBasedUserTypes } from 'utils/constants';
import { toAnyAction } from 'utils/helpers';
import Trip from 'types/Trip';
import {
  approvePaymentRequest,
  selectTrip,
  updateTripStatus,
} from 'modules/Trips';
import {
  cancelTripByTransporter,
  cancelTripByTripCreator,
  unassignTrip,
} from 'modules/Trips';
import CreateTrip from 'components/trips/CreateTrip';
import TripHasBeenBroadcasted from 'components/trips/TripHasBeenBroadcasted';

const TripDetailPaymentCard = lazy(
  () => import('components/trips/TripDetailPaymentCard'),
);
const UserDetails = lazy(() => import('ui/UserDetails'));
const UiButton = lazy(() => import('ui/UiButton'));
const UiIcon = lazy(() => import('ui/UiIcon'));
const UiPill = lazy(() => import('ui/UiPill'));
const DashboardTopNav = lazy(() => import('components/layout/DashboardTopNav'));
const UiBackButton = lazy(() => import('ui/UiBackButton'));
const UiCard = lazy(() => import('ui/UiCard'));
const UiDataField = lazy(() => import('ui/UiDataField'));
const TripPickUpAndDeliverWithDates = lazy(
  () => import('components/trips/TripPickUpAndDeliverWithDates'),
);
const RequestPayment = lazy(() => import('components/payment/RequestPayment'));
const UiConfirmModal = lazy(() => import('ui/UiConfirmModal'));
const CargoLoadingProof = lazy(
  () => import('components/trips/CargoLoadingProof'),
);
const RejectPaymentRequest = lazy(
  () => import('components/trips/RejectPaymentRequest'),
);
const UploadTripTDO = lazy(() => import('components/trips/UploadTripTDO'));

export default function TripDetailsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const action = new URLSearchParams(location.search).get('action');
  const user = useSelector((state: RootState) => state.account.user);
  const { tripId } = useParams();
  const trip = useSelector(selectTrip(tripId!));
  const [isCancelTripVisible, setIsCancelTripVisible] = useState(false);
  const [isCancelTripLoading, setIsCancelTripLoading] = useState(false);
  const [isUnassignTripVisble, setIsUnassignTripVisible] = useState(false);
  const [requestPaymentIsVisible, setRequestPaymentIsVisible] = useState(false);
  const [cargoLoadingProofIsVisible, setCargoLoadingProofIsVisible] =
    useState(false);
  const [rejectPaymentRequestIsVisible, setRejectPaymentRequestIsVisible] =
    useState(false);
  const [addAccountIsVisible, setAddAccountIsVisible] = useState(false);
  const [approvePaymentIsVisible, setApprovePaymentIsVisible] = useState(false);
  const [approvePaymentIsLoading, setApprovePaymentIsLoading] = useState(false);
  const [reasonForRejectIsVisible, setReasonForRejectIsVisible] =
    useState(false);
  const [changeTripStatusIsLoading, setChangeTripStatusIsLoading] =
    useState(false);
  const [uploadTDOIsVisible, setUploadTDOIsVisible] = useState(false);
  const [isCreateTripVisible, setIsCreateTripVisible] = useState(false);
  const [isTripBroadcastedVisible, setIsTripBroadcastedVisible] =
    useState(false);
  const [newlyCreatedTripId, setnewlyCreatedTripId] = useState<string | null>(
    null,
  );
  const userIsClientBasedUser = useMemo(
    () => clientBasedUserTypes.includes(user?.userType!),
    [user],
  );
  const userIsServiceBasedUser = useMemo(
    () => serviceBasedUserTypes.includes(user?.userType!),
    [user],
  );

  const statusText = useMemo(() => {
    if (trip?.status === 'assigned') return 'Assigned';
    if (trip?.status === 'awaiting-bid') return 'Awaiting Bid';
    if (trip?.status === 'in-progress') return 'Ongoing';
    if (trip?.status === 'completed') return 'Completed';
    return trip?.status;
  }, [trip]);

  const statusVariant = useMemo(() => {
    if (trip?.status === 'awaiting-bid') return 'orange';
    if (trip?.status === 'assigned') return 'rose';
    if (trip?.status === 'in-progress') return 'info';
    if (trip?.status === 'completed') return 'success';

    return 'success';
  }, [trip]);

  const isClient = useMemo(() => {
    return clientBasedUserTypes.includes(user?.userType!);
  }, [user?.userType]);

  const tripIsEditable = useMemo(() => {
    const editIsNotAllowedStatuses = ['in-progress', 'completed'];

    return isClient && !editIsNotAllowedStatuses.includes(trip?.status!);
  }, [user, trip]);

  const tripIsUnassignable = useMemo(() => {
    return (
      !!trip?.transporter &&
      isClient &&
      trip.paymentRequest?.status !== 'completed'
    );
  }, [user, trip]);
  const tripcanBeCancelled = useMemo(() => {
    return trip?.paymentRequest?.status !== 'completed';
  }, [user, trip]);

  const edgeNode = useMemo(() => {
    return (
      <EdgeNode>
        <StatusIndicator>
          <span className="trip-status-text">Trip Status:</span>
          <div className="pill-container">
            <UiPill variant={statusVariant}>{statusText}</UiPill>
          </div>
        </StatusIndicator>
        {userIsServiceBasedUser && trip?.status === 'assigned' && (
          <UiButton
            loading={changeTripStatusIsLoading}
            onClick={() => changeStatus('in-progress')}
          >
            Start Trip
          </UiButton>
        )}
        {userIsServiceBasedUser && trip?.status === 'in-progress' && (
          <UiButton
            loading={changeTripStatusIsLoading}
            onClick={() => changeStatus('completed')}
          >
            Complete Trip
          </UiButton>
        )}
      </EdgeNode>
    );
  }, [trip, changeTripStatusIsLoading]);

  function redirectToAddAccount() {
    navigate('/profile/accounts');
  }

  function initRejectPayment() {
    setCargoLoadingProofIsVisible(false);
    setRejectPaymentRequestIsVisible(true);
  }

  function initApprovePayment() {
    setApprovePaymentIsVisible(true);
    setCargoLoadingProofIsVisible(false);
  }

  function changeStatus(status: Trip['status']) {
    setChangeTripStatusIsLoading(true);
    dispatch(toAnyAction(updateTripStatus(trip?._id!, status))).finally(() => {
      setChangeTripStatusIsLoading(false);
    });
  }
  async function approvePayment() {
    if (!trip || !trip.paymentRequest?._id) return;
    setApprovePaymentIsLoading(true);
    dispatch(
      toAnyAction(approvePaymentRequest(trip._id, trip.paymentRequest._id)),
    )
      .then(() => {
        setApprovePaymentIsVisible(false);
      })
      .finally(() => {
        setApprovePaymentIsLoading(false);
      });
  }

  function viewLoadingProof() {
    setCargoLoadingProofIsVisible(true);
  }
  function viewReasonForReject() {
    setReasonForRejectIsVisible(true);
  }

  useEffect(() => {
    if (
      trip?.paymentRequest &&
      trip?.paymentRequest.status !== 'completed' &&
      action === 'update-payment-request'
    ) {
      setRequestPaymentIsVisible(true);
    }
    navigate(`/my-trips/${tripId}`);
  }, [action, trip?.paymentRequest]);

  function initUnassignTrip() {
    setIsUnassignTripVisible(true);
  }

  function triggerUnassignTrip() {
    if (!tripId) {
      Toast.error({ msg: 'Trip ID was not provided.' });
      return;
    }
    setIsCancelTripLoading(true);
    dispatch(toAnyAction(unassignTrip(tripId))).finally(() => {
      setIsUnassignTripVisible(false);
      setIsCancelTripLoading(false);
    });
  }

  function initCancelTrip() {
    setIsCancelTripVisible(true);
  }

  function cancelTrip() {
    if (!tripId) {
      Toast.error({ msg: 'Trip ID was not provided.' });
      return;
    }
    setIsCancelTripLoading(true);

    const action = clientBasedUserTypes.includes(user?.userType!)
      ? cancelTripByTripCreator
      : cancelTripByTransporter;

    dispatch(toAnyAction(action(tripId))).finally(() => {
      setIsCancelTripLoading(false);
      setIsCancelTripVisible(false);
      navigate('/my-trips');
    });
  }

  function copyJobLink() {
    const host =
      window.location.protocol +
      '//' +
      window.location.hostname +
      (window.location.port ? ':' + window.location.port : '');
    navigator.clipboard
      .writeText(`${host}/available-jobs?job-id=${tripId}`)
      .then(() => {
        Toast.success({
          msg: 'Job link copied successfully. Send link to transporter of choice for a bid.',
        });
      });
  }

  function initEditTrip() {
    if (!tripId) {
      Toast.error({ msg: 'Trip ID was not provided' });
      return;
    }
    setIsCreateTripVisible(true);
  }

  function showTripBroadcasted(tripId: string) {
    setnewlyCreatedTripId(tripId);
    setIsTripBroadcastedVisible(true);
  }

  return (
    <>
      <DashboardTopNav
        routeName="Trip Details"
        startNode={<UiBackButton text="My Trips" route="/my-trips" />}
        edgeNode={edgeNode}
      />
      {trip && (
        <>
          <TripDetailsStyling>
            <UiCard>
              <div className="card-title">Cargo Details</div>
              <div className="cargo-details">
                <UiDataField title="Type" value={trip?.typeOfGoods} />
                <UiDataField title="Weight" value={trip?.weight + ' Tonnes'} />
                <UiDataField
                  title="Shipping Line"
                  value={trip?.shippingLine || 'N/A'}
                />
              </div>
            </UiCard>
            <UiCard>
              <div className="card-title">Handling Instructions</div>
              <p className="handling-instructions">
                {trip?.instructions || 'N/A'}
              </p>
            </UiCard>
            <UiCard>
              <div className="card-title">Pickup Address & Date</div>
              {trip && (
                <TripPickUpAndDeliverWithDates
                  pickUpAddress={trip.pickUpAddress}
                  pickUpDate={trip.pickUpDate}
                  deliveryAddress={trip.deliveryAddress}
                  deliveryDate={trip.deliveryDate}
                />
              )}
            </UiCard>
            <TripDetailPaymentCard
              isClient={userIsClientBasedUser}
              payment={trip?.paymentRequest}
              approvePayment={initApprovePayment}
              viewLoadingProof={viewLoadingProof}
              showReasonForReject={viewReasonForReject}
              requestPayment={() => setRequestPaymentIsVisible(true)}
            />
            <UiCard>
              <div className="card-title">Driver & Vehicle details</div>

              {trip.acceptedBid && (
                <div className="driver-and-vehicle-details">
                  <div className="driver-and-vehicle-details__field">
                    <div className="driver-and-vehicle-details__field__title">
                      Responsible Driver
                    </div>
                    <UserDetails
                      userName={trip.acceptedBid.vehicle.driver.name}
                      avatar={trip.acceptedBid.vehicle.driver.avatar}
                      profileSubtitle={
                        trip.status !== 'completed'
                          ? trip.acceptedBid.vehicle.driver.phone
                          : ''
                      }
                    />
                  </div>
                  <UiButton variant="icon-neutral">
                    <UiIcon icon="ArrowRight" />
                  </UiButton>
                  <div className="driver-and-vehicle-details__field">
                    <div className="driver-and-vehicle-details__field__title">
                      Vehicle Details
                    </div>
                    <div className="vehicle-details">
                      <div className="vehicle-details__type">
                        {trip.acceptedBid.vehicle.vehicleType}
                      </div>
                      <div className="vehicle-details__plate-number">
                        {trip.acceptedBid.vehicle.plateNumber}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </UiCard>
            <UiCard>
              <div className="card-title">
                {userIsServiceBasedUser
                  ? 'Trip Owner'
                  : 'Responsible Transporter'}
              </div>

              {userIsServiceBasedUser && (
                <UserDetails
                  userName={`${trip.tripOwner.firstName} ${trip.tripOwner.lastName}`}
                  avatar={trip.tripOwner.avatar}
                  userId={trip.tripOwner._id}
                  avatarIsHalfCurved
                  showMessage
                  showViewProfile
                  profileSubtitle={
                    trip.status !== 'completed' ? trip.tripOwner.phone : ''
                  }
                />
              )}
              {userIsClientBasedUser && (
                <>
                  {!!trip.transporter ? (
                    <UserDetails
                      userName={`${trip.transporter.firstName} ${trip.transporter.lastName}`}
                      avatar={trip.transporter.avatar}
                      userId={trip.transporter._id}
                      showMessage
                      showViewProfile
                      profileSubtitle={
                        trip.status !== 'completed'
                          ? trip.transporter.phone
                          : ''
                      }
                    />
                  ) : (
                    <UserDetails userName="Unassigned" />
                  )}
                </>
              )}
            </UiCard>
            <div className="double-grid">
              <UiCard>
                <div className="card-title">Transfer Delivery Order</div>
                <p className="description-text">
                  This is a document that authorizes the release of cargo from a
                  shipping terminal or port to the authorized transporter for
                  final delivery.
                </p>
                <div className="double-items">
                  {userIsClientBasedUser && !trip.TDO && (
                    <UiButton
                      isFullWidth
                      onClick={() => setUploadTDOIsVisible(true)}
                    >
                      Upload TDO
                    </UiButton>
                  )}
                  {!!trip.TDO && (
                    <a href={trip.TDO} target="_blank">
                      <UiButton isFullWidth> View TDO</UiButton>
                    </a>
                  )}
                </div>
              </UiCard>
              {userIsClientBasedUser && trip.status === 'awaiting-bid' && (
                <UiCard>
                  <div className="card-title">Bids</div>
                  <p className="description-text">
                    Bids are requests transporters send to enable them assist
                    you in your trip. Accept a bid to officially begin your
                    trip.
                  </p>
                  <div className="bottom">
                    <div className="double-items">
                      <Link to={`/my-trips/${trip._id}/bids`}>
                        <UiButton isFullWidth>
                          View bids sent for this trip
                        </UiButton>
                      </Link>
                    </div>
                  </div>
                </UiCard>
              )}
            </div>
          </TripDetailsStyling>
          <TripActions>
            {tripIsEditable && (
              <UiButton onClick={initEditTrip} variant="secondary">
                Edit Trip
              </UiButton>
            )}
            {isClient && !trip.transporter && (
              <UiButton
                variant="primary"
                disabled={!!trip?.transporter}
                onClick={copyJobLink}
              >
                <UiIcon icon="Link" />
                Copy Job Link
              </UiButton>
            )}

            {tripIsUnassignable && (
              <UiButton onClick={initUnassignTrip} variant="primary">
                Unassign Trip
              </UiButton>
            )}
            {tripcanBeCancelled && (
              <UiButton onClick={initCancelTrip} variant="danger-secondary">
                Cancel Trip
              </UiButton>
            )}
          </TripActions>
        </>
      )}
      {trip && (
        <UploadTripTDO
          trip={trip}
          key={`${uploadTDOIsVisible}-uploadTDOIsVisible`}
          onClose={() => setUploadTDOIsVisible(false)}
          isVisible={uploadTDOIsVisible}
        />
      )}

      {/** modals **/}
      <UiConfirmModal
        isVisible={isCancelTripVisible}
        title="Cancel Trip"
        variant="danger"
        loading={isCancelTripLoading}
        onClose={() => setIsCancelTripVisible(false)}
        onProceed={cancelTrip}
      >
        Are you sure you want to cancel this trip? This process cannot be
        undone.
      </UiConfirmModal>

      <CreateTrip
        isVisible={isCreateTripVisible}
        key={`${isCreateTripVisible}-isCreateTripVisible`}
        tripId={tripId}
        onClose={() => {
          setIsCreateTripVisible(false);
        }}
        onCreated={showTripBroadcasted}
      />
      {newlyCreatedTripId && (
        <TripHasBeenBroadcasted
          isVisible={isTripBroadcastedVisible}
          tripId={newlyCreatedTripId}
          onClose={() => setIsTripBroadcastedVisible(false)}
        />
      )}

      <UiConfirmModal
        title="Unassign Trip"
        isVisible={isUnassignTripVisble}
        variant="danger"
        loading={isCancelTripLoading}
        onClose={() => setIsUnassignTripVisible(false)}
        onProceed={triggerUnassignTrip}
      >
        Are you sure you want to unassign this trip? This process cannot be
        undone.
      </UiConfirmModal>
      {trip && (
        <>
          <RequestPayment
            key={`${requestPaymentIsVisible}-requestPaymentIsVisible`}
            isVisible={requestPaymentIsVisible}
            addAccountDetails={() => setAddAccountIsVisible(true)}
            paymentRequest={trip.paymentRequest}
            tripId={trip._id}
            onClose={() => setRequestPaymentIsVisible(false)}
          />
          <UiConfirmModal
            title="Add Payout Account"
            isVisible={addAccountIsVisible}
            onClose={() => setAddAccountIsVisible(false)}
            onProceed={redirectToAddAccount}
          >
            You are yet to add your payout account. Kindly add your account to
            be able to request payment.
          </UiConfirmModal>
          <UiConfirmModal
            title="Approve Payment"
            isVisible={approvePaymentIsVisible}
            notYetVariant="danger-secondary"
            variant="secondary"
            loading={approvePaymentIsLoading}
            onClose={() => setApprovePaymentIsVisible(false)}
            onProceed={approvePayment}
          >
            Are you sure you want to approve payment for this trip? This process
            cannot be undone.
          </UiConfirmModal>
          {!!trip.paymentRequest?.proofVideo && (
            <CargoLoadingProof
              isVisible={cargoLoadingProofIsVisible}
              isClient={userIsClientBasedUser}
              paymentRequest={trip.paymentRequest}
              approvePayment={initApprovePayment}
              rejectPayment={initRejectPayment}
              updatePaymentRequest={() => {
                setRequestPaymentIsVisible(true);
                setCargoLoadingProofIsVisible(false);
              }}
              onClose={() => setCargoLoadingProofIsVisible(false)}
            />
          )}
          {!!trip.paymentRequest && (
            <RejectPaymentRequest
              key={`${rejectPaymentRequestIsVisible}-rejectPaymentRequestIsVisible`}
              isVisible={rejectPaymentRequestIsVisible}
              tripId={trip._id}
              paymentRequestId={trip.paymentRequest?._id!}
              onClose={() => setRejectPaymentRequestIsVisible(false)}
            />
          )}
          <div className="reason-for-reject">
            <UiConfirmModal
              isVisible={reasonForRejectIsVisible}
              hideNotYetButton
              title="Reason for request rejection"
              confirmText="Update payment request"
              onProceed={() => {
                setReasonForRejectIsVisible(false);
                setRequestPaymentIsVisible(true);
              }}
              onClose={() => setReasonForRejectIsVisible(false)}
            >
              {trip.paymentRequest?.reasonForReject}
            </UiConfirmModal>
          </div>
        </>
      )}
      {/** modals end here **/}
    </>
  );
}

const TripDetailsStyling = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${pxToRem(20)};

  padding: ${pxToRem(12)} ${pxToRem(24)};

  .card-title {
    font-style: normal;
    font-weight: 600;
    font-size: ${pxToRem(14)};
    line-height: 140%;
    letter-spacing: -0.02em;
    color: var(--color-neutralBlack);
    margin-bottom: ${pxToRem(24)};
  }

  .cargo-details {
    display: grid;
    gap: ${pxToRem(12)};

    @media screen and (min-width: ${sizes.mobileSmall}) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  .handling-instructions {
    font-style: normal;
    font-weight: 400;
    font-size: ${pxToRem(16)};
    line-height: 140%;
    letter-spacing: -0.02em;
    color: var(--color-gray-80);
  }
  .description-text {
    font-style: normal;
    font-weight: 400;
    font-size: ${pxToRem(16)};
    padding-bottom: ${pxToRem(16)};
    line-height: 140%;
    letter-spacing: -0.02em;
    color: var(--color-gray-60);
  }
  .driver-and-vehicle-details {
    display: flex;
    align-items: center;
    justify-content: space-between;
    &__field {
      &__title {
        font-style: normal;
        font-weight: 400;
        font-size: ${pxToRem(12)};
        line-height: 140%;
        letter-spacing: 0.05em;
        color: var(--color-gray-70);
        text-transform: uppercase;
        margin-bottom: ${pxToRem(12)};
      }
    }
  }
  .vehicle-details {
    &__type {
      font-weight: 600;
      font-size: ${pxToRem(16)};
      line-height: 140%;
      letter-spacing: -0.02em;
      color: var(--color-neutralBlack);
    }
    &__plate-number {
      font-weight: 400;
      font-size: ${pxToRem(14)};
      line-height: 140%;
      letter-spacing: -0.02em;
      color: var(--color-gray-80);
    }
  }
  .double-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: ${pxToRem(20)};
  }

  .reason-for-reject {
    .modal-content {
      width: 90%;
      text-align: left;
    }
  }
  @media screen and (min-width: ${sizes.tablet}) {
    grid-template-columns: 2fr 1fr;

    .double-grid {
      grid-template-columns: repeat(2, 2fr);
    }
  }
`;

const TripActions = styled.div`
  padding: ${pxToRem(8)} ${pxToRem(0)};
  display: flex;
  gap: ${pxToRem(12)};
  align-items: flex-start;
  justify-content: center;
`;

const StatusIndicator = styled.div`
  display: flex;
  gap: ${pxToRem(12)};
  align-items: center;
  .trip-status-text {
    font-weight: 600;
    font-size: ${pxToRem(14)};
    line-height: 140%;
    letter-spacing: -0.02em;
    color: var(--color-neutralBlack);
  }
  .pill-container {
    background: #fff;
    border-radius: ${pxToRem(20)};
    padding: ${pxToRem(4)};

    .ui-pill {
      border-radius: ${pxToRem(16)};
      padding: ${pxToRem(8)};
      height: ${pxToRem(20)};
    }
  }
`;

const EdgeNode = styled.div`
  display: flex;
  align-items: center;
  gap: ${pxToRem(12)};

  button {
    min-width: ${pxToRem(133)};
  }
`;
