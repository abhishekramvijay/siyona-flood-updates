import { Link } from 'react-router-dom';
import Container from './Container.jsx';

export default function Header({ rightSlot }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container className="flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-slate-900">
          <span aria-hidden="true">🌊</span>
          <span>Flood Alert</span>
        </Link>
        {rightSlot}
      </Container>
    </header>
  );
}
