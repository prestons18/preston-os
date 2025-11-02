import { h, signal, onCleanup, effect } from "fuse";
import { PmodApp } from "../pmod/registry";
import { styled, spring, Icon } from "../pmod";

const Win = styled('div', {
    position: 'absolute', background: 'var(--bg-elev)', borderRadius: 'var(--radius-base)',
    boxShadow: 'var(--shadow-soft)', border: '1px solid rgba(255,255,255,0.03)',
    overflow: 'hidden', display: 'flex', flexDirection: 'column'
});

const Bar = styled('div', {
    height: '40px', padding: '0 var(--space-md)', display: 'flex', alignItems: 'center',
    gap: '12px', color: 'var(--text-primary)', fontWeight: '600', fontSize: '14px',
    borderBottom: '1px solid rgba(255,255,255,0.03)', userSelect: 'none'
});

const Content = styled('div', { flex: '1', overflow: 'auto' });

const WindowButton = styled('button', {
    background: 'transparent', border: 'none',
    color: 'var(--text-muted)', cursor: 'pointer',
    padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center'
});

const WindowActions = styled('div', {
    marginLeft: 'auto', display: 'flex', gap: '4px'
});

const ResizeHandle = styled('div', {
    position: 'absolute', bottom: '0', right: '0', width: '16px', height: '16px',
    cursor: 'nwse-resize', zIndex: '10'
});

