import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

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

//collection ref
const colRef = collection(db, "books");

//real time get collection data
const q = query(colRef, where("author", "==", "brandon sanderson"));
onSnapshot(q, (snapshot) => {
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
