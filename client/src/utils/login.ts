import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { createAuth } from 'src/utils/firebase';
import { returnNull } from './returnNull';

export const loginWithGoogle = async () => {
  const googleAuthProvider = new GoogleAuthProvider();
  googleAuthProvider.addScope('profile');

  await signInWithRedirect(createAuth(), googleAuthProvider).catch(returnNull);
};

export const logout = async () => {
  await createAuth().signOut();
};
