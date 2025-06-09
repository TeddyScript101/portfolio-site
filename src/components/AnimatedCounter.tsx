
import { useState, useEffect } from 'react';

export function AnimatedCounter({ target, isVisible }: { target: number; isVisible: boolean }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isVisible) return;

        let start = 0;
        const duration = 1000;
        const incrementTime = 20;
        const steps = duration / incrementTime;
        const increment = target / steps;

        const counter = setInterval(() => {
            start += increment;
            if (start >= target) {
                start = target;
                clearInterval(counter);
            }
            setCount(Math.floor(start));
        }, incrementTime);

        return () => clearInterval(counter);
    }, [isVisible, target]);

    return <>{count}%</>;
}