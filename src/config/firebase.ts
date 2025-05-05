import firebaseAdmin, { ServiceAccount } from 'firebase-admin';
import serviceAccount from '../utils/firebase-service-account';

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount as ServiceAccount),
});

export default firebaseAdmin;


