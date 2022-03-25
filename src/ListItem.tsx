import { DocumentData, DocumentReference, QueryDocumentSnapshot, updateDoc } from "firebase/firestore";
import { ChangeEvent } from "react";

export type ListItemProps = { documentSnapshot?: QueryDocumentSnapshot<DocumentData> }

function updateListItem(item: DocumentData, ref: DocumentReference) {
    updateDoc(ref, item);
}

function itemTitleValueChanged(snap: QueryDocumentSnapshot<DocumentData>) {
    return (event: ChangeEvent) => {
        const inputBox = event.target as HTMLInputElement;
        updateListItem({ ...snap.data(), title: inputBox.value }, snap.ref)
    };
}

function itemDescriptionValueChanged(snap: QueryDocumentSnapshot<DocumentData>) {
    return (event: ChangeEvent) => {
        const textArea = event.target as HTMLTextAreaElement;
        updateListItem({ ...snap.data(), description: textArea.value }, snap.ref)
    };
}
// Initialize Firebase
function ListItem(props: ListItemProps) {
    const snap = props.documentSnapshot;
    return !!snap ?
        <li key={snap.data().uuid}>
            <div>
                <input value={snap.data().title} onChange={itemTitleValueChanged(snap)}></input>
            </div>
            <div>
                <textarea value={snap.data().description} onChange={itemDescriptionValueChanged(snap)}></textarea>
            </div>
        </li> :
        <li></li>;
}

export default ListItem;