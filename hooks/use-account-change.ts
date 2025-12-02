import { useEffect, useState } from 'react';
import { useConfig } from 'wagmi';
import { GetAccountReturnType, watchAccount } from 'wagmi/actions';

const useAccountChange = () => {
  const [accountChanged, setAccountChanged] = useState(false);

  const config = useConfig();

  useEffect(() => {
    const unwatch = watchAccount(config, {
      onChange: (account: GetAccountReturnType, prevAccount: GetAccountReturnType) => {
        setAccountChanged(prevAccount.address !== account.address);
      },
    });

    return () => unwatch();
  }, [config]);

  return accountChanged;
};

export default useAccountChange;
