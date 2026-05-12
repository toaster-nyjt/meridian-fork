import { useRef, useEffect } from 'react';
import { FetchedItemType } from "../spec/spec.internal";
import { filterItemAttributes } from "../renderer/renderer.filter";
import { useODI } from "../store/odi.store";


export function useTrackUserConfig(timeRef : any) {
    const { odi, activeOverview } = useODI();

    const getOdiSnapshot = () => {
        const elapsed = Date.now() - timeRef.current;
        timeRef.current = Date.now();

        const activeOv = odi?.overviews.find((o: any) => o.id === activeOverview) as any;
        const items = activeOv?.items as FetchedItemType[] | undefined;
        const filteredItems = items
            ? filterItemAttributes(items, activeOv?.shownAttributes, activeOv?.hiddenAttributes, activeOv?.id ?? '')
            : [];

        const visibleAttributeIds = filteredItems[0]?.attributes
            .filter(Boolean)
            .map((a: any) => a.id);

        return {
            overviewId: activeOv?.id, 
            overviewType: activeOv?.type,
            itemType: activeOv?.itemView?.type,
            enabledInfo: visibleAttributeIds,
            timeSpentOnConfig: elapsed
        };
    };

    const ovRef = useRef(activeOverview);
    if (ovRef.current !== activeOverview) {
        ovRef.current = activeOverview;
        console.log(getOdiSnapshot());
    }

    const snapshotRef = useRef(getOdiSnapshot);
    snapshotRef.current = getOdiSnapshot;

    useEffect(() => {
        const handleBeforeUnload = () => {
            console.log(snapshotRef.current());
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    return { getOdiSnapshot };
}
