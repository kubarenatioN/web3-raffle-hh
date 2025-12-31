import { styled } from '@/stitches.config';
import type { InputHTMLAttributes, ReactElement } from 'react';
import { cloneElement, isValidElement, useId } from 'react';
import { Box } from './Box';
import styles from './Input.module.css';

type IProps = {
  label?: ReactElement<HTMLLabelElement, 'label'> | null;
  suffix?: string | null;
} & InputHTMLAttributes<HTMLInputElement>;

export function FormInput({ label = null, suffix = null, ...rest }: IProps) {
  const _id = useId();
  const _labelCmp = label ? (
    isValidElement(label) && label.type === 'label' ? (
      cloneElement(label, { htmlFor: _id })
    ) : (
      <label htmlFor={_id}>{label}</label>
    )
  ) : null;

  return (
    <Box dir='column' className={`${styles.container}`}>
      {_labelCmp && <div className={`${styles.label}`}>{_labelCmp}</div>}

      <Input {...rest} id={_id} className={`${styles['no-spinner']}`} />

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
