import dock_styles from './dock.module.css'
import React, { ReactNode, useEffect, useRef } from "react";

interface DockPropTypes {
    wrapperClass?: string;
    children: ReactNode[];
}

export const DOCK_START_PAGE = "manabi-dock-wrapper-start";
export const DOCK_GLOBAL = "manabi-dock-wrapper-global";

export default function DockContainer({wrapperClass = DOCK_GLOBAL, children}: DockPropTypes) {

    const dockRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const element = dockRef.current;
        if (!element) {
            return;
        }
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            element.scrollLeft += e.deltaY * 1.5;
        };
        element.addEventListener("wheel", onWheel, { passive: false });
        return () => {
            element.removeEventListener("wheel", onWheel);
        };
    }, []);

    return (
        <div className={dock_styles[wrapperClass]}>
            <div  ref={dockRef} className={dock_styles['manabi-dock-base']}>
                {children}
            </div>
        </div>
    );
}