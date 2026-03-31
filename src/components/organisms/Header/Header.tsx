'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { useLogoutMutation } from '@/services/query/auth.queries'

const NAV_LINKS = [
  { href: '/recipes', label: 'Tarifler' },
  { href: '/search',  label: 'Keşfet' },
]

export function Header() {
  const router   = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user } = useAuthStore()
  const { mutate: logout } = useLogoutMutation()

  const [menuOpen,    setMenuOpen]    = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen,  setSearchOpen]  = useState(false)

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    router.push('/')
  }

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  const isActive = (href: string) => pathname === href

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #F3F4F6',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0"
            style={{ textDecoration: 'none' }}
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg text-white text-lg font-bold"
              style={{ backgroundColor: '#F97316' }}
            >
              🍳
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#1F2937', letterSpacing: '-0.02em' }}>
              Tarif<span style={{ color: '#F97316' }}>Küpü</span>
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  padding: '0.375rem 0.875rem',
                  borderRadius: '0.5rem',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  color: isActive(href) ? '#F97316' : '#374151',
                  backgroundColor: isActive(href) ? '#FFF7ED' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all .15s',
                }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Desktop Search ── */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center flex-1 max-w-sm mx-4"
            style={{
              background: '#F9FAFB',
              border: '1.5px solid #E5E7EB',
              borderRadius: '0.75rem',
              overflow: 'hidden',
              padding: '0 0.25rem 0 1rem',
              gap: '0.5rem',
            }}
          >
            <svg
              width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="#9CA3AF" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tarif, malzeme ara..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '0.875rem',
                color: '#1F2937',
                padding: '0.6rem 0',
              }}
            />
            {searchQuery && (
              <button
                type="submit"
                style={{
                  background: '#F97316',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  margin: '0.2rem 0',
                }}
              >
                Ara
              </button>
            )}
          </form>

          {/* ── Desktop Auth ── */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {isAuthenticated ? (
              <>
                <Link
                  href="/favorites"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.375rem',
                    padding: '0.4rem 0.875rem',
                    background: '#FEE2E2', color: '#EF4444',
                    borderRadius: '0.625rem',
                    fontSize: '0.875rem', fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  Favorilerim
                </Link>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  paddingLeft: '0.75rem',
                  borderLeft: '1px solid #E5E7EB',
                }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: '#FFEDD5', color: '#F97316',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.85rem',
                  }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#6B7280', fontSize: '0.875rem', fontWeight: 500,
                    }}
                  >
                    Çıkış
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    padding: '0.5rem 1rem',
                    color: '#374151', fontWeight: 600, fontSize: '0.875rem',
                    textDecoration: 'none',
                  }}
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  style={{
                    padding: '0.5rem 1.125rem',
                    background: '#F97316', color: '#fff',
                    borderRadius: '0.625rem',
                    fontWeight: 700, fontSize: '0.875rem',
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px rgba(249,115,22,.3)',
                  }}
                >
                  Ücretsiz Kaydol
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile: Search + Burger ── */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              style={{
                padding: '0.5rem', background: 'none', border: 'none',
                color: '#6B7280', cursor: 'pointer',
              }}
              aria-label="Arama"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                padding: '0.5rem', background: 'none', border: 'none',
                color: '#374151', cursor: 'pointer',
              }}
              aria-label="Menü"
            >
              {menuOpen
                ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              }
            </button>
          </div>
        </div>

        {/* ── Mobile Search Bar ── */}
        {searchOpen && (
          <div style={{ paddingBottom: '0.75rem' }} className="md:hidden">
            <form onSubmit={handleSearch} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: '#F9FAFB', border: '1.5px solid #E5E7EB',
              borderRadius: '0.75rem', padding: '0 0.5rem 0 1rem',
            }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tarif ara..."
                autoFocus
                style={{
                  flex: 1, background: 'transparent', border: 'none',
                  outline: 'none', fontSize: '0.9rem', color: '#1F2937',
                  padding: '0.7rem 0',
                }}
              />
              <button type="submit" className="btn-orange" style={{ padding: '0.35rem 0.875rem', fontSize: '0.8rem' }}>
                Ara
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div style={{
          borderTop: '1px solid #F3F4F6',
          background: '#FFFFFF',
          padding: '1rem',
        }} className="md:hidden">
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '0.625rem',
                  fontWeight: 500, color: isActive(href) ? '#F97316' : '#374151',
                  background: isActive(href) ? '#FFF7ED' : 'transparent',
                  textDecoration: 'none', fontSize: '0.95rem',
                }}
              >
                {label}
              </Link>
            ))}

            <div style={{ borderTop: '1px solid #F3F4F6', marginTop: '0.5rem', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {isAuthenticated ? (
                <>
                  <Link href="/favorites" onClick={() => setMenuOpen(false)} style={{ padding: '0.75rem 1rem', borderRadius: '0.625rem', fontWeight: 500, color: '#EF4444', background: '#FEF2F2', textDecoration: 'none' }}>
                    ❤️ Favorilerim
                  </Link>
                  <button onClick={handleLogout} style={{ padding: '0.75rem 1rem', borderRadius: '0.625rem', fontWeight: 500, color: '#6B7280', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)} style={{ padding: '0.75rem 1rem', borderRadius: '0.625rem', fontWeight: 600, color: '#374151', textDecoration: 'none', textAlign: 'center', border: '1.5px solid #E5E7EB' }}>
                    Giriş Yap
                  </Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)} style={{ padding: '0.75rem 1rem', borderRadius: '0.625rem', fontWeight: 700, color: '#fff', background: '#F97316', textDecoration: 'none', textAlign: 'center' }}>
                    Ücretsiz Kaydol
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
