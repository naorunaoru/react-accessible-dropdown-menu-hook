import React from 'react';
interface ButtonProps<ButtonElement extends HTMLElement> extends Pick<React.DetailedHTMLProps<React.HTMLAttributes<ButtonElement>, ButtonElement>, 'onKeyDown' | 'onClick' | 'tabIndex' | 'role' | 'aria-haspopup' | 'aria-expanded'> {
    ref: React.RefObject<HTMLButtonElement>;
}
export interface DropdownMenuOptions {
    disableFocusFirstItemOnClick?: boolean;
    handleItemKeyboardSelect?<T extends React.KeyboardEvent<HTMLElement>>(event: T): void;
}
interface DropdownMenuResponse<ButtonElement extends HTMLElement> {
    readonly buttonProps: ButtonProps<HTMLButtonElement>;
    readonly itemProps: {
        onKeyDown: (e: React.KeyboardEvent<ButtonElement>) => void;
        tabIndex: number;
        role: string;
        ref: React.RefObject<ButtonElement>;
    }[];
    readonly isOpen: boolean;
    readonly setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    readonly moveFocus: (itemIndex: number) => void;
}
export default function useDropdownMenu<OptionElement extends HTMLElement = HTMLButtonElement>(itemCount: number, options?: DropdownMenuOptions): DropdownMenuResponse<OptionElement>;
export {};
