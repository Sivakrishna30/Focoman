import 'server-only';
import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { Studio, StudioMember, StudioMembership, StudioInvitation, Customer, Order, Task } from '@focoman/types';

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
function parsePrivateKey(rawKey: string | undefined): string | undefined {
  if (!rawKey) return undefined;
  let key = rawKey.trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1).trim();
  }
  return key.replace(/\\n/g, '\n').replace(/\\\\n/g, '\n');
}

export function getFirestoreServerInstance(): Firestore {
  if (firestoreDbInstance) {
    return firestoreDbInstance;
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT;

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_ADMIN_PRIVATE_KEY);

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

export async function updateStudio(studioId: string, updates: Partial<Studio>): Promise<Studio | null> {
  const firestore = getFirestoreServerInstance();
  const ref = firestore.collection('studios').doc(studioId);
  await ref.update({ ...updates, updatedAt: new Date().toISOString() });
  const snap = await ref.get();
  return snap.exists ? (snap.data() as Studio) : null;
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

// 6. INVITATIONS & ONBOARDING
export async function saveInvitation(invitation: StudioInvitation): Promise<StudioInvitation> {
  const firestore = getFirestoreServerInstance();
  await firestore.collection('invitations').doc(invitation.id).set(invitation, { merge: true });
  return invitation;
}

export async function getInvitationByCode(code: string): Promise<StudioInvitation | null> {
  const cleanCode = code.trim().toUpperCase();
  const firestore = getFirestoreServerInstance();
  const doc = await firestore.collection('invitations').doc(cleanCode).get();
  if (doc.exists) {
    return doc.data() as StudioInvitation;
  }
  return null;
}

export async function getInvitationsByStudio(studioId: string): Promise<StudioInvitation[]> {
  const firestore = getFirestoreServerInstance();
  const snap = await firestore
    .collection('invitations')
    .where('studioId', '==', studioId.toLowerCase())
    .get();
  return snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => d.data() as StudioInvitation);
}

export async function acceptInvitationTransaction(input: {
  code: string;
  uid: string;
  userEmail: string;
  userName?: string;
}): Promise<{
  success: boolean;
  membership?: StudioMembership;
  studioId?: string;
  studioName?: string;
  error?: string;
}> {
  const firestore = getFirestoreServerInstance();
  const cleanCode = input.code.trim().toUpperCase();

  try {
    const result = await firestore.runTransaction(async (transaction) => {
      const inviteRef = firestore.collection('invitations').doc(cleanCode);
      const inviteDoc = await transaction.get(inviteRef);

      if (!inviteDoc.exists) {
        throw new Error(`Invitation code "${cleanCode}" was not found.`);
      }

      const invitation = inviteDoc.data() as StudioInvitation;

      if (invitation.status !== 'PENDING') {
        throw new Error(
          invitation.status === 'ACCEPTED'
            ? 'This invitation has already been accepted.'
            : 'This invitation is no longer valid or has expired.'
        );
      }

      // Check email match if an invited email was specified
      if (invitation.email && invitation.email.trim()) {
        const invitedEmail = invitation.email.trim().toLowerCase();
        const authedEmail = input.userEmail.trim().toLowerCase();
        if (invitedEmail !== authedEmail) {
          throw new Error(
            `This invitation was issued to ${invitation.email}. Please sign in with that Google account.`
          );
        }
      }

      const now = new Date().toISOString();
      const studioId = invitation.studioId.toLowerCase();
      const membershipId = `${studioId}_${input.uid}`;
      const membershipRef = firestore.collection('memberships').doc(membershipId);

      const membership: StudioMembership = {
        id: membershipId,
        studioId,
        studioName: invitation.studioName,
        uid: input.uid,
        role: invitation.role || 'STUDIO_MEMBER',
        skills: invitation.skills || [],
        status: 'ACTIVE',
        joinedAt: now,
        updatedAt: now,
      };

      // 1. Mark invitation as accepted
      transaction.update(inviteRef, {
        status: 'ACCEPTED',
        acceptedAt: now,
        acceptedByUid: input.uid,
      });

      // 2. Set active membership
      transaction.set(membershipRef, membership, { merge: true });

      // 3. Upsert member record in /members so they appear in studio roster
      const memberQuery = await firestore
        .collection('members')
        .where('studioId', '==', studioId)
        .where('email', '==', input.userEmail.toLowerCase())
        .limit(1)
        .get();

      if (!memberQuery.empty) {
        const existingMemberRef = memberQuery.docs[0].ref;
        transaction.update(existingMemberRef, {
          name: input.userName || (memberQuery.docs[0].data() as StudioMember).name,
          updatedAt: now,
        });
      } else {
        const memberRef = firestore.collection('members').doc();
        const newMember: StudioMember = {
          id: memberRef.id,
          studioId,
          name: input.userName || invitation.name || input.userEmail.split('@')[0],
          email: input.userEmail.toLowerCase(),
          skills: invitation.skills || [],
          createdAt: now,
          updatedAt: now,
        };
        transaction.set(memberRef, newMember);
      }

      return { membership, studioId, studioName: invitation.studioName };
    });

    return {
      success: true,
      membership: result.membership,
      studioId: result.studioId,
      studioName: result.studioName,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to accept invitation.',
    };
  }
}

// ------------------------------------------------------------------
// Studio Marketplace Profile Actions (Phase 2)
// ------------------------------------------------------------------

import { MarketplaceProfile } from '@focoman/types';

export async function getMarketplaceProfile(studioId: string): Promise<MarketplaceProfile | null> {
  const db = getFirestoreServerInstance();
  const doc = await db.collection('marketplace_profiles').doc(studioId).get();
  if (!doc.exists) return null;
  return doc.data() as MarketplaceProfile;
}

export async function getMarketplaceProfileBySlug(slug: string): Promise<MarketplaceProfile | null> {
  const db = getFirestoreServerInstance();
  const snapshot = await db.collection('marketplace_profiles').where('slug', '==', slug).where('isVisible', '==', true).limit(1).get();
  if (snapshot.empty) return null;
  return snapshot.docs[0].data() as MarketplaceProfile;
}

export async function upsertMarketplaceProfile(
  studioId: string,
  profileData: Partial<Omit<MarketplaceProfile, 'id' | 'studioId' | 'verifiedMetrics' | 'createdAt' | 'updatedAt'>>
): Promise<MarketplaceProfile> {
  const db = getFirestoreServerInstance();
  const docRef = db.collection('marketplace_profiles').doc(studioId);
  
  return db.runTransaction(async (transaction) => {
    const doc = await transaction.get(docRef);
    const now = new Date().toISOString();
    
    if (doc.exists) {
      const existing = doc.data() as MarketplaceProfile;
      const updated: MarketplaceProfile = {
        ...existing,
        ...profileData,
        updatedAt: now,
      };
      transaction.update(docRef, { ...updated });
      return updated;
    } else {
      // Fetch studio to get the correct slug
      const studioDoc = await transaction.get(db.collection('studios').doc(studioId));
      if (!studioDoc.exists) throw new Error('Studio not found');
      const studioData = studioDoc.data() as Studio;

      const newProfile: MarketplaceProfile = {
        id: studioId,
        studioId,
        name: profileData.name || studioData.name,
        slug: studioData.id, // we use studio id as slug for now, or you can add slug to studio
        city: profileData.city || studioData.city,
        description: profileData.description || '',
        tags: profileData.tags || [],
        coverImageUrl: profileData.coverImageUrl || '',
        isVisible: profileData.isVisible ?? false,
        verifiedMetrics: {
          onTimeDeliveryPercentage: 100, // Initial safe default
          completedOrdersCount: 0,
          lastCalculatedAt: now,
        },
        createdAt: now,
        updatedAt: now,
      };
      transaction.set(docRef, newProfile);
      return newProfile;
    }
  });
}

export async function searchMarketplaceProfiles(
  filters: { city?: string; tags?: string[] },
  limitCount = 20
): Promise<MarketplaceProfile[]> {
  const db = getFirestoreServerInstance();
  let query: FirebaseFirestore.Query = db.collection('marketplace_profiles').where('isVisible', '==', true);
  
  if (filters.city) {
    // Simple exact match for city
    query = query.where('city', '==', filters.city);
  }
  
  if (filters.tags && filters.tags.length > 0) {
    query = query.where('tags', 'array-contains-any', filters.tags);
  }
  
  const snapshot = await query.limit(limitCount).get();
  return snapshot.docs.map(doc => doc.data() as MarketplaceProfile);
}
