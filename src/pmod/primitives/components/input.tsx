import { styled } from "../../styled";

export const Input = styled('input', {
  padding: 'var(--space-sm)', borderRadius: 'var(--radius-base)',
  border: '1px solid rgba(255,255,255,0.1)', background: 'var(--bg-soft)',
  color: 'var(--text-primary)', fontSize: '15px', outline: 'none',
  transition: 'border-color var(--motion-fast)'
});

export const input = Input;