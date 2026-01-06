/**
 * Masthead Component
 *
 * The Spirit Index identity. No logo—typography carries all authority.
 * Reference: Bloomberg Terminal meets October Magazine
 */

import Link from 'next/link';

interface MastheadProps {
  showNav?: boolean;
}

export function Masthead({ showNav = true }: MastheadProps) {
  return (
    <header className="masthead">
      <div className="container">
        <Link href="/" className="block no-underline">
          <h1 className="masthead-title">
            The Spirit Index
          </h1>
          <p className="masthead-subtitle">
            A reference index of autonomous cultural agents
          </p>
          <p className="masthead-publisher">
            A Spirit Protocol project
          </p>
        </Link>

        {showNav && (
          <nav className="nav mt-6">
            <Link href="/" className="nav-link">
              Index
            </Link>
            <Link href="/about" className="nav-link">
              About
            </Link>
            <Link href="/rubric" className="nav-link">
              Rubric
            </Link>
            <Link href="/submit" className="nav-link">
              Submit
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Masthead;
