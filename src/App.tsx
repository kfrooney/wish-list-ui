import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router';
import './App.css';
import { getAuth, User } from "firebase/auth";
import { addDoc, collection, CollectionReference, doc, DocumentData, DocumentSnapshot, getFirestore, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { useEffect, useState } from 'react';
import ListItem from './ListItem';

export type AppProps = { user?: User | null }

function signOut(navigate: Function) {
  navigate(`/login`);
  getAuth().signOut();
}

// Initialize Firebase
function App(props: AppProps) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!props.user) {
      navigate(`/login`);
    }
  }, [props.user, navigate]);

  const db = getFirestore();

  const [ownedListSnapshot, setOwnedListSnapshot] = useState<DocumentSnapshot<DocumentData> | undefined>();
  useEffect(() => {
    if (props.user?.uid) {
      return onSnapshot(doc(db, `ownedLists`, props.user.uid), (ownedLists: DocumentSnapshot<DocumentData>) => {
        console.log(`setting ownedListSnapshot`, ownedListSnapshot);
        setOwnedListSnapshot(ownedLists);
        console.log(`finished setting ownedListSnapshot`, ownedListSnapshot);
      });
    }
  }, [props.user, db]);



  // const [ownedList, setOwnedList] = useState<DocumentData | undefined>();
  // useEffect(() => {
  //   async function unwrapSnapshot() {
  //     if (props.user?.uid && ownedListRef && ownedListSnapshot) {
  //       if (ownedListSnapshot && ownedListSnapshot.exists()) {
  //         setOwnedList(ownedListSnapshot.data());
  //       } else {
  //         const list = { displayName: props.user.displayName };
  //         setOwnedList(list);
  //         setDoc(ownedListRef, list);
  //       }
  //     }
  //   }
  //   unwrapSnapshot();
  // }, [props.user, ownedListRef, ownedListSnapshot]);

  const [listItemsRef, setListItemsRef] = useState<CollectionReference<DocumentData> | undefined>();
  const [listItemsSnapshot, setListItemsSnapshot] = useState<QuerySnapshot<DocumentData> | undefined>();
  useEffect(() => {
    console.log(`setting listItemsSnapshot here is the ownedListSnapshot`, ownedListSnapshot);
    if (props.user && ownedListSnapshot && ownedListSnapshot.exists()) {
      console.log(`setting listItemsSnapshot, user and ownedListSnapshot exists!`);
      const lir = collection(db, `ownedLists`, props.user.uid, `items`)
      setListItemsRef(lir);
      return onSnapshot(lir, (listItems: QuerySnapshot<DocumentData>) => {
        setListItemsSnapshot(listItems);
      });
    }
  }, [props.user, ownedListSnapshot, db]);

  function addListItem() {
    // async function addDocAndUpdateListItemsSnapshot() {
      if (listItemsRef) {
        addDoc(listItemsRef, { uuid: uuid(), title: '', description: '' });
      }

    // }
    // addDocAndUpdateListItemsSnapshot();
  }
  console.log(`listItemsSnapshot is ${listItemsSnapshot}`);
  listItemsSnapshot?.docs.map(snap => console.log(`here's a snapshot ${snap.data()}`));
  return (
    <div className="App">
      <header className="App-header">
        WISH LIST UI for {props.user?.displayName || 'ANON'}
      </header>
      <main>
        <ol>
          {listItemsSnapshot?.docs.map(snap => <ListItem documentSnapshot={snap}></ListItem>)}
        </ol>
        <button onClick={addListItem}>+</button>
      </main>
      <footer>
        <button onClick={() => signOut(navigate)}>Logout</button>
      </footer>
    </div>
  );
}

export default App;
