import { useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthChange } from '../firebase/auth';
import { getCustomerPoints } from '../firebase/firestore';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // No Firebase configured — skip auth, go straight to guest mode
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthChange(async (u) => {
      setUser(u);
      if (u) {
        try {
          const pts = await getCustomerPoints(u.uid);
          setPoints(pts);
        } catch {
          setPoints(0);
        }
      } else {
        setPoints(0);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const refreshPoints = async () => {
    if (user) {
      const pts = await getCustomerPoints(user.uid);
      setPoints(pts);
    }
  };

  return { user, points, loading, refreshPoints };
}
