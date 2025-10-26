import { h, signal } from "fuse";
import { PmodApp } from "../pmod/registry";
import { styled, spring } from "../pmod";

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
    color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px',
    padding: '4px 8px', borderRadius: '4px'
});

const ResizeHandle = styled('div', {
    position: 'absolute', bottom: '0', right: '0', width: '16px', height: '16px',
    cursor: 'nwse-resize', zIndex: '10'
});

export function AppWindow({ app, x, y, onClose }: { app: PmodApp; x: number; y: number; onClose: () => void }) {
    const pos = signal({ x, y });
    const size = signal({ w: app.width || 400, h: app.height || 500 });
    const scale = spring(0, 500, 40);
    const opacity = spring(0, 500, 40);
    const dragging = signal(false);
    const resizing = signal(false);
    const offset = signal({ x: 0, y: 0 });
    const resizeStart = signal({ w: 0, h: 0, mx: 0, my: 0 });
    let rafId: number | null = null;
    let pendingPos: { x: number; y: number } | null = null;
    let pendingSize: { w: number; h: number } | null = null;

    scale.set(1);
    opacity.set(1);

    const handleMouseDown = (e: MouseEvent) => {
        dragging.set(true);
        offset.set({
            x: e.clientX - pos.get().x,
            y: e.clientY - pos.get().y
        });
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (dragging.get()) {
            const newX = e.clientX - offset.get().x;
            const newY = e.clientY - offset.get().y;
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
        if (resizing.get()) {
            const rs = resizeStart.get();
            pendingSize = {
                w: Math.max(200, rs.w + (e.clientX - rs.mx)),
                h: Math.max(150, rs.h + (e.clientY - rs.my))
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
        dragging.set(false);
        resizing.set(false);
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
    const startDrag = (e: MouseEvent) => {
        e.preventDefault();
        handleMouseDown(e);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    const startResize = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        resizing.set(true);
        const s = size.get();
        resizeStart.set({ w: s.w, h: s.h, mx: e.clientX, my: e.clientY });
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const close = () => {
        scale.set(0.8);
        opacity.set(0);
        setTimeout(onClose, 200);
    };

    return (
        <Win style={() => `left:${pos.get().x}px;top:${pos.get().y}px;width:${size.get().w}px;height:${size.get().h}px;transform:scale(${scale.get()});opacity:${opacity.get()}`}>
            <Bar onMouseDown={startDrag} style="cursor:move">
                <span>{app.icon || '📦'}</span>
                <span>{app.name}</span>
                <Close onClick={close} onMouseDown={(e: MouseEvent) => e.stopPropagation()}>x</Close>
            </Bar>
            <Content>{app.content()}</Content>
            <ResizeHandle onMouseDown={startResize} />
        </Win>
    );
}