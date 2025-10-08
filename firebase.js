import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, push } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCgS8NgKrSQ8KQnU5SNjUMoU9l2bO3ySvA",
  authDomain: "shopez-56f1a.firebaseapp.com",
  databaseURL: "https://shopez-56f1a-default-rtdb.firebaseio.com",
  projectId: "shopez-56f1a",
  storageBucket: "shopez-56f1a.appspot.com",
  messagingSenderId: "813301733461",
  appId: "1:813301733461:web:ce01224fafdc194733dcdc"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);

export const storeItem = async (path, data) => {
  try {
    const itemRef = push(ref(db, path));
    await set(itemRef, data);
    console.log("Item stored successfully!");
  } catch (error) {
    console.error("Error storing item:", error);
  }
};
