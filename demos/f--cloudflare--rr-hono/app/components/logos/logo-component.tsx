import type { FC } from 'react';
import styles from './logo.module.css';

export const LogoLight: FC = () => {
  return (
    <div className={styles['logo-light']} role="img" aria-label="React Router Logo" />
  );
};

export const LogoDark: FC = () => {
  return (
    <div className={styles['logo-dark']} role="img" aria-label="React Router Logo" />
  );
};
