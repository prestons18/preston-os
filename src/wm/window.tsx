import { h, signal, onCleanup } from "fuse";
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

const Close = styled('button', {
    marginLeft: 'auto', background: 'transparent', border: 'none',
    color: 'var(--text-muted)', cursor: 'pointer',
    padding: '4px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center'
});

const ResizeHandle = styled('div', {
    position: 'absolute', bottom: '0', right: '0', width: '16px', height: '16px',
    cursor: 'nwse-resize', zIndex: '10'
});

export function AppWindow({ app, x, y, zIndex, props, onClose, onFocus }: { app: PmodApp; x: number; y: number; zIndex: number | (() => number); props?: any; onClose: () => void; onFocus: () => void }) {
    const pos = signal({ x, y });
    const size = signal({ w: app.width || 400, h: app.height || 500 });
    const scale = spring(0, 500, 60);
    const opacity = spring(0, 500, 60);
    
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
        isDragging = true;
        dragOffset = {
            x: e.clientX - pos.get().x,
            y: e.clientY - pos.get().y
        };
        document.addEventListener('mousemove', handleMouseMove, { passive: false });
        document.addEventListener('mouseup', handleMouseUp);
    };

    const startResize = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onFocus();
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

    // Clean up document event listeners when component is destroyed
    onCleanup(() => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
        }
    });

    return (
        <Win 
            style={() => `left:${pos.get().x}px;top:${pos.get().y}px;width:${size.get().w}px;height:${size.get().h}px;transform:scale(${scale.get()});opacity:${opacity.get()};z-index:${typeof zIndex === 'function' ? zIndex() : zIndex}`}
            onMouseDown={onFocus}
        >
            <Bar onMouseDown={startDrag} style="cursor:move">
                {app.icon ? <Icon name={app.icon} size={18} /> : <Icon name="Package" size={18} />}
                <span>{app.name}</span>
                <Close onClick={close} onMouseDown={(e: MouseEvent) => e.stopPropagation()}>
                    <Icon name="X" size={16} />
                </Close>
            </Bar>
            <Content onMouseDown={onFocus}>{app.content(props)}</Content>
            <ResizeHandle onMouseDown={startResize} />
        </Win>
    );
}