// src/firebase/firebase.js

import { getAuth, updateProfile } from 'firebase/auth';

// Your existing Firebase configuration and initialization code

export const auth = getAuth();

export const updateUserProfile = (user, profile) => {
  return updateProfile(user, profile);
};
