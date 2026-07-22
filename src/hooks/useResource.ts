import { useEffect, useRef, useState } from 'react';

interface ResourceState<T> {
  data: T | null;
  loading: boolean;
  error: boolean;
}

export function useResource<T>(fetcher: () => Promise<T>, initialData?: T): ResourceState<T> {
  const [data, setData] = useState<T | null>(initialData ?? null);
  const [loading, setLoading] = useState(initialData === undefined);
  const [error, setError] = useState(false);
  const hadInitialData = useRef(initialData !== undefined);

  useEffect(() => {
    let cancelled = false;

    fetcher()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
        if (!hadInitialData.current) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [fetcher]);

  return { data, loading, error };
}
