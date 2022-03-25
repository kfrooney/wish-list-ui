import { getAuth, User } from "firebase/auth";
import { collection, CollectionReference, deleteDoc, doc, DocumentData, DocumentSnapshot, getFirestore, onSnapshot, QuerySnapshot, setDoc, updateDoc } from "firebase/firestore";
import { MouseEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { v4 as uuid } from 'uuid';
import './App.css';
import List, { ListItemChangeEvent, ListItemMouseEvent } from './List';
import { ListItemConverter } from './ListConverter';
import { ListItemPO } from './ListItem';

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

  function updateListItemTitle(event: ListItemChangeEvent) {
    if (event.target instanceof HTMLInputElement) {
      const inputBox = event.target as HTMLInputElement;
      const item = event.listItem;
      if (listItemsRef) {
        const listItemRef = doc<ListItemPO>(listItemsRef, item.uuid);
        updateDoc(listItemRef, { ...event.listItem, title: inputBox.value })
      }
    }
  }

  function updateListItemDescription(event: ListItemChangeEvent) {
    if (event.target instanceof HTMLTextAreaElement) {
      const textArea = event.target as HTMLTextAreaElement;
      const item = event.listItem;
      if (listItemsRef) {
        const listItemRef = doc<ListItemPO>(listItemsRef, item.uuid);
        updateDoc(listItemRef, { ...event.listItem, description: textArea.value })
      }
    }
  }

  function deleteListItem(event: ListItemMouseEvent) {
    const item = event.listItem;
    if (listItemsRef) {
      const listItemRef = doc<ListItemPO>(listItemsRef, item.uuid);
      deleteDoc(listItemRef);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        WISH LIST UI for {props.user?.displayName || 'ANON'}
      </header>
      <main>
        <List listItems={listItemsSnapshot?.docs.map(ds => ds.data())} onTitleChange={updateListItemTitle} onDescriptionChange={updateListItemDescription} onListItemDelete={deleteListItem}></List>
        <button onClick={addListItem}>+</button>
      </main>
      <footer>
        <button onClick={() => signOut(navigate)}>Logout</button>
      </footer>
    </div>
  );
}

export default App;
