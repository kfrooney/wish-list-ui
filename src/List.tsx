import { QueryDocumentSnapshot, QuerySnapshot, updateDoc } from "firebase/firestore";
import { ChangeEvent } from "react";
import ListItem, { ListItemPO } from "./ListItem";

export type ListProps = { listItemsSnapshot?: QuerySnapshot<ListItemPO> }

function updateListItemTitle(snap: QueryDocumentSnapshot<ListItemPO>) {
    return (event: ChangeEvent) => {
        if (event.target instanceof HTMLInputElement) {
            const inputBox = event.target as HTMLInputElement;
            updateDoc(snap.ref, { ...snap.data(), title: inputBox.value })
        }
    };
}

function updateListItemDescription(snap: QueryDocumentSnapshot<ListItemPO>) {
    return (event: ChangeEvent) => {
        if (event.target instanceof HTMLTextAreaElement) {
            const textArea = event.target as HTMLTextAreaElement;
            updateDoc(snap.ref, { ...snap.data(), description: textArea.value });
        }
    };
}

// Initialize Firebase
function List(props: ListProps) {
    return <ol> {
        !!props.listItemsSnapshot
            ? props.listItemsSnapshot.docs.map(snap =>
                <ListItem listItem={snap.data()} onTitleChange={updateListItemTitle(snap)} onDescriptionChange={updateListItemDescription(snap)}></ListItem>
            )
            : <div>No list items yet!</div>
    } </ol>
}

export default List;