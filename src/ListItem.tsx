import { ChangeEvent, DragEvent, MouseEvent } from "react";

export type ListItemPO = { uuid: string, title?: string, description?: string, order?: number }
export type ListItemChangeEvent = ChangeEvent & { listItem: ListItemPO };
export type ListItemMouseEvent = MouseEvent<HTMLButtonElement, globalThis.MouseEvent> & { listItem: ListItemPO }
export type ListItemDragStartEvent = DragEvent<HTMLLIElement> & { listItem: ListItemPO}

export type ListItemChangeEventHandler = (event: ListItemChangeEvent) => void;
export type ListItemMouseEventHandler = (event: ListItemMouseEvent) => void;
export type ListItemDragStartEventHandler = (event: ListItemDragStartEvent) => void;

export type ListItemProps = { 
    listItem?: ListItemPO;
    onTitleChange?: ListItemChangeEventHandler;
    onDescriptionChange?: ListItemChangeEventHandler;
    onDelete?: ListItemMouseEventHandler;
    onDragStart?: ListItemDragStartEventHandler;
}


function ListItem(props: ListItemProps) {
    const li = props.listItem;
    const onTitleChange = props.onTitleChange;
    const onDescriptionChange = props.onDescriptionChange;
    const onDelete = props.onDelete;
    const onDragStart = props.onDragStart;

    const changeTitle = (event: ChangeEvent) => {
        if (onTitleChange !== undefined && li) {
            onTitleChange({ ...event, listItem: li });
        }
    }
    
    const changeDescription = (event: ChangeEvent) => {
        if (onDescriptionChange !== undefined && li) {
            onDescriptionChange({ ...event, listItem: li });
        }
    }

    const deleteItem = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        if (onDelete !== undefined && li) {
            onDelete({ ...event, listItem: li });
        }
    }

    const startDrag = (event: DragEvent<HTMLLIElement>) => {
        if (onDragStart !== undefined && li) {
            onDragStart({...event, listItem: li})
        }
    }

    return !!li ?
        <li draggable onDragStart={startDrag}>
            <div>
                <input value={li.title} onChange={changeTitle}></input><button onClick={deleteItem}>x</button>
            </div>
            <div>
                <textarea value={li.description} onChange={changeDescription}></textarea>
            </div>
            
        </li> :
        <li></li>;
}

export default ListItem;