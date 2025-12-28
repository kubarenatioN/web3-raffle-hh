import { css, styled } from '@/stitches.config';
import type { InputHTMLAttributes } from 'react';
import { useId } from 'react';
import { Box } from './Box';
import styles from './Input.module.css';

type IProps = {
  label?: string | null;
  suffix?: string | null;
} & InputHTMLAttributes<HTMLInputElement>;

const labelCss = css({
  color: '$pink100',
});

export function FormInput({ label = null, suffix = null, ...rest }: IProps) {
  const id = useId();
  const _labelCmp = label ? (
    <label htmlFor={id} className={`${styles.label} ${labelCss()}`}>
      {label}
    </label>
  ) : null;

  return (
    <Box dir='column' className={`${styles.container}`}>
      {_labelCmp}
      <Input {...rest} id={id} className={`${styles['no-spinner']}`} />
      {suffix && <span className={`${styles.suffix}`}>{suffix}</span>}
    </Box>
  );
}

export const Input = styled('input', {
  appearance: 'none',
  font: 'inherit',
  padding: '0.6rem 0.8rem',
  background: '#3e0661',
  borderRadius: '8px',
  border: '1px solid',
  borderColor: '#360050',
  color: '#fff',
});
