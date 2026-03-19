import { useEffect, useState } from 'react';

import { getCredentials } from '@/lib/storage';

export function useAuthState() {
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  async function refresh() {
    setLoading(true);
    const credentials = await getCredentials();
    setIsConfigured(Boolean(credentials));
    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  return { loading, isConfigured, refresh };
}
