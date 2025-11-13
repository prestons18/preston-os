import { h, signal } from "@prestonarnold/fuse";
import { styled } from "../../styled";

const TabsContainer = styled('div', {
    display: 'flex', 
    flexDirection: 'column', 
    height: '100%',
    overflow: 'hidden' // Prevent container from scrolling, let TabPanel handle it
});

const TabList = styled('div', {
    display: 'flex', gap: 'var(--space-xs)',
    background: 'var(--bg-soft)',
    borderRadius: '9999px',
    padding: 'var(--space-xs)',
    margin: 'var(--space-md) var(--space-md) var(--space-xs) var(--space-md)'
});

const TabButton = styled('button', {
    padding: 'var(--space-xs) var(--space-md)', background: 'transparent',
    border: 'none', borderRadius: '9999px', cursor: 'pointer',
    fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)',
    transition: 'all 0.2s',
    flex: '1',
    textAlign: 'center'
});

const TabPanel = styled('div', {
    flex: '1', 
    overflow: 'auto',
    padding: '0 var(--space-md)',
    scrollbarWidth: 'thin',
    scrollbarColor: 'var(--bg-soft) transparent',
    height: '100%',
    display: 'block'
});

const scrollbarStyles = `
    .tabs-panel::-webkit-scrollbar {
        width: 8px;
    }
    .tabs-panel::-webkit-scrollbar-track {
        background: transparent;
    }
    .tabs-panel::-webkit-scrollbar-thumb {
        background: var(--bg-soft);
        border-radius: 4px;
    }
`;
// Not the best way to do this, but it works.
if (typeof document !== 'undefined') {
    const styleEl = document.createElement('style');
    styleEl.textContent = scrollbarStyles;
    document.head.appendChild(styleEl);
}

interface Tab {
    label: string;
    content: () => any;
}

export function Tabs({ tabs }: { tabs: Tab[] }) {
    const activeTab = signal(0);

    return (
        <TabsContainer>
            <TabList>
                {tabs.map((tab, index) => (
                    <TabButton
                        onClick={() => activeTab.set(index)}
                        style={() => activeTab.get() === index 
                            ? 'background: var(--bg-elev); color: var(--text-primary);'
                            : ''
                        }
                    >
                        {tab.label}
                    </TabButton>
                ))}
            </TabList>
            <TabPanel class="tabs-panel">
                <div style="min-height: 100%; padding-bottom: var(--space-lg);">
                    {() => tabs[activeTab.get()].content()}
                </div>
            </TabPanel>
        </TabsContainer>
    );
}