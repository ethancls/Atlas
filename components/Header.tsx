import { PropsWithChildren } from "react";

export const Header = (props: PropsWithChildren) => {
    return (
        <div className="flex h-14">{props.children}</div>
    );
}