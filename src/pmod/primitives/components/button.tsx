import { styled } from "../../styled";

const base = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: 'var(--radius-base)', fontWeight: '500', textTransform: 'uppercase',
  transition: 'all var(--motion-fast) ease-out', outline: 'none', letterSpacing: '0.5px',
  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
  fontSize: '14px', padding: '10px 24px', boxShadow: 'var(--shadow-soft)'
};

const variants = {
  primary: { background: 'var(--accent-primary)', color: 'var(--text-inverse)' },
  secondary: { background: 'var(--bg-elev)', color: 'var(--text-primary)', boxShadow: 'none' },
  ghost: { background: 'transparent', color: 'var(--text-primary)', boxShadow: 'none' },
  link: { background: 'transparent', color: 'var(--accent-teal)', padding: '0', boxShadow: 'none', textTransform: 'none' }
};

export const Button = styled('button', base, variants);
export const button = Button;