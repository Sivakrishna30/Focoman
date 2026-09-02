import 'server-only';
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { Studio, StudioMember, Customer, Order, Task } from '@focoman/types';

/**
 * Server-Only Firestore Database Access & Repository Boundary
 * Privileged database access executes exclusively on the server.
 * Generic unrestricted CRUD is NEVER exposed to the client browser.
 */

export const IS_SERVER_ENVIRONMENT = typeof window === 'undefined';

if (!IS_SERVER_ENVIRONMENT) {
  throw new Error(
    '@focoman/db is a SERVER-ONLY module and must never be imported into browser client bundles.'
  );
}

let firebaseAppInstance: App | null = null;
let firestoreDbInstance: Firestore | null = null;
let isLiveFirestoreActive = false;

// In-memory fallback store for local development / testing when GCP credentials are not yet provisioned
const memoryStore = {
  studios: new Map<string, Studio>(),
  orders: new Map<string, Order>(),
  customers: new Map<string, Customer>(),
  members: new Map<string, StudioMember>(),
  tasks: new Map<string, Task>(),
};

/**
 * Initializes and returns the server Firebase Admin Firestore instance.
 * Gracefully activates live Firestore if cloud credentials are present;
 * otherwise uses in-memory dev store without crashing.
 */
export function getFirestoreServerInstance(): {
  isLive: boolean;
  firestore: Firestore | null;
  projectId?: string;
} {
  if (firestoreDbInstance) {
    return {
      isLive: isLiveFirestoreActive,
      firestore: firestoreDbInstance,
      projectId: firebaseAppInstance?.options.projectId,
    };
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

  try {
    const existingApps = getApps();
    if (existingApps.length > 0) {
      firebaseAppInstance = existingApps[0];
    } else if (clientEmail && privateKey && projectId) {
      firebaseAppInstance = initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
        projectId,
      });
    } else if (projectId || emulatorHost) {
      firebaseAppInstance = initializeApp({ projectId: projectId || 'focoman-dev' });
    }

    if (firebaseAppInstance) {
      firestoreDbInstance = getFirestore(firebaseAppInstance);
      isLiveFirestoreActive = true;
      return {
        isLive: true,
        firestore: firestoreDbInstance,
        projectId: firebaseAppInstance.options.projectId,
      };
    }
  } catch (err) {
    console.warn(
      '[Focoman DB] Live Firebase Admin initialization deferred. Operating with local memory store.',
      err
    );
  }

  isLiveFirestoreActive = false;
  return {
    isLive: false,
    firestore: null,
    projectId: projectId || 'focoman-local',
  };
}

// ============================================================================
// TYPED REPOSITORY FUNCTIONS FOR SERVER ACTIONS
// ============================================================================

// 1. STUDIOS
export async function getStudioBySlug(slug: string): Promise<Studio | null> {
  const { isLive, firestore } = getFirestoreServerInstance();
  if (isLive && firestore) {
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
  return memoryStore.studios.get(slug.toLowerCase()) || null;
}

export async function saveStudio(studio: Studio): Promise<Studio> {
  const { isLive, firestore } = getFirestoreServerInstance();
  if (isLive && firestore) {
    await firestore.collection('studios').doc(studio.id).set(studio, { merge: true });
    return studio;
  }
  memoryStore.studios.set(studio.id.toLowerCase(), studio);
  return studio;
}

// 2. ORDERS
export async function getOrdersByStudio(studioId: string): Promise<Order[]> {
  const { isLive, firestore } = getFirestoreServerInstance();
  if (isLive && firestore) {
    const snap = await firestore
      .collection('orders')
      .where('studioId', '==', studioId.toLowerCase())
      .orderBy('createdAt', 'desc')
      .get();
    return snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => d.data() as Order);
  }
  return Array.from(memoryStore.orders.values()).filter(
    (o) => o.studioId.toLowerCase() === studioId.toLowerCase()
  );
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const { isLive, firestore } = getFirestoreServerInstance();
  if (isLive && firestore) {
    const doc = await firestore.collection('orders').doc(orderId).get();
    if (doc.exists) return doc.data() as Order;
    return null;
  }
  return memoryStore.orders.get(orderId) || null;
}

