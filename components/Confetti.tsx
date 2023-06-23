import React from 'react';
import {confetti} from 'dom-confetti';

export interface ConfettiConfig {
  angle?: number;
  spread?: number;
  width?: string;
  height?: string;
  duration?: number;
  dragFriction?: number;
  stagger?: number;
  startVelocity?: number;
  elementCount?: number;
  decay?: number;
  colors?: string[];
  random?: () => number;
}

type Props = {
  className?: string;
  style?: any;
  active: boolean;
  config?: ConfettiConfig;
};

export const Confetti = ({
  className = '',
  style = {},
  active = false,
  config = {},
}: Props) => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (ref.current && active) {
      confetti(ref.current, config);
    }
  }, [active]);

  return (
    <div
      className={className}
      style={{position: 'relative', ...style}}
      ref={ref}
    />
  );
};

export default Confetti;
