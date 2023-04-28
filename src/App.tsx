import { getAuth } from "firebase/auth";
import { collection, CollectionReference, deleteDoc, doc, DocumentData, DocumentReference, DocumentSnapshot, getFirestore, onSnapshot, QuerySnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { v4 as uuid } from 'uuid';
import './App.css';
import List from './List';
import { ListItemConverter } from './ListConverter';
import ListItem, { ListItemChangeEvent, ListItemDragStartEvent, ListItemMouseEvent, ListItemPO } from './ListItem';
import { useFirebaseAuth } from "./FirebaseUserContext";
import { UserConverter } from "./UserConverter";
import { UserPO } from "./User";


function signOut(navigate: Function) {
  navigate(`/login`);
  getAuth().signOut();
}

// Initialize Firebase
function App() {
  const db = getFirestore();
  const navigate = useNavigate();
  const firebaseUser = useFirebaseAuth();
  useEffect(() => {
    if (!firebaseUser) {
      navigate(`/login`);
    }
  });

  const [user, setUser] = useState<UserPO | undefined>()
  useEffect(()=>{
    if (firebaseUser?.uid) {
      const userRef: DocumentReference<UserPO> = doc(db, `users`, firebaseUser.uid).withConverter(new UserConverter());
      return onSnapshot(userRef, (user: DocumentSnapshot<UserPO>) => {
        setUser(user.data());
      });
    }
  },[firebaseUser?.uid, db])

  const [ownedLists, setOwnedLists] = useState<QuerySnapshot<DocumentData> | undefined>();
  useEffect(()=>{
    if (user?.uuid) {
      const ownedListRef: CollectionReference<DocumentData> = collection(db, `users`, user.uuid, `ownedLists`);
      return onSnapshot(ownedListRef, (ownedLists: QuerySnapshot<DocumentData>) => {
        setOwnedLists(ownedLists);
      });
    }
  },[user, db])

  const [listItemsRef, setListItemsRef] = useState<CollectionReference<ListItemPO> | undefined>();
  const [listItemsSnapshot, setListItemsSnapshot] = useState<QuerySnapshot<ListItemPO> | undefined>();
  useEffect(() => {
    if (firebaseUser && ownedList && ownedList.exists()) {
      const lir = collection(db, `ownedLists`, firebaseUser.uid, `items`).withConverter(new ListItemConverter());
      setListItemsRef(lir);
      return onSnapshot(lir, (listItems) => {
        setListItemsSnapshot(listItems);
      });
    }
  }, [firebaseUser, ownedList, db]);

  function addListItem() {
    if (listItemsRef && firebaseUser) {
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

  function startDraggingListItem(event: ListItemDragStartEvent) {
    console.log(`What a drag!`, event.listItem)
  }

  return (
    <div className="App">
      <header className="App-header">
        WISH LIST UI for {firebaseUser?.displayName || 'ANON'}
      </header>
      <main>
        <List>
          {
            listItemsSnapshot?.docs
              .map(ds => ds.data())
              .sort((a, b) => 0)
              .map(li => 
                <ListItem key={li.uuid}
                          listItem={li} 
                          onTitleChange={updateListItemTitle} 
                          onDescriptionChange={updateListItemDescription} 
                          onDelete={deleteListItem}
                          onDragStart={startDraggingListItem} />
              )
          }
        </List>
        <button onClick={addListItem}>+</button>
      </main>
      <footer>
        <button onClick={() => signOut(navigate)}>Logout</button>
      </footer>
    </div>
  );
}

export default App;