export function AppWindow({ app, x, y, zIndex, minimised, props, onClose, onMinimise, onFocus }: { app: PmodApp; x: number; y: number; zIndex: number | (() => number); minimised?: boolean | (() => boolean); props?: any; onClose: () => void; onMinimise?: () => void; onFocus: () => void }) {
    const pos = signal({ x, y });
    const size = signal({ w: app.width || 400, h: app.height || 500 });
    const scale = spring(0, 500, 60);
    const opacity = spring(0, 500, 60);
    const shouldHide = signal(false);
    const isMaximised = signal(false);
    
    // Store original position/size for restoring from maximise
    let savedPos = { x, y };
    let savedSize = { w: app.width || 400, h: app.height || 500 };
    
    let isDragging = false;
    let isResizing = false;
    let dragOffset = { x: 0, y: 0 };
    let resizeStart = { w: 0, h: 0, mx: 0, my: 0 };
    let rafId: number | null = null;
    let pendingPos: { x: number; y: number } | null = null;
    let pendingSize: { w: number; h: number } | null = null;

    scale.set(1);
    opacity.set(1);

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            e.preventDefault();
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
            const maxX = innerWidth - size.get().w;
            const maxY = innerHeight - 40;
            pendingPos = {
                x: Math.max(0, Math.min(newX, maxX)),
                y: Math.max(0, Math.min(newY, maxY))
            };
            if (rafId === null) {
                rafId = requestAnimationFrame(() => {
                    if (pendingPos) {
                        pos.set(pendingPos);
                        pendingPos = null;
                    }
                    rafId = null;
                });
            }
        }
        if (isResizing) {
            e.preventDefault();
            pendingSize = {
                w: Math.max(200, resizeStart.w + (e.clientX - resizeStart.mx)),
                h: Math.max(150, resizeStart.h + (e.clientY - resizeStart.my))
            };
            if (rafId === null) {
                rafId = requestAnimationFrame(() => {
                    if (pendingSize) {
                        size.set(pendingSize);
                        pendingSize = null;
                    }
                    rafId = null;
                });
            }
        }
    };

    const handleMouseUp = () => {
        isDragging = false;
        isResizing = false;
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const startDrag = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onFocus();
        
        // If maximised, unmaximise first and adjust drag offset
        if (isMaximised.get()) {
            const currentSize = size.get();
            const clickRatio = e.clientX / currentSize.w;
            
            isMaximised.set(false);
            pos.set(savedPos);
            size.set(savedSize);
            
            // Adjust drag offset so window follows cursor proportionally
            dragOffset = {
                x: savedSize.w * clickRatio,
                y: e.clientY - savedPos.y
            };
        } else {
            dragOffset = {
                x: e.clientX - pos.get().x,
                y: e.clientY - pos.get().y
            };
        }
        
        isDragging = true;
        document.addEventListener('mousemove', handleMouseMove, { passive: false });
        document.addEventListener('mouseup', handleMouseUp);
    };

    const startResize = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onFocus();
        
        // Can't resize when maximised
        if (isMaximised.get()) return;
        
        isResizing = true;
        const s = size.get();
        resizeStart = { w: s.w, h: s.h, mx: e.clientX, my: e.clientY };
        document.addEventListener('mousemove', handleMouseMove, { passive: false });
        document.addEventListener('mouseup', handleMouseUp);
    };

    const close = () => {
        scale.set(0.8);
        opacity.set(0);
        setTimeout(onClose, 200);
    };

    const minimise = () => {
        if (onMinimise) {
            onMinimise();
        }
    };
    
    const toggleMaximise = () => {
        if (isMaximised.get()) {
            // Restore to saved position/size
            isMaximised.set(false);
            pos.set(savedPos);
            size.set(savedSize);
        } else {
            // Save current position/size and maximise
            savedPos = pos.get();
            savedSize = size.get();
            isMaximised.set(true);
            pos.set({ x: 0, y: 0 });
            size.set({ w: window.innerWidth, h: window.innerHeight });
        }
    };
    
    // Watch minimised state to manage animation and visibility
    let hideTimeout: number | null = null;
    effect(() => {
        const isMinimised = typeof minimised === 'function' ? minimised() : (minimised || false);
        
        if (hideTimeout !== null) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
        
        if (isMinimised) {
            // Start animation, then hide after animation completes
            scale.set(0.8);
            opacity.set(0);
            hideTimeout = window.setTimeout(() => {
                shouldHide.set(true);
            }, 200);
        } else {
            // Show immediately and restore animation
            shouldHide.set(false);
            scale.set(1);
            opacity.set(1);
        }
    });

    // Clean up document event listeners when component is destroyed
    onCleanup(() => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
        }
        if (hideTimeout !== null) {
            clearTimeout(hideTimeout);
        }
    });

    return (
        <Win 
            style={() => {
                const hidden = shouldHide.get();
                const maximised = isMaximised.get();
                const baseStyle = `left:${pos.get().x}px;top:${pos.get().y}px;width:${size.get().w}px;height:${size.get().h}px;transform:scale(${scale.get()});opacity:${opacity.get()};z-index:${typeof zIndex === 'function' ? zIndex() : zIndex}`;
                const borderRadius = maximised ? 'border-radius:0;' : '';
                return hidden ? `${baseStyle};${borderRadius};pointer-events:none;visibility:hidden;` : `${baseStyle};${borderRadius}`;
            }}
            onMouseDown={onFocus}
        >
            <Bar onMouseDown={startDrag} onDblClick={toggleMaximise} style={() => isMaximised.get() ? "cursor:default" : "cursor:move"}>
                {app.icon ? <Icon name={app.icon} size={18} /> : <Icon name="Package" size={18} />}
                <span>{app.name}</span>
                <WindowActions>
                    {onMinimise && (
                        <WindowButton onClick={minimise} onMouseDown={(e: MouseEvent) => e.stopPropagation()}>
                            <Icon name="Minus" size={16} />
                        </WindowButton>
                    )}
                    <WindowButton onClick={toggleMaximise} onMouseDown={(e: MouseEvent) => e.stopPropagation()}>
                        {() => isMaximised.get() ? <Icon name="Minimize2" size={16} /> : <Icon name="Maximize2" size={16} />}
                    </WindowButton>
                    <WindowButton onClick={close} onMouseDown={(e: MouseEvent) => e.stopPropagation()}>
                        <Icon name="X" size={16} />
                    </WindowButton>
                </WindowActions>
            </Bar>
            <Content onMouseDown={onFocus}>{app.content(props)}</Content>
            {() => !isMaximised.get() && <ResizeHandle onMouseDown={startResize} />}
        </Win>
    );
}