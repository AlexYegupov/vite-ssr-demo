import type { FC } from 'react';
import styles from './logo.module.css';

export const LogoLight: FC = () => {
  return (
    <div className={styles['logo-container']}>
      <img 
        src="/assets/logos/logo-light.svg"
        alt="React Router Logo" 
        className={styles['logo-light']}
      />
    </div>
  );
};

export const LogoDark: FC = () => {
  return (
    <div className={styles['logo-container']}>
      <img 
        src="/assets/logos/logo-dark.svg"
        alt="React Router Logo" 
        className={styles['logo-dark']}
      />
    </div>
  );
};
