import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

const pageMeta = {
  '/': { title: 'Dashboard', subtitle: 'Overview of your shelf-intelligence system' },
  '/shelf-analysis': { title: 'Shelf Analysis', subtitle: 'Upload a shelf image to run detection' },
  '/product-classification': { title: 'Product Classification', subtitle: 'Detected products and confidence scores' },
  '/assistant': { title: 'AisleX AI', subtitle: 'Ask questions, get recommendations' },
  '/history': { title: 'History', subtitle: 'Previous shelf scans and AI queries' },
  '/settings': { title: 'Settings', subtitle: 'Model endpoints and preferences' },
  '/profile': { title: 'Profile', subtitle: 'Your account details' },
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const meta = pageMeta[location.pathname] ?? { title: 'AisleX' }

  return (
    <div className="flex min-h-screen bg-slate">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar title={meta.title} subtitle={meta.subtitle} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
