import { PropsWithChildren } from "react";

export const Header = (props: PropsWithChildren) => {
    return (
        <h1 className="flex col-span-2 bg-blue-500 p-4 h-14">{props.children}</h1>
    );
}