import { Logo as ShakUILogo } from '@shakgpt/ui';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  iconOnly?: boolean;
  clickable?: boolean;
}

export function Logo(props: LogoProps) {
  return (
    <ShakUILogo
      {...props}
      brand={{
        name: 'estimAIte',
        aiText: 'AI',
        colors: {
          text: 'text-white',
          ai: 'text-cyan-400'
        }
      }}
    />
  );
}
