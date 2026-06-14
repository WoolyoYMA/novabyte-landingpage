'use client'
import Sidebar from '../../../components/Sidebar'

export default function OverviewLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', flex: 1, minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  )
}