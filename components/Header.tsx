import { PropsWithChildren } from "react";

export const Header = (props: PropsWithChildren) => {
    return (
        <div className="flex h-12">{props.children}</div>
    );
}