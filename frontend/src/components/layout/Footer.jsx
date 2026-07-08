import Container from './Container.jsx';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <Container className="flex flex-col items-center gap-1 py-6 text-center text-sm text-slate-500 sm:flex-row sm:justify-between sm:text-left">
        <p>Built with ❤️ by Siyonites</p>
        <p>
          Questions or Suggestions? Contact{' '}
          <a href="mailto:ramvijayabhishek@gmail.com" className="text-brand-600 hover:underline">
            ramvijayabhishek@gmail.com
          </a>
        </p>
      </Container>
    </footer>
  );
}
