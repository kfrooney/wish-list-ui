import { ChangeEventHandler, MouseEventHandler } from "react";

export type ListItemPO = { uuid: string, title?: string, description?: string }
export type ListItemProps = { listItem?: ListItemPO; onTitleChange?: ChangeEventHandler; onDescriptionChange?: ChangeEventHandler ; onDelete?: MouseEventHandler<HTMLButtonElement>}
// Initialize Firebase
function ListItem(props: ListItemProps) {
    const li = props.listItem;
    return !!li ?
        <li key={li.uuid}>
            <div>
                <input value={li.title} onChange={props.onTitleChange}></input><button onClick={props.onDelete}>x</button>
            </div>
            <div>
                <textarea value={li.description} onChange={props.onDescriptionChange}></textarea>
            </div>
            
        </li> :
        <li></li>;
}

export default ListItem;