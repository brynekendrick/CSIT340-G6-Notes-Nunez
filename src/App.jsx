import { useEffect, useState } from 'react'
import { SettingsContext } from './SettingsContext.js'
import Notes from './components/Notes.jsx'
import Info from './components/Info.jsx'

function App() {
  const [largeText, setLargeText] = useState(() => {
    const saved = localStorage.getItem('largeText')
    return saved === 'true'
  })

  useEffect(() => {
    localStorage.setItem('largeText', largeText)
  }, [largeText])

  return (
    <SettingsContext value={{ largeText, setLargeText }}>
      <div className="bg-[#f5f5f5] font-light text-[#111]">
        <Notes />
        <Info name="Calvin Patrick S. Garciano" />
      </div>
    </SettingsContext>
  )
}

export default App