import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

// Add a reservation
export const addReservation = async (reservationData) => {
  if (!db) {
    console.warn("Mock: Reservation saved", reservationData);
    return { id: 'mock-id-' + Date.now(), ...reservationData };
  }
  
  try {
    const docRef = await addDoc(collection(db, 'reservations'), {
      ...reservationData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...reservationData };
  } catch (error) {
    console.error("Error adding reservation: ", error);
    throw error;
  }
};

// Get all reservations (for Admin)
export const getReservations = async () => {
  if (!db) {
    return [
      { id: '1', name: 'John Doe', email: 'john@example.com', date: '2026-05-10', time: '18:00', partySize: 2, status: 'pending' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', date: '2026-05-11', time: '12:30', partySize: 4, status: 'confirmed' }
    ];
  }
  
  try {
    const q = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const reservations = [];
    querySnapshot.forEach((doc) => {
      reservations.push({ id: doc.id, ...doc.data() });
    });
    return reservations;
  } catch (error) {
    console.error("Error getting reservations: ", error);
    throw error;
  }
};

// Add a contact message
export const addMessage = async (messageData) => {
  if (!db) {
    console.warn("Mock: Message saved", messageData);
    return { id: 'mock-msg-' + Date.now(), ...messageData };
  }
  
  try {
    const docRef = await addDoc(collection(db, 'messages'), {
      ...messageData,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...messageData };
  } catch (error) {
    console.error("Error adding message: ", error);
    throw error;
  }
};

// Get all messages (for Admin)
export const getMessages = async () => {
  if (!db) {
    return [
      { id: '1', name: 'Alice Brown', email: 'alice@example.com', message: 'Do you offer vegan options?', createdAt: new Date() }
    ];
  }
  
  try {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    return messages;
  } catch (error) {
    console.error("Error getting messages: ", error);
    throw error;
  }
};
