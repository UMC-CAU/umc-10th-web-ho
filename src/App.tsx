import CartContainer from './components/CartContainer'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(180deg,_#e2e8f0_0%,_#f8fafc_40%,_#eef2ff_100%)]">
      <Navbar />
      <CartContainer />
    </div>
  )
}

export default App
