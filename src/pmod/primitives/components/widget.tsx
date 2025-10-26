import { styled } from "../../styled";

export const Widget = styled('div', {
  position: 'absolute',
  background: 'var(--bg-elev)',
  borderRadius: 'var(--radius-soft)',
  boxShadow: 'var(--shadow-soft)',
  border: '1px solid rgba(255, 255, 255, 0.03)',
  padding: 'var(--space-md)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-sm)',
  backdropFilter: 'blur(12px)',
  overflow: 'hidden'
});

export const WidgetHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingBottom: 'var(--space-sm)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
});

export const WidgetTitle = styled('h3', {
  fontSize: '14px',
  fontWeight: '600',
  color: 'var(--text-primary)',
  margin: '0',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-xs)'
});

export const WidgetContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-sm)',
  flex: '1',
  overflow: 'auto'
});

export const WidgetItem = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  padding: 'var(--space-xs)',
  borderRadius: 'var(--radius-base)',
  cursor: 'pointer',
  transition: 'background var(--motion-fast)'
});

export const WidgetItemTitle = styled('div', {
  fontSize: '13px',
  fontWeight: '500',
  color: 'var(--text-primary)',
  lineHeight: '1.4'
});

export const WidgetItemMeta = styled('div', {
  fontSize: '11px',
  color: 'var(--text-muted)'
});