export async function getOrderByPasskey(passkey: string): Promise<Order | null> {
  const cleanPasskey = passkey.trim().toUpperCase();
  const { isLive, firestore } = getFirestoreServerInstance();
  if (isLive && firestore) {
    const snap = await firestore
      .collection('orders')
      .where('trackingPasskey', '==', cleanPasskey)
      .limit(1)
      .get();
    if (!snap.empty) return snap.docs[0].data() as Order;
    return null;
  }
  for (const order of memoryStore.orders.values()) {
    if (order.trackingPasskey.toUpperCase() === cleanPasskey) {
      return order;
    }
  }
  return null;
}

export async function saveOrder(order: Order): Promise<Order> {
  const { isLive, firestore } = getFirestoreServerInstance();
  if (isLive && firestore) {
    await firestore.collection('orders').doc(order.id).set(order, { merge: true });
    return order;
  }
  memoryStore.orders.set(order.id, order);
  return order;
}

export async function updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
  const { isLive, firestore } = getFirestoreServerInstance();
  if (isLive && firestore) {
    const ref = firestore.collection('orders').doc(orderId);
    await ref.update({ ...updates, updatedAt: new Date().toISOString() });
    const snap = await ref.get();
    return snap.exists ? (snap.data() as Order) : null;
  }
  const existing = memoryStore.orders.get(orderId);
  if (!existing) return null;
  const updated: Order = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  memoryStore.orders.set(orderId, updated);
  return updated;
}

// 3. CUSTOMERS
export async function getCustomersByStudio(studioId: string): Promise<Customer[]> {
  const { isLive, firestore } = getFirestoreServerInstance();
  if (isLive && firestore) {
    const snap = await firestore
      .collection('customers')
      .where('studioId', '==', studioId.toLowerCase())
      .get();
    return snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => d.data() as Customer);
  }
  return Array.from(memoryStore.customers.values()).filter(
    (c) => c.studioId.toLowerCase() === studioId.toLowerCase()
  );
}

export async function saveCustomer(customer: Customer): Promise<Customer> {
  const { isLive, firestore } = getFirestoreServerInstance();
  if (isLive && firestore) {
    await firestore.collection('customers').doc(customer.id).set(customer, { merge: true });
    return customer;
  }
  memoryStore.customers.set(customer.id, customer);
  return customer;
}

// 4. MEMBERS (CREW)
export async function getMembersByStudio(studioId: string): Promise<StudioMember[]> {
  const { isLive, firestore } = getFirestoreServerInstance();
  if (isLive && firestore) {
    const snap = await firestore
      .collection('members')
      .where('studioId', '==', studioId.toLowerCase())
      .get();
    return snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => d.data() as StudioMember);
  }
  return Array.from(memoryStore.members.values()).filter(
    (m) => m.studioId.toLowerCase() === studioId.toLowerCase()
  );
}

export async function saveMember(member: StudioMember): Promise<StudioMember> {
  const { isLive, firestore } = getFirestoreServerInstance();
  if (isLive && firestore) {
    await firestore.collection('members').doc(member.id).set(member, { merge: true });
    return member;
  }
  memoryStore.members.set(member.id, member);
  return member;
}

// 5. TASKS
export async function getTasksByOrder(orderId: string): Promise<Task[]> {
  const { isLive, firestore } = getFirestoreServerInstance();
  if (isLive && firestore) {
    const snap = await firestore
      .collection('tasks')
      .where('orderId', '==', orderId)
      .orderBy('sequenceOrder', 'asc')
      .get();
    return snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => d.data() as Task);
  }
  return Array.from(memoryStore.tasks.values())
    .filter((t) => t.orderId === orderId)
    .sort((a, b) => a.sequenceOrder - b.sequenceOrder);
}

export async function saveTasks(tasks: Task[]): Promise<Task[]> {
  const { isLive, firestore } = getFirestoreServerInstance();
  if (isLive && firestore) {
    const batch = firestore.batch();
    tasks.forEach((t) => {
      const ref = firestore.collection('tasks').doc(t.id);
      batch.set(ref, t, { merge: true });
    });
    await batch.commit();
    return tasks;
  }
  tasks.forEach((t) => memoryStore.tasks.set(t.id, t));
  return tasks;
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
  const { isLive, firestore } = getFirestoreServerInstance();
  if (isLive && firestore) {
    const ref = firestore.collection('tasks').doc(taskId);
    await ref.update({ ...updates, updatedAt: new Date().toISOString() });
    const snap = await ref.get();
    return snap.exists ? (snap.data() as Task) : null;
  }
  const existing = memoryStore.tasks.get(taskId);
  if (!existing) return null;
  const updated: Task = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  memoryStore.tasks.set(taskId, updated);
  return updated;
}
