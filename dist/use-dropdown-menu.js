"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function useDropdownMenu(itemCount, options) {
    const [isOpen, setIsOpen] = react_1.useState(false);
    const currentFocusIndex = react_1.useRef(null);
    const firstRun = react_1.useRef(true);
    const clickedOpen = react_1.useRef(false);
    const buttonRef = react_1.useRef(null);
    const itemRefs = react_1.useMemo(() => Array.from({ length: itemCount }, () => react_1.createRef()), [itemCount]);
    const isKeyboardEvent = (e) => e.key !== undefined;
    const moveFocus = react_1.useCallback((itemIndex) => {
        var _a;
        if (itemRefs[itemIndex]) {
            currentFocusIndex.current = itemIndex;
            (_a = itemRefs[itemIndex].current) === null || _a === void 0 ? void 0 : _a.focus();
        }
    }, [itemRefs]);
    react_1.useEffect(() => {
        if (firstRun.current) {
            firstRun.current = false;
            return;
        }
        if (isOpen && !(options === null || options === void 0 ? void 0 : options.disableFocusFirstItemOnClick)) {
            moveFocus(0);
        }
        else if (!isOpen) {
            clickedOpen.current = false;
        }
    }, [isOpen, moveFocus, options === null || options === void 0 ? void 0 : options.disableFocusFirstItemOnClick]);
    react_1.useEffect(() => {
        if (!isOpen) {
            return;
        }
        const removalTracker = {
            removed: false,
        };
        const handleEveryClick = (event) => {
            setTimeout(() => {
                if (!(event.target instanceof Element)) {
                    return;
                }
                if (event.target.closest('[role="menu"]') instanceof Element) {
                    return;
                }
                setIsOpen(false);
            }, 10);
        };
        setTimeout(() => {
            if (removalTracker.removed) {
                return;
            }
            document.addEventListener('click', handleEveryClick);
        }, 1);
        return () => {
            removalTracker.removed = true;
            document.removeEventListener('click', handleEveryClick);
        };
    }, [isOpen]);
    react_1.useEffect(() => {
        const disableArrowScroll = (event) => {
            if (isOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
                event.preventDefault();
            }
        };
        document.addEventListener('keydown', disableArrowScroll);
        return () => document.removeEventListener('keydown', disableArrowScroll);
    }, [isOpen]);
    const buttonListener = (e) => {
        if (isKeyboardEvent(e)) {
            const { key } = e;
            if (!['Enter', ' ', 'Tab', 'ArrowDown', 'Escape'].includes(key)) {
                return;
            }
            if ((key === 'Tab' || key === 'ArrowDown') && clickedOpen.current && isOpen) {
                e.preventDefault();
                moveFocus(0);
            }
            if (key === 'Enter' || key === ' ') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (key === 'Escape') {
                e.preventDefault();
                setIsOpen(false);
            }
        }
        else {
            if (options === null || options === void 0 ? void 0 : options.disableFocusFirstItemOnClick) {
                clickedOpen.current = !isOpen;
            }
            setIsOpen(!isOpen);
        }
    };
    const itemListener = (e) => {
        var _a;
        const { key } = e;
        if (['Tab', 'Shift', 'Enter', 'Escape', 'ArrowUp', 'ArrowDown', ' '].includes(key)) {
            let newFocusIndex = currentFocusIndex.current;
            if (key === 'Escape') {
                setIsOpen(false);
                (_a = buttonRef.current) === null || _a === void 0 ? void 0 : _a.focus();
                return;
            }
            if (key === 'Tab') {
                setIsOpen(false);
                return;
            }
            if (key === 'Enter' || key === ' ') {
                if (options === null || options === void 0 ? void 0 : options.handleItemKeyboardSelect) {
                    options.handleItemKeyboardSelect(e);
                }
                else if (e.currentTarget instanceof HTMLAnchorElement && !e.currentTarget.href) {
                    e.currentTarget.click();
                }
                setIsOpen(false);
                return;
            }
            if (newFocusIndex !== null) {
                if (key === 'ArrowUp') {
                    newFocusIndex -= 1;
                }
                else if (key === 'ArrowDown') {
                    newFocusIndex += 1;
                }
                if (newFocusIndex > itemRefs.length - 1) {
                    newFocusIndex = 0;
                }
                else if (newFocusIndex < 0) {
                    newFocusIndex = itemRefs.length - 1;
                }
            }
            if (newFocusIndex !== null) {
                moveFocus(newFocusIndex);
            }
            return;
        }
        if (/[a-zA-Z0-9./<>?;:"'`!@#$%^&*()\\[\]{}_+=|\\-~,]/.test(key)) {
            const index = itemRefs.findIndex((ref) => {
                var _a, _b, _c, _d, _e, _f;
                return ((_b = (_a = ref.current) === null || _a === void 0 ? void 0 : _a.innerText) === null || _b === void 0 ? void 0 : _b.toLowerCase().startsWith(key.toLowerCase())) ||
                    ((_d = (_c = ref.current) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.toLowerCase().startsWith(key.toLowerCase())) ||
                    ((_f = (_e = ref.current) === null || _e === void 0 ? void 0 : _e.getAttribute('aria-label')) === null || _f === void 0 ? void 0 : _f.toLowerCase().startsWith(key.toLowerCase()));
            });
            if (index !== -1) {
                moveFocus(index);
            }
        }
    };
    const buttonProps = {
        onKeyDown: buttonListener,
        onClick: buttonListener,
        tabIndex: 0,
        ref: buttonRef,
        role: 'button',
        'aria-haspopup': true,
        'aria-expanded': isOpen,
    };
    const itemProps = Array.from({ length: itemCount }, (_ignore, index) => ({
        onKeyDown: itemListener,
        tabIndex: -1,
        role: 'menuitem',
        ref: itemRefs[index],
    }));
    return { buttonProps, itemProps, isOpen, setIsOpen, moveFocus };
}
exports.default = useDropdownMenu;