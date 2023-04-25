import { getAuth } from "firebase/auth";
import { collection, CollectionReference, deleteDoc, doc, DocumentData, DocumentReference, DocumentSnapshot, getFirestore, onSnapshot, QuerySnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { v4 as uuid } from 'uuid';
import './App.css';
import List from './List';
import { ListItemConverter } from './ListConverter';
import ListItem, { ListItemChangeEvent, ListItemMouseEvent, ListItemPO } from './ListItem';
import { useFirebaseAuth } from "./FirebaseUserContext";


function signOut(navigate: Function) {
  navigate(`/login`);
  getAuth().signOut();
}

// Initialize Firebase
function App() {
  const db = getFirestore();
  const navigate = useNavigate();
  const user = useFirebaseAuth();
  useEffect(() => {
    if (!user) {
      navigate(`/login`);
    }
  });

  const [ownedList, setOwnedList] = useState<DocumentSnapshot<DocumentData> | undefined>();
  useEffect(()=>{
    if (user?.uid) {
      const ownedListRef: DocumentReference<DocumentData> = doc(db, `ownedLists`, user.uid);
      return onSnapshot(ownedListRef, (ownedLists: DocumentSnapshot<DocumentData>) => {
        setOwnedList(ownedLists);
      });
    }
  },[user?.uid, db])

  const [listItemsRef, setListItemsRef] = useState<CollectionReference<ListItemPO> | undefined>();
  const [listItemsSnapshot, setListItemsSnapshot] = useState<QuerySnapshot<ListItemPO> | undefined>();
  useEffect(() => {
    if (user && ownedList && ownedList.exists()) {
      const lir = collection(db, `ownedLists`, user.uid, `items`).withConverter(new ListItemConverter());
      setListItemsRef(lir);
      return onSnapshot(lir, (listItems) => {
        setListItemsSnapshot(listItems);
      });
    }
  }, [user, ownedList, db]);

  function addListItem() {
    if (listItemsRef && user) {
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
        WISH LIST UI for {user?.displayName || 'ANON'}
      </header>
      <main>
        <List>
          {
            listItemsSnapshot?.docs.map(ds => ds.data()).map(li => 
              <ListItem key={li.uuid}
                        listItem={li} 
                        onTitleChange={updateListItemTitle} 
                        onDescriptionChange={updateListItemDescription} 
                        onDelete={deleteListItem} />
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
