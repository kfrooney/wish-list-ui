import { ChangeEvent, MouseEvent } from "react";

export type ListItemPO = { uuid: string, title?: string, description?: string }
export type ListItemChangeEvent = ChangeEvent & { listItem: ListItemPO };
export type ListItemMouseEvent = MouseEvent<HTMLButtonElement, globalThis.MouseEvent> & { listItem: ListItemPO }

export type ListItemChangeEventHandler = (event: ListItemChangeEvent) => void;
export type ListItemMouseEventHandler = (event: ListItemMouseEvent) => void;

export type ListItemProps = { 
    listItem?: ListItemPO;
    onTitleChange?: ListItemChangeEventHandler;
    onDescriptionChange?: ListItemChangeEventHandler;
    onDelete?: ListItemMouseEventHandler;
}


function ListItem(props: ListItemProps) {
    const li = props.listItem;
    const titleChange = props.onTitleChange;
    const descriptionChange = props.onDescriptionChange;
    const deleteItem = props.onDelete;
    const onTitleChangeInternal = (event: ChangeEvent) => {
        if ((event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) && (titleChange !== undefined) && li) {
            titleChange({ ...event, listItem: li });
        }
    }
    
    const onDescriptionChangeInternal = (event: ChangeEvent) => {
        if ((event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) && (descriptionChange !== undefined) && li) {
            descriptionChange({ ...event, listItem: li });
        }
    }

    const onDeleteInternal = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if (deleteItem !== undefined && li) {
            deleteItem({ ...event, listItem: li });
        }
    }
        

    return !!li ?
        <li >
            <div>
                <input value={li.title} onChange={onTitleChangeInternal}></input><button onClick={onDeleteInternal}>x</button>
            </div>
            <div>
                <textarea value={li.description} onChange={onDescriptionChangeInternal}></textarea>
            </div>
            
        </li> :
        <li></li>;
}

export default ListItem;