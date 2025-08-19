import type { FC } from 'react';
import styles from './icon.module.css';

interface IconProps {
  name: 'docs' | 'discord';
  className?: string;
}

export const Icon: FC<IconProps> = ({ name, className }) => {
  const iconPath = `/assets/svg/${name}-icon.svg`;
  
  return (
    <img 
      src={iconPath} 
      className={`${styles.icon} ${className || ''}`}
      aria-hidden="true"
      alt=""
    />
  );
};
