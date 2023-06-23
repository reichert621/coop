import React from 'react';
import {InView} from 'react-intersection-observer';

export type FadeDirection = 'up' | 'down' | 'left' | 'right' | 'none';
export type FadeDelay =
  | 0
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 1000;
export type FadeDuration = FadeDelay;

export const getClassNamesByDirection = (direction: FadeDirection) => {
  switch (direction) {
    case 'none':
      return ['', ''];
    case 'right':
      return ['-translate-x-4', 'translate-x-0'];
    case 'left':
      return ['translate-x-4', 'translate-x-0'];
    case 'down':
      return ['-translate-y-4', 'translate-y-0'];
    case 'up':
    default:
      return ['translate-y-4', 'translate-y-0'];
  }
};

export const getClassNameByDelay = (delay: FadeDelay) => {
  switch (delay) {
    case 100:
      return 'delay-100';
    case 200:
      return 'delay-200';
    case 300:
      return 'delay-300';
    case 400:
      return 'delay-[400ms]';
    case 500:
      return 'delay-500';
    case 600:
      return 'delay-[600ms]';
    case 700:
      return 'delay-700';
    case 800:
      return 'delay-[800ms]';
    case 900:
      return 'delay-[900ms]';
    case 1000:
      return 'delay-1000';
    default:
      return '';
  }
};

export const getClassNameByDuration = (duration: FadeDuration) => {
  switch (duration) {
    case 100:
      return 'duration-100';
    case 200:
      return 'duration-200';
    case 300:
      return 'duration-300';
    case 500:
      return 'duration-500';
    case 700:
      return 'duration-700';
    case 1000:
      return 'duration-1000';
    default:
      return '';
  }
};

export const FadeIn = ({
  className = '',
  direction = 'up',
  delay = 0,
  duration = 500,
  once = true,
  children,
}: {
  className?: string;
  direction?: FadeDirection;
  delay?: FadeDelay;
  duration?: FadeDuration;
  once?: boolean;
  children: JSX.Element;
}) => {
  const [hidden, visible] = getClassNamesByDirection(direction);
  const delayClassName = getClassNameByDelay(delay);
  const durationClassName = getClassNameByDuration(duration);

  return (
    <InView triggerOnce={once}>
      {({inView, ref, entry}) => {
        return (
          <div
            ref={ref}
            className={`${className} transform transition-all ease-in-out ${durationClassName} ${delayClassName} ${
              inView ? `opacity-100 ${visible}` : `opacity-0 ${hidden}`
            }`}
          >
            {children}
          </div>
        );
      }}
    </InView>
  );
};

export default FadeIn;
