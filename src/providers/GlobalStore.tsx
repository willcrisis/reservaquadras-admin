import { Court, COURTS_COLLECTION } from '@/db/court';
import { Role, ROLES_COLLECTION } from '@/db/role';
import { User, USERS_COLLECTION } from '@/db/user';
import { useCollectionRealtimeData } from '@/hooks/firebase';
import { GlobalStore } from '@/hooks/useGlobalStore';
import { useMemo } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withGlobalStore = (WrappedComponent: (props: any) => React.JSX.Element) => (props: any) => {
  const [users, { loading: loadingUsers, error: errorUsers }] = useCollectionRealtimeData<User>(USERS_COLLECTION);
  const [roles, { loading: loadingRoles, error: errorRoles }] = useCollectionRealtimeData<Role>(ROLES_COLLECTION);
  const [courts, { loading: loadingCourts, error: errorCourts }] = useCollectionRealtimeData<Court>(COURTS_COLLECTION);

  const providerValue = useMemo(
    () => ({
      users: { list: users, loading: loadingUsers, error: errorUsers },
      roles: { list: roles?.sort((a, b) => a.order - b.order) || [], loading: loadingRoles, error: errorRoles },
      courts: { list: courts, loading: loadingCourts, error: errorCourts },
    }),
    [errorCourts, errorRoles, errorUsers, loadingCourts, loadingRoles, loadingUsers, roles, users, courts],
  );
  return (
    <GlobalStore.Provider value={providerValue}>
      <WrappedComponent {...props} />
    </GlobalStore.Provider>
  );
};

export default withGlobalStore;
