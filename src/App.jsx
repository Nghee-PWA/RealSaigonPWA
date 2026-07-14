import { useState, useSyncExternalStore } from 'react'
import { subscribe, getState, getToast } from './data/backend.js'
import Store from './screens/Store.jsx'
import Social from './screens/Social.jsx'
import Profile from './screens/Profile.jsx'
import Missions from './screens/Missions.jsx'
import Diary from './screens/Diary.jsx'

const TABS = [
  { id: 'store', label: 'Store', icon: '🛍️', Screen: Store },
  { id: 'social', label: 'Social', icon: '👥', Screen: Social },
  { id: 'profile', label: 'Profile', icon: '🙂', Screen: Profile },
  { id: 'missions', label: 'Nhiệm vụ', icon: '🎯', Screen: Missions },
  { id: 'diary', label: 'Diary', icon: '📸', Screen: Diary },
]

export default function App() {
  const state = useSyncExternalStore(subscribe, getState)
  const toast = useSyncExternalStore(subscribe, getToast)
  const [tab, setTab] = useState('profile')
  const { Screen } = TABS.find((t) => t.id === tab)

  return (
    <div className="app">
      <header className="topbar">
        <span className="logo">NNN</span>
        <span className="donuts">🍩 {state.donuts}</span>
      </header>

      <main>
        <Screen state={state} />
      </main>

      {toast && <div className="toast">{toast.msg}</div>}

      <nav className="tabbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? 'tab active' : 'tab'}
            onClick={() => setTab(t.id)}
          >
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
