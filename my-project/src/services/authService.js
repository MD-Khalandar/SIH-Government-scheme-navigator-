import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '../../firebase';

const getConfiguredAuth = () => {
  if (!auth) {
    throw new Error('Firebase is not configured. Add valid VITE_FIREBASE_* values to .env.local and restart the dev server.');
  }
  return auth;
};

const mapFirebaseUser = (firebaseUser, fallback = null) => {
  if (!firebaseUser) return null;

  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || fallback?.name || '',
    email: firebaseUser.email || fallback?.email || '',
    phone: fallback?.phone || firebaseUser.phoneNumber || ''
  };
};

const storeCurrentUser = (user) => {
  if (!user) {
    localStorage.removeItem('sahayak_user');
    localStorage.removeItem('sahayak_token');
    return;
  }

  localStorage.setItem('sahayak_user', JSON.stringify(user));
  localStorage.setItem('sahayak_token', auth?.currentUser?.accessToken || 'firebase-auth');
};

export const authService = {
  register: async (data) => {
    if (!data?.fullName || !data?.email || !data?.phone || !data?.password) {
      throw new Error('Full name, email, phone, and password are required');
    }

    if (!data.email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }

    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (data.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const userCredential = await createUserWithEmailAndPassword(
      getConfiguredAuth(),
      data.email.trim(),
      data.password
    );

    await updateProfile(userCredential.user, {
      displayName: data.fullName.trim()
    });

    const user = mapFirebaseUser(userCredential.user, {
      name: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim()
    });

    storeCurrentUser(user);

    return { success: true, user };
  },

  login: async (emailOrPhone, password) => {
    if (!emailOrPhone || !password) {
      throw new Error('Email and password are required');
    }

    const email = emailOrPhone.trim();
    if (!email.includes('@')) {
      throw new Error('Please use your email address to sign in');
    }

    const userCredential = await signInWithEmailAndPassword(getConfiguredAuth(), email, password);
    const user = mapFirebaseUser(userCredential.user);

    storeCurrentUser(user);

    return { success: true, user };
  },

  forgotPassword: async (email) => {
    if (!email || !email.includes('@')) {
      throw new Error('Email is required');
    }
    await sendPasswordResetEmail(getConfiguredAuth(), email.trim());
    return { success: true, message: `Password reset link sent to ${email}` };
  },

  getCurrentUser: () => {
    if (auth?.currentUser) {
      return mapFirebaseUser(auth.currentUser);
    }

    return null;
  },

  isAuthenticated: () => {
    return !!auth?.currentUser;
  },

  logout: async () => {
    try {
      if (auth) await signOut(auth);
    } catch (error) {
      console.warn('Firebase sign-out warning:', error);
    }

    localStorage.removeItem('sahayak_user');
    localStorage.removeItem('sahayak_token');
    localStorage.removeItem('sahayak_profile');
    pendingPhoneConfirmation = null;

    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }

    return { success: true };
  }
};

export default authService;
