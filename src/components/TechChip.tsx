const si = (slug: string, color = 'c4b5fd') =>
    `https://cdn.simpleicons.org/${slug}/${color}`;
const sk = (slug: string) =>
    `https://skillicons.dev/icons?i=${slug}&theme=dark`;

export const TECH_ICONS: Record<string, string> = {
    'ReactJS':        sk('react'),
    'React Native':   sk('react'),
    'Next.js':        sk('nextjs'),
    'TypeScript':     sk('ts'),
    'Tailwind':       sk('tailwind'),
    'Material UI':    sk('materialui'),
    'Node.js':        sk('nodejs'),
    'Express':        sk('express'),
    'Nest.js':        sk('nestjs'),
    'MongoDB':        sk('mongodb'),
    'PostgreSQL':     sk('postgres'),
    'MySQL':          sk('mysql'),
    'Docker':         sk('docker'),
    'Python':         sk('python'),
    'Java':           sk('java'),
    'C#':             sk('cs'),
    'ASP.NET':        sk('dotnet'),
    'Azure':          sk('azure'),
    'Kubernetes':     sk('kubernetes'),
    'Terraform':      sk('terraform'),
    'GCP':            sk('gcp'),
    'Jenkins':        sk('jenkins'),
    'Android Native': sk('androidstudio'),
    'Redis':          sk('redis'),
    'EF Core':        sk('dotnet'),
    'RabbitMQ':       si('rabbitmq', 'FF6600'),
    'Playwright':     'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/playwright/playwright-original.svg',
    'xUnit':          sk('dotnet'),
    'Storybook':      si('storybook', 'ff4785'),
    'Swagger':        si('swagger', '85ea2d'),
    'Scalar':         si('scalar', 'c4b5fd'),
    'JWT':            si('jsonwebtokens', 'c4b5fd'),
    'Claude Code':    si('anthropic'),
    'GitHub Copilot': si('githubcopilot'),
    'Gemini':         si('googlegemini'),
    'Antigravity IDE': 'https://antigravity.google/assets/image/brand/antigravity-icon__full-color.png',
};

export const TECH_SVG: Record<string, React.ReactElement> = {
    'ChatGPT': (
        <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="currentColor" aria-hidden="true">
            <path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 004.981 4.18a5.985 5.985 0 00-3.998 2.9 6.046 6.046 0 00.743 7.097 5.98 5.98 0 00.51 4.911 6.051 6.051 0 006.515 2.9A5.985 5.985 0 0013.26 24a6.056 6.056 0 005.772-4.206 5.99 5.99 0 003.997-2.9 6.056 6.056 0 00-.747-7.073zm-9.022 12.608a4.476 4.476 0 01-2.876-1.04l.141-.082 4.779-2.758a.795.795 0 00.392-.681v-6.737l2.02 1.168a.071.071 0 01.038.052v5.583a4.504 4.504 0 01-4.494 4.495zm-9.661-4.125a4.47 4.47 0 01-.535-3.014l.142.085 4.783 2.759a.771.771 0 00.78 0l5.843-3.369v2.332a.08.08 0 01-.033.062L9.74 19.95a4.5 4.5 0 01-6.141-1.646zM2.34 7.896a4.485 4.485 0 012.366-1.973V11.6a.766.766 0 00.388.676l5.815 3.355-2.02 1.168a.076.076 0 01-.072 0l-4.83-2.786A4.504 4.504 0 012.34 7.872zm16.597 3.855l-5.843-3.371 2.019-1.168a.075.075 0 01.072 0l4.83 2.786a4.494 4.494 0 01-.678 8.105v-5.678a.789.789 0 00-.4-.674zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 00-.785 0L9.409 9.23V6.897a.066.066 0 01.028-.061l4.83-2.787a4.5 4.5 0 016.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 01-.038-.057V6.075a4.5 4.5 0 017.375-3.453l-.142.08-4.778 2.758a.795.795 0 00-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
        </svg>
    ),
};

export function TechChip({ name, className }: { name: string; className?: string }) {
    const iconUrl = TECH_ICONS[name];
    const iconSvg = TECH_SVG[name];
    const base = 'inline-flex items-center gap-1.5';
    return (
        <span className={className ? `${base} ${className}` : `${base} bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-xs font-medium`}>
            {iconSvg ?? (iconUrl
                ? <img src={iconUrl} alt="" width={14} height={14} className="w-3.5 h-3.5 shrink-0" />
                : null
            )}
            {name}
        </span>
    );
}
