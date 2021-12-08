import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDi4sGDXqCNs3iEiJdh_Z7xLzGdgSboqeM",
  authDomain: "latihan-firebase-d79df.firebaseapp.com",
  projectId: "latihan-firebase-d79df",
  storageBucket: "latihan-firebase-d79df.appspot.com",
  messagingSenderId: "429109733873",
  appId: "1:429109733873:web:5d210d100b7af42e8e3c50",
};

//init firebase app
initializeApp(firebaseConfig);

//init service
const db = getFirestore();
const auth = getAuth();

//collection ref
const colRef = collection(db, "books");

//real time get collection data
const q = query(colRef, orderBy("createdAt", "asc"));
const unsub = onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((book) => {
    books.push({ ...book.data(), id: book.id });
  });
  console.log(books);
});

//adding documents
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addBookForm.reset();
  });
});

//delete documents
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const docRef = doc(db, "books", deleteBookForm.id.value);
  deleteDoc(docRef).then(() => {
    deleteBookForm.reset();
  });
});

//get a single document
const docRef = doc(db, "books", "Hl1YSYYVEFLr1T3DB4fD");

getDoc(docRef)
  .then((doc) => {
    console.log(doc.data(), doc.id);
  })
  .catch((err) => console.error(err));

//sign up
const signUpForm = document.querySelector(".signup");
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = signUpForm.email.value;
  const password = signUpForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("User created: ", cred.user);
      signUpForm.reset();
    })
    .catch((err) => {
      console.error(err.message);
      signUpForm.reset();
    });
});

//login logout
const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("User logged in :", cred.user);
    })
    .catch((err) => {
      console.error(err.message);
    });
});

const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", (e) => {
  e.preventDefault();
  signOut(auth)
    .then(() => {
      console.log("the user signed out");
    })
    .catch((err) => {
      console.error(err.message);
    });
});

//subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log("user status changed", user);
});

//unsubscribing from changes (auth & db)
//unsubscribe berguna untuk menghilangkan realtime
const unsubButton = document.querySelector(".unsub");
unsubButton.addEventListener("click", () => {
  console.log("unsunscribing");
  unsub();
  unsubAuth();
});
