/**
 * Masthead Component
 *
 * The Spirit Index identity. No logo — typography carries all authority.
 * Reference: Bloomberg Terminal meets October Magazine
 */

import Link from 'next/link';

interface MastheadProps {
  activeLink?: 'index' | 'about' | 'rubric' | 'compare' | 'submit' | 'docs' | 'verify';
  showNav?: boolean;
}

export function Masthead({ activeLink, showNav = true }: MastheadProps) {
  const navItems = [
    { href: '/', label: 'Index', key: 'index' as const },
    { href: '/about', label: 'About', key: 'about' as const },
    { href: '/rubric', label: 'Rubric', key: 'rubric' as const },
    { href: '/compare', label: 'Compare', key: 'compare' as const },
    { href: '/submit', label: 'Submit', key: 'submit' as const },
  ];

  return (
    <header className="masthead">
      <div className="container">
        <Link href="/" className="block no-underline">
          <h1 className="masthead-title">The Spirit Index</h1>
          <p className="masthead-subtitle">
            A reference index of autonomous cultural agents
          </p>
          <p className="masthead-publisher">Published by the Spirit initiative</p>
        </Link>

        {showNav && (
          <nav className="nav mt-6">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`nav-link${activeLink === item.key ? ' active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Masthead;
