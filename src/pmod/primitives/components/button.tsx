import { styled } from "../../styled";

const base = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: 'var(--radius-base)', fontWeight: '500',
  transition: 'all var(--motion-fast) ease-out', outline: 'none',
  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
  fontSize: '15px', padding: 'var(--space-sm) var(--space-md)'
};

const variants = {
  primary: { background: 'var(--accent-primary)', color: 'var(--text-inverse)' },
  secondary: { background: 'var(--bg-soft)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.06)' },
  ghost: { background: 'transparent', color: 'var(--text-primary)' },
  link: { background: 'transparent', color: 'var(--accent-teal)', padding: '0' }
};

export const Button = styled('button', base, variants);
export const button = Button;