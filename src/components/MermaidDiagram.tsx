'use client';

import { useEffect, useRef, useId } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
        fontSize: '15px',
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
                // Ensure viewBox is set so the SVG scales proportionally at any width
                const viewBox = svgEl.getAttribute('viewBox');
                if (!viewBox) {
                    const w = parseFloat(svgEl.getAttribute('width') ?? '0');
                    const h = parseFloat(svgEl.getAttribute('height') ?? '0');
                    if (w && h) svgEl.setAttribute('viewBox', `0 0 ${w} ${h}`);
                }

                svgEl.removeAttribute('width');
                svgEl.removeAttribute('height');
                svgEl.style.display = 'block';
                svgEl.style.width = '100%';
                svgEl.style.height = 'auto';
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
            <div ref={containerRef} className="min-w-[700px]" />
        </div>
    );
}
