import { ReactNode } from "react";


function List({children}: {children: ReactNode}) {
    return <ol>{children}</ol>
}

export default List;