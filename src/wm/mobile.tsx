import { h, signal, effect } from "fuse";
import { styled } from "../pmod/styled";
import { registry } from "../pmod/registry";
import { Icon } from "../pmod";

const MobileContainer = styled('div', {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'var(--bg-deep)',
  overflow: 'hidden'
});

const StatusBar = styled('div', {
  height: '28px',
  padding: '0 var(--space-sm)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'var(--mobile-statusbar)',
  backdropFilter: 'blur(12px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  fontSize: 'var(--text-xs)',
  color: 'var(--text-primary)',
  fontWeight: '500',
  zIndex: '1000'
});

const HomeScreen = styled('div', {
  flex: '1',
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gridGap: 'var(--space-md)',
  padding: 'var(--space-md)',
  paddingBottom: 'calc(70px + var(--space-md))',
  overflowY: 'auto'
});

const AppIcon = styled('button', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--space-xs)',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--text-primary)',
  textAlign: 'center',
  padding: 'var(--space-xs)'
});

const AppIconBg = styled('div', {
  width: '56px',
  height: '56px',
  borderRadius: '14px',
  background: 'linear-gradient(135deg, var(--bg-soft), var(--bg-elev))',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: 'var(--shadow-soft)',
  transition: 'transform 0.15s'
});

const AppName = styled('span', {
  fontSize: 'var(--text-xs)',
  maxWidth: '64px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
});

const Dock = styled('div', {
  height: '70px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  padding: 'var(--space-xs) var(--space-md)',
  background: 'var(--mobile-dock)',
  backdropFilter: 'blur(12px)',
  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 900
});

const DockIcon = styled('button', {
  width: '50px',
  height: '50px',
  borderRadius: '12px',
  background: 'var(--bg-soft)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
});

const AppContent = styled('div', {
  position: 'absolute',
  top: '28px',
  left: '0',
  right: '0',
  bottom: '70px',
  background: 'var(--bg-base)',
  zIndex: '500',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-out, opacity 0.3s ease-out'
});

const AppHeader = styled('div', {
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  padding: '0 var(--space-sm)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  background: 'var(--bg-elev)'
});

const AppBody = styled('div', {
  flex: '1',
  overflow: 'auto'
});

const BackButton = styled('button', {
  background: 'transparent',
  border: 'none',
  color: 'var(--text-primary)',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-xs)',
  cursor: 'pointer',
  padding: 'var(--space-xs)'
});

const apps = registry.list();
const dockApps = ['About', 'Blog', 'Notes', 'Terminal'];

function AppView({ appName, onClose, transform, opacity }: { 
  appName: string; 
  onClose: () => void; 
  transform: () => string; 
  opacity: () => number;
}) {
  const app = registry.get(appName);
  if (!app) return null;
  
  return (
    <AppContent style={() => `transform: ${transform()}; opacity: ${opacity()};`}>
      <AppHeader>
        <BackButton onClick={onClose}>
          <Icon name="ChevronLeft" size={18} />
          <span>{app.name}</span>
        </BackButton>
      </AppHeader>
      <AppBody>{app.content()}</AppBody>
    </AppContent>
  );
}

const HomeContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  position: 'relative',
  height: '100%',
  overflow: 'hidden'
});

function HomeView({ onOpenApp }: { onOpenApp: (name: string) => void }) {
  return (
    <HomeContainer>
      <HomeScreen>
        {apps.map(app => (
          <AppIcon onClick={() => onOpenApp(app.name)}>
            <AppIconBg>
              <Icon name={app.icon || "Package"} size={28} />
            </AppIconBg>
            <AppName>{app.name}</AppName>
          </AppIcon>
        ))}
      </HomeScreen>
      
      <Dock>
        {dockApps.map(name => {
          const app = registry.get(name);
          return app ? (
            <DockIcon onClick={() => onOpenApp(name)}>
              <Icon name={app.icon || "Package"} size={24} />
            </DockIcon>
          ) : null;
        })}
      </Dock>
    </HomeContainer>
  );
}

export function MobileOS() {
  const currentTime = signal(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const activeApp = signal<string | null>(null);
  const appTransform = signal('translateX(0) translateZ(0)');
  const appOpacity = signal(1);
  
  const timeInterval = setInterval(() => {
    currentTime.set(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, 60000);
  
  const openApp = (name: string) => {
    activeApp.set(name);
    appTransform.set('translateX(0) translateZ(0)');
    appOpacity.set(1);
  };
  
  const closeApp = () => {
    appTransform.set('translateX(100%) translateZ(0)');
    appOpacity.set(0);
    setTimeout(() => activeApp.set(null), 300);
  };
  
  effect(() => () => {
    clearInterval(timeInterval);
  });
  
  return (
    <MobileContainer>
      <StatusBar>
        <div>{currentTime}</div>
        <div style="display: flex; gap: var(--space-xs)">
          <Icon name="Wifi" size={14} />
          <Icon name="Battery" size={14} />
        </div>
      </StatusBar>
      
      <div style={() => ({ 
        display: activeApp.get() ? 'none' : 'contents'
      })}>
        <HomeView onOpenApp={openApp} />
      </div>
      
      {() => {
        const current = activeApp.get();
        if (!current) return null;
        
        return (
          <AppView 
            appName={current} 
            onClose={closeApp} 
            transform={() => appTransform.get()} 
            opacity={() => appOpacity.get()} 
          />
        );
      }}
    </MobileContainer>
  );
}