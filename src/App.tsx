import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router';
import './App.css';
import { getAuth, User } from "firebase/auth";
import { addDoc, collection, CollectionReference, doc, DocumentData, DocumentSnapshot, getFirestore, onSnapshot, QuerySnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import ListItem, { ListItemPO } from './ListItem';
import List from './List';
import { ListItemConverter } from './ListConverter';

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

  const [listItemsRef, setListItemsRef] = useState<CollectionReference<ListItemPO> | undefined>();
  const [listItemsSnapshot, setListItemsSnapshot] = useState<QuerySnapshot<ListItemPO> | undefined>();
  useEffect(() => {
    if (props.user && ownedListSnapshot && ownedListSnapshot.exists()) {
      const lir = collection(db, `ownedLists`, props.user.uid, `items`).withConverter(new ListItemConverter());
      setListItemsRef(lir);
      return onSnapshot(lir, (listItems) => {
        setListItemsSnapshot(listItems);
      });
    }
  }, [props.user, ownedListSnapshot, db]);

  function addListItem() {
    if (listItemsRef && props.user) {
      const newId = uuid();
      const listItemRef = doc<ListItemPO>(listItemsRef, newId);
      setDoc(listItemRef, { uuid: newId, title: '', description: '' });
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        WISH LIST UI for {props.user?.displayName || 'ANON'}
      </header>
      <main>
        <List listItemsSnapshot={listItemsSnapshot}></List>
        <button onClick={addListItem}>+</button>
      </main>
      <footer>
        <button onClick={() => signOut(navigate)}>Logout</button>
      </footer>
    </div>
  );
}

export default App;
