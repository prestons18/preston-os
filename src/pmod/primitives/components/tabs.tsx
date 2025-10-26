import { h, signal } from "fuse";
import { styled } from "../../styled";

const TabsContainer = styled('div', {
    display: 'flex', flexDirection: 'column', height: '100%'
});

const TabList = styled('div', {
    display: 'flex', gap: 'var(--space-xs)', padding: 'var(--space-md)',
    borderBottom: '1px solid rgba(255,255,255,0.06)'
});

const TabButton = styled('button', {
    padding: 'var(--space-xs) var(--space-md)', background: 'transparent',
    border: 'none', borderRadius: 'var(--radius-soft)', cursor: 'pointer',
    fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)',
    transition: 'all 0.2s'
});

const TabPanel = styled('div', {
    flex: '1', overflow: 'auto'
});

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
                            ? 'background: var(--bg-elev); color: var(--text-primary)'
                            : ''
                        }
                    >
                        {tab.label}
                    </TabButton>
                ))}
            </TabList>
            <TabPanel>
                {() => tabs[activeTab.get()].content()}
            </TabPanel>
        </TabsContainer>
    );
}