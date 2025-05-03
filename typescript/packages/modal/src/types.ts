import { CSSProperties, ReactNode } from "react";

export type ModalDisplayProps = {
    id: string;
    content: ReactNode;
    style?: CSSProperties;
}