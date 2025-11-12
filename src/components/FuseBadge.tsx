import { h } from "fuse";
import { styled } from "../pmod/styled";

const BadgeContainer = styled('a', {
  position: 'fixed',
  bottom: 'var(--space-sm)',
  right: 'var(--space-sm)',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-xs)',
  padding: 'var(--space-xs) var(--space-sm)',
  background: 'rgba(255, 255, 255, 0.06)',
  backdropFilter: 'blur(12px)',
  borderRadius: 'var(--radius-soft)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  color: 'var(--text-primary)',
  textDecoration: 'none',
  fontSize: 'var(--text-xs)',
  fontWeight: '500',
  transition: 'transform 0.2s, opacity 0.2s',
  zIndex: '1000'
});


export function FuseBadge() {
  return (
    <BadgeContainer 
      href="https://github.com/prestons18/fuse" 
      target="_blank" 
      rel="noopener noreferrer"
    >
      <span>Built with Fuse</span>
    </BadgeContainer>
  );
}
