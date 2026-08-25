import {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router';
import {SEARCH_ENDPOINT, SearchFormPredictive} from './SearchFormPredictive';
import {SearchResultsPredictive} from './SearchResultsPredictive';
import {
  addSearchTerm,
  removeSearchTerm,
  useSearchHistory,
} from '~/lib/searchHistory';

export function SearchPopover({transparent = false}: {transparent?: boolean}) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const history = useSearchHistory();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  function runSearch(term: string) {
    const trimmed = term.trim();
    if (!trimmed) return;
    addSearchTerm(trimmed);
    void navigate(`${SEARCH_ENDPOINT}?q=${encodeURIComponent(trimmed)}`);
    setOpen(false);
  }

  return (
    <div className="header-search">
      <button
        type="button"
        aria-label="Cerca"
        className="header-icon-btn"
        style={{color: transparent ? '#fff' : 'var(--nero)'}}
        onClick={() => setOpen((o) => !o)}
      >
        <SearchIcon />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Chiudi ricerca"
            className="search-popover-backdrop"
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            className="search-popover-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Cerca"
          >
            <SearchFormPredictive className="search-popover-form">
              {({fetchResults, inputRef}) => (
                <div className="search-popover-input-row">
                  <SearchIcon />
                  {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
                  <input
                    autoFocus
                    name="q"
                    onChange={fetchResults}
                    onFocus={fetchResults}
                    placeholder="Cerca prodotti, anime..."
                    ref={inputRef}
                    type="search"
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        runSearch(inputRef.current?.value ?? '');
                      }
                    }}
                  />
                </div>
              )}
            </SearchFormPredictive>

            <SearchResultsPredictive>
              {({items, total, term, state, closeSearch}) => {
                const {collections, products} = items;
                const hasQuery = term.current.trim().length > 0;

                const finish = () => {
                  addSearchTerm(term.current);
                  closeSearch();
                  setOpen(false);
                };

                if (!hasQuery) {
                  if (history.length === 0) return null;
                  return (
                    <div className="search-popover-results">
                      <div className="search-popover-history">
                        <p className="search-popover-section-label">
                          Ricerche recenti
                        </p>
                        <ul>
                          {history.map((t) => (
                            <li key={t}>
                              <button type="button" onClick={() => runSearch(t)}>
                                {t}
                              </button>
                              <button
                                type="button"
                                aria-label={`Rimuovi "${t}" dalla cronologia`}
                                onClick={() => removeSearchTerm(t)}
                              >
                                ×
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                }

                if (state === 'loading') {
                  return (
                    <div className="search-popover-results">
                      <p className="search-popover-status">
                        Ricerca in corso…
                      </p>
                    </div>
                  );
                }

                if (!total) {
                  return (
                    <div className="search-popover-results">
                      <p className="search-popover-status">
                        Nessun risultato per «{term.current}»
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="search-popover-results">
                    <SearchResultsPredictive.Products
                      products={products}
                      closeSearch={finish}
                      term={term}
                    />
                    <SearchResultsPredictive.Collections
                      collections={collections}
                      closeSearch={finish}
                      term={term}
                    />
                  </div>
                );
              }}
            </SearchResultsPredictive>
          </div>
        </>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
