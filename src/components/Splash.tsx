import Logo from './Logo';

export default function Splash({ leaving = false }: { leaving?: boolean }) {
  return (
    <div className={`splash ${leaving ? 'splash-leaving' : ''}`}>
      <Logo size={110} />
    </div>
  );
}
