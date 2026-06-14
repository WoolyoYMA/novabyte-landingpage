import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import "../dashboard.css";

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Topbar />
        <main style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}