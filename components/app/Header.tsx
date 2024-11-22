import { PropsWithChildren } from "react";

export const Header = (props: PropsWithChildren) => {
    return (
        <div className="flex">{props.children}</div>
    );
}