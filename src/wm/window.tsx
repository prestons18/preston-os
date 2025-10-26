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

export function AppWindow({ app, x, y, onClose }: { app: PmodApp; x: number; y: number; onClose: () => void }) {
    const pos = signal({ x, y });
    const scale = spring(0, 500, 40);
    const opacity = spring(0, 500, 40);
    const dragging = signal(false);
    const offset = signal({ x: 0, y: 0 });
    let rafId: number | null = null;
    let pendingPos: { x: number; y: number } | null = null;

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
            // Store the latest position
            pendingPos = {
                x: e.clientX - offset.get().x,
                y: e.clientY - offset.get().y
            };
            
            // Only schedule one RAF at a time
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
    };

    const handleMouseUp = () => {
        dragging.set(false);
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
    const startDrag = (e: MouseEvent) => {
        handleMouseDown(e);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    const close = () => {
        scale.set(0.8);
        opacity.set(0);
        setTimeout(onClose, 200);
    };

    return (
        <Win style={() => `left:${pos.get().x}px;top:${pos.get().y}px;width:${app.width || 400}px;height:${app.height || 500}px;transform:scale(${scale.get()});opacity:${opacity.get()}`}>
            <Bar onMouseDown={startDrag} style="cursor:move">
                <span>{app.icon || '📦'}</span>
                <span>{app.name}</span>
                <Close onClick={close} onMouseDown={(e: MouseEvent) => e.stopPropagation()}>x</Close>
            </Bar>
            <Content>{app.content()}</Content>
        </Win>
    );
}