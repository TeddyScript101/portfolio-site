'use client';

import { useEffect, useRef, useId } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
        primaryColor: '#1e3a5f',
        primaryTextColor: '#e2e8f0',
        primaryBorderColor: '#3b82f6',
        lineColor: '#60a5fa',
        secondaryColor: '#0d2d4a',
        tertiaryColor: '#134074',
        background: '#0d2d4a',
        mainBkg: '#1e3a5f',
        nodeBorder: '#3b82f6',
        clusterBkg: '#0d2d4a',
        titleColor: '#e2e8f0',
        edgeLabelBackground: '#0d2d4a',
        attributeBackgroundColorEven: '#134074',
        attributeBackgroundColorOdd: '#0d2d4a',
    },
});

export default function MermaidDiagram({ chart }: { chart: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const rawId = useId();
    const id = `mermaid-${rawId.replace(/:/g, '')}`;

    useEffect(() => {
        if (!containerRef.current) return;

        mermaid.render(id, chart.trim()).then(({ svg }) => {
            if (!containerRef.current) return;
            containerRef.current.innerHTML = svg;

            const svgEl = containerRef.current.querySelector('svg');
            if (svgEl) {
                // Read the natural dimensions mermaid produced
                const naturalWidth  = parseFloat(svgEl.getAttribute('width')  ?? '0');
                const naturalHeight = parseFloat(svgEl.getAttribute('height') ?? '0');

                if (naturalWidth && naturalHeight && !svgEl.getAttribute('viewBox')) {
                    svgEl.setAttribute('viewBox', `0 0 ${naturalWidth} ${naturalHeight}`);
                }

                // Render at natural width, centered. Cap at 1000px so very wide
                // diagrams don't overflow, and let overflow-x-auto handle mobile.
                svgEl.removeAttribute('width');
                svgEl.removeAttribute('height');
                svgEl.style.display = 'block';
                svgEl.style.width = naturalWidth ? `${Math.min(naturalWidth, 1000)}px` : '100%';
                svgEl.style.maxWidth = '100%';
                svgEl.style.height = 'auto';
                svgEl.style.margin = '0 auto';
            }
        }).catch((err) => {
            console.error('Mermaid render error:', err);
            if (containerRef.current) {
                containerRef.current.innerHTML = `<pre class="text-red-400 text-sm p-4">${chart}</pre>`;
            }
        });
    }, [chart, id]);

    return (
        <div className="my-8 overflow-x-auto py-2">
            <div ref={containerRef} />
        </div>
    );
}
