import Link from 'next/link';

export function Footer() {
  return (
    <footer className="container py-12 mt-16">
      <div className="footer-rule" />
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-dim text-sm mt-6">
        <span className="font-mono text-xs tracking-wider uppercase">Published by the Spirit initiative</span>
        <div className="flex gap-6">
          <Link href="/llm.txt" className="nav-link">llm.txt</Link>
          <Link href="/docs" className="nav-link">API</Link>
          <a href="https://spiritprotocol.io" className="nav-link" target="_blank" rel="noopener noreferrer">
            Spirit Protocol
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
