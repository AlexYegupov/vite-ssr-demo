import type { FC } from 'react';
import styles from './svg-icon.module.css';

interface SvgIconProps {
  name: 'docs' | 'discord';
  className?: string;
}

export const SvgIcon: FC<SvgIconProps> = ({ name, className }) => {
  return (
    <img 
      src={`/assets/svg/${name}-icon.svg`}
      className={`${styles.icon} ${className || ''}`}
      alt=""
      aria-hidden="true"
    />
  );
};
