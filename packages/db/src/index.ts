import 'server-only';
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { Studio, StudioMember, StudioMembership, Customer, Order, Task } from '@focoman/types';

/**
 * Server-Only Firestore Database Access & Repository Boundary
 * CHG-010: memoryStore fallback removed. Firebase Admin credentials are REQUIRED.
 * The server will throw a startup error if credentials are not configured.
 * There is no graceful in-memory degradation by design (Agents.md Rule 6: No Fake Data).
 */

if (typeof window !== 'undefined') {
  throw new Error(
    '@focoman/db is a SERVER-ONLY module and must never be imported into browser client bundles.'
  );
}

let firebaseAppInstance: App | null = null;
let firestoreDbInstance: Firestore | null = null;

/**
 * Returns a connected Firestore instance or throws a clear configuration error.
 * Fail-fast: if credentials are absent, the error surfaces immediately.
 */
export function getFirestoreServerInstance(): Firestore {
  if (firestoreDbInstance) {
    return firestoreDbInstance;
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT;

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;

  const existingApps = getApps();
  if (existingApps.length > 0) {
    firebaseAppInstance = existingApps[0];
  } else if (clientEmail && privateKey && projectId) {
    firebaseAppInstance = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    });
  } else if (emulatorHost && projectId) {
    // Firestore Emulator mode for local development
    firebaseAppInstance = initializeApp({ projectId });
  } else {
    throw new Error(
      '[Focoman DB] Firebase Admin credentials are not configured. ' +
      'Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your environment, ' +
      'or set FIRESTORE_EMULATOR_HOST to use the Firestore Emulator locally. ' +
      'In-memory fallback has been intentionally removed per project engineering rules.'
    );
  }

  firestoreDbInstance = getFirestore(firebaseAppInstance);
  return firestoreDbInstance;
}

// ============================================================================
// TYPED REPOSITORY FUNCTIONS FOR SERVER ACTIONS
// All functions are unconditional — they call Firestore directly.
// Errors propagate to callers, which surface them to the UI truthfully.
// ============================================================================

// 1. STUDIOS
export async function getStudioBySlug(slug: string): Promise<Studio | null> {
  const firestore = getFirestoreServerInstance();
  const snap = await firestore
    .collection('studios')
    .where('id', '==', slug.toLowerCase())
    .limit(1)
    .get();
  if (!snap.empty) {
    return snap.docs[0].data() as Studio;
  }
  return null;
}

export async function saveStudio(studio: Studio): Promise<Studio> {
  const firestore = getFirestoreServerInstance();
  await firestore.collection('studios').doc(studio.id).set(studio, { merge: true });
  return studio;
}

export async function registerStudioTransaction(
  studio: Studio,
  membership: StudioMembership
): Promise<{ success: boolean; error?: string }> {
  const firestore = getFirestoreServerInstance();
  try {
    await firestore.runTransaction(async (transaction) => {
      const studioRef = firestore.collection('studios').doc(studio.id);
      const studioDoc = await transaction.get(studioRef);
      if (studioDoc.exists) {
        throw new Error(`Studio identifier "${studio.id}" is already in use.`);
      }
      transaction.set(studioRef, studio);
      const membershipRef = firestore.collection('memberships').doc(membership.id);
      transaction.set(membershipRef, membership);
    });
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Transaction failed.' };
  }
}

export async function getMembershipsByUid(uid: string): Promise<StudioMembership[]> {
  const firestore = getFirestoreServerInstance();
  const snap = await firestore
    .collection('memberships')
    .where('uid', '==', uid)
    .where('status', '==', 'ACTIVE')
    .get();
  return snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => d.data() as StudioMembership);
}

export async function getMembershipByUidAndStudio(
  uid: string,
  studioId: string
): Promise<StudioMembership | null> {
  const firestore = getFirestoreServerInstance();
  const snap = await firestore
    .collection('memberships')
    .where('uid', '==', uid)
    .where('studioId', '==', studioId.toLowerCase())
    .where('status', '==', 'ACTIVE')
    .limit(1)
    .get();
  if (snap.empty) return null;
  return snap.docs[0].data() as StudioMembership;
}

// 2. ORDERS
export async function getOrdersByStudio(studioId: string): Promise<Order[]> {
  const firestore = getFirestoreServerInstance();
  const snap = await firestore
    .collection('orders')
    .where('studioId', '==', studioId.toLowerCase())
    .orderBy('createdAt', 'desc')
    .get();
  return snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => d.data() as Order);
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const firestore = getFirestoreServerInstance();
  const doc = await firestore.collection('orders').doc(orderId).get();
  if (doc.exists) return doc.data() as Order;
  return null;
}

export async function getOrderByPasskey(passkey: string): Promise<Order | null> {
  const cleanPasskey = passkey.trim().toUpperCase();
  const firestore = getFirestoreServerInstance();
  const snap = await firestore
    .collection('orders')
    .where('trackingPasskey', '==', cleanPasskey)
    .limit(1)
    .get();
  if (!snap.empty) return snap.docs[0].data() as Order;
  return null;
}

export async function saveOrder(order: Order): Promise<Order> {
  const firestore = getFirestoreServerInstance();
  await firestore.collection('orders').doc(order.id).set(order, { merge: true });
  return order;
}

export async function updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
  const firestore = getFirestoreServerInstance();
  const ref = firestore.collection('orders').doc(orderId);
  await ref.update({ ...updates, updatedAt: new Date().toISOString() });
  const snap = await ref.get();
  return snap.exists ? (snap.data() as Order) : null;
}

// 3. CUSTOMERS
export async function getCustomersByStudio(studioId: string): Promise<Customer[]> {
  const firestore = getFirestoreServerInstance();
  const snap = await firestore
    .collection('customers')
    .where('studioId', '==', studioId.toLowerCase())
    .get();
  return snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => d.data() as Customer);
}

export async function saveCustomer(customer: Customer): Promise<Customer> {
  const firestore = getFirestoreServerInstance();
  await firestore.collection('customers').doc(customer.id).set(customer, { merge: true });
  return customer;
}

// 4. MEMBERS (CREW)
export async function getMembersByStudio(studioId: string): Promise<StudioMember[]> {
  const firestore = getFirestoreServerInstance();
  const snap = await firestore
    .collection('members')
    .where('studioId', '==', studioId.toLowerCase())
    .get();
  return snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => d.data() as StudioMember);
}

export async function saveMember(member: StudioMember): Promise<StudioMember> {
  const firestore = getFirestoreServerInstance();
  await firestore.collection('members').doc(member.id).set(member, { merge: true });
  return member;
}

// 5. TASKS
export async function getTasksByOrder(orderId: string): Promise<Task[]> {
  const firestore = getFirestoreServerInstance();
  const snap = await firestore
    .collection('tasks')
    .where('orderId', '==', orderId)
    .orderBy('sequenceOrder', 'asc')
    .get();
  return snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => d.data() as Task);
}

export async function saveTasks(tasks: Task[]): Promise<Task[]> {
  const firestore = getFirestoreServerInstance();
  const batch = firestore.batch();
  tasks.forEach((t) => {
    const ref = firestore.collection('tasks').doc(t.id);
    batch.set(ref, t, { merge: true });
  });
  await batch.commit();
  return tasks;
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
  const firestore = getFirestoreServerInstance();
  const ref = firestore.collection('tasks').doc(taskId);
  await ref.update({ ...updates, updatedAt: new Date().toISOString() });
  const snap = await ref.get();
  return snap.exists ? (snap.data() as Task) : null;
}
