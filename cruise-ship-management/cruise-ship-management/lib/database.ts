// Database operations and models
import { db } from "./firebase"
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  Timestamp,
  CollectionReference,
  Query,
  DocumentData,
} from "firebase/firestore"

// Menu items operations
export const getMenuItems = async (category?: string) => {
  try {
    let q: Query<DocumentData> | CollectionReference<DocumentData> = collection(db, "menuItems")

    if (category) {
      q = query(collection(db, "menuItems"), where("category", "==", category))
    }

    const querySnapshot = await getDocs(q)
    const items: any[] = []

    querySnapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() })
    })

    return items
  } catch (error) {
    console.error("Error getting menu items:", error)
    throw error
  }
}

// Orders operations
export const getOrders = async (userId?: string, role?: string) => {
  try {
    let q: Query<DocumentData> | CollectionReference<DocumentData> = collection(db, "orders")

    if (userId && role === "voyager") {
      q = query(collection(db, "orders"), where("userId", "==", userId))
    }

    const querySnapshot = await getDocs(q)
    const orders: any[] = []

    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() })
    })

    return orders
  } catch (error) {
    console.error("Error getting orders:", error)
    throw error
  }
}

// Bookings operations
export const getBookings = async (userId?: string, type?: string) => {
  try {
    let q: Query<DocumentData> | CollectionReference<DocumentData> = collection(db, "bookings")

    if (userId) {
      q = query(collection(db, "bookings"), where("userId", "==", userId))
    }

    if (type) {
      q = query(q as Query<DocumentData>, where("type", "==", type))
    }

    const querySnapshot = await getDocs(q)
    const bookings: any[] = []

    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() })
    })

    return bookings
  } catch (error) {
    console.error("Error getting bookings:", error)
    throw error
  }
}

// Rest of the functions remain the same...
export const createUser = async (userData: any) => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      ...userData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export const getUser = async (userId: string) => {
  try {
    const docRef = doc(db, "users", userId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting user:", error)
    throw error
  }
}

export const createMenuItem = async (itemData: any) => {
  try {
    const docRef = await addDoc(collection(db, "menuItems"), {
      ...itemData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating menu item:", error)
    throw error
  }
}

export const createOrder = async (orderData: any) => {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      status: "pending",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export const createBooking = async (bookingData: any) => {
  try {
    const docRef = await addDoc(collection(db, "bookings"), {
      ...bookingData,
      status: "confirmed",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating booking:", error)
    throw error
  }
}

export const updateDocument = async (collection_name: string, docId: string, updateData: any) => {
  try {
    const docRef = doc(db, collection_name, docId)
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error updating document:", error)
    throw error
  }
}

export const deleteDocument = async (collection_name: string, docId: string) => {
  try {
    const docRef = doc(db, collection_name, docId)
    await deleteDoc(docRef)
  } catch (error) {
    console.error("Error deleting document:", error)
    throw error
  }
}