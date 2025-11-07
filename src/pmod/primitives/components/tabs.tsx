import { h, signal } from "fuse";
import { styled } from "../../styled";

const TabsContainer = styled('div', {
    display: 'flex', flexDirection: 'column', height: '100%'
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
    flex: '1', overflow: 'auto',
    padding: '0 var(--space-md)'
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
                            ? 'background: var(--bg-elev); color: var(--text-primary);'
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