import { DocumentData, FirestoreDataConverter, PartialWithFieldValue, QueryDocumentSnapshot, SetOptions, SnapshotOptions, WithFieldValue } from "firebase/firestore";
import { UserPO } from "./User";

export class UserConverter implements FirestoreDataConverter<UserPO> {
    isFullType(x: Partial<UserPO>): x is UserPO {
        return !!x.displayName;
    } 

    toFirestore(modelObject: WithFieldValue<UserPO>): DocumentData;
    toFirestore(modelObject: PartialWithFieldValue<UserPO>, options: SetOptions): DocumentData;
    toFirestore(modelObject: UserPO, options?: any): DocumentData {
        return { displayName: modelObject.displayName }
    }
    fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>, options?: SnapshotOptions): UserPO {
        const docData: Partial<UserPO> = snapshot.data();
        if (this.isFullType(docData)) {
            return { ...docData, uuid: snapshot.id };
        } else {
            return { displayName: '?', uuid: snapshot.id}
        }
    }
}