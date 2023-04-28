import { DocumentData, FirestoreDataConverter, PartialWithFieldValue, QueryDocumentSnapshot, SetOptions, SnapshotOptions, WithFieldValue } from "firebase/firestore";
import { ListItemPO } from "./ListItem";

export class ListItemConverter implements FirestoreDataConverter<ListItemPO> {
    toFirestore(modelObject: WithFieldValue<ListItemPO>): DocumentData;
    toFirestore(modelObject: PartialWithFieldValue<ListItemPO>, options: SetOptions): DocumentData;
    toFirestore(modelObject: ListItemPO, options?: any): DocumentData {
        return { title: modelObject.title, description: modelObject.description }
    }
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions): ListItemPO {
        const docData = snapshot.data();
        return { ...docData, uuid: snapshot.id };
    }
}