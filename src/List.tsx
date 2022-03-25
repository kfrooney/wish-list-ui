import { ChangeEvent, MouseEvent } from "react";
import ListItem, { ListItemPO } from "./ListItem";

export type ListItemChangeEvent = ChangeEvent & { listItem: ListItemPO };
export type ListItemMouseEvent = MouseEvent<HTMLButtonElement, globalThis.MouseEvent> & { listItem: ListItemPO }
export type ListItemChangeEventHandler = (event: ListItemChangeEvent) => void;
export type ListItemMouseEventHandler = (event: ListItemMouseEvent) => void;
export type ListProps = { listItems?: ListItemPO[]; onTitleChange?: ListItemChangeEventHandler; onDescriptionChange?: ListItemChangeEventHandler; onListItemDelete?: ListItemMouseEventHandler }

function updateListItem(item: ListItemPO, handler?: ListItemChangeEventHandler) {
    return (event: ChangeEvent) => {
        if ((event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) && handler !== undefined) {
            handler({ ...event, listItem: item });
        }
    };
}

function deleteListItem(item: ListItemPO, handler?: ListItemMouseEventHandler) {
    return (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if (handler !== undefined) {
            handler({ ...event, listItem: item });
        }
    };
}

function List(props: ListProps) {
    return <ol> {
        !!props.listItems
            ? props.listItems.map(item =>
                <ListItem listItem={item} onTitleChange={updateListItem(item, props.onTitleChange)} onDescriptionChange={updateListItem(item, props.onDescriptionChange)} onDelete={deleteListItem(item, props.onListItemDelete)}></ListItem>
            )
            : <div>No list items yet!</div>
    } </ol>
}

export default List;