import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';
import { AdminUser } from '../types/admin';

export async function loginAdmin(email: string, pass: string): Promise<AdminUser> {
  if (!isFirebaseConfigured || !auth) {
    // Modo demo / local fallback cuando no hay Firebase configurado
    if (email === 'admin@megusta.com' && pass === 'admin123') {
      const demoUser: AdminUser = {
        uid: 'demo-admin-uid',
        email: 'admin@megusta.com',
        displayName: 'Administrador Demo',
      };
      localStorage.setItem('megusta_demo_admin', JSON.stringify(demoUser));
      return demoUser;
    }
    throw new Error('Credenciales incorrectas o Firebase no configurado.');
  }

  const credential = await signInWithEmailAndPassword(auth, email, pass);
  return {
    uid: credential.user.uid,
    email: credential.user.email,
    displayName: credential.user.displayName,
  };
}

export async function logoutAdmin(): Promise<void> {
  if (!isFirebaseConfigured || !auth) {
    localStorage.removeItem('megusta_demo_admin');
    return;
  }
  await signOut(auth);
}

export function subscribeToAuthState(callback: (user: AdminUser | null) => void): () => void {
  if (!isFirebaseConfigured || !auth) {
    const stored = localStorage.getItem('megusta_demo_admin');
    if (stored) {
      try {
        callback(JSON.parse(stored));
      } catch {
        callback(null);
      }
    } else {
      callback(null);
    }
    return () => {};
  }

  return onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      });
    } else {
      callback(null);
    }
  });
}
