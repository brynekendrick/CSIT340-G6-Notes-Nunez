
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import NoteCard from './NoteCard.jsx'

const startingNotes = [
  {
    id: 1,
    title: 'Review map and filter',
    body: 'Redo the TodoMVC steps without looking at the guide.',
  },
  {
    id: 2,
    title: 'Prepare for the quiz',
    body: 'Practice writing one handler for many inputs.',
  },
]

function Notes() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('notes')
    return saved ? JSON.parse(saved) : startingNotes
  })

  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem('draft')
    return saved ? JSON.parse(saved) : { title: '', body: '' }
  })

  const [search, setSearch] = useState('')
  const titleRef = useRef(null)

  // Save notes
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  // Save draft after 1 second
  useEffect(() => {
    const id = setTimeout(() => {
      localStorage.setItem('draft', JSON.stringify(form))
    }, 1000)

    return () => clearTimeout(id)
  }, [form])

  function handleChange(e) {
    const { name, value } = e.target

    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    const title = form.title.trim()
    const body = form.body.trim()

    if (!title || !body) return

    setNotes((prevNotes) => [
      ...prevNotes,
      {
        id: Date.now(),
        title,
        body,
      },
    ])

    setForm({ title: '', body: '' })
    localStorage.removeItem('draft')
    titleRef.current?.focus()
  }

  const handleDelete = useCallback((id) => {
    setNotes((prevNotes) =>
      prevNotes.filter((note) => note.id !== id)
    )
  }, [])

  const visibleNotes = useMemo(() => {
    return notes.filter((note) =>
      note.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [notes, search])

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f5] text-[#292929] md:flex-row">

      {/* Sidebar */}
      <aside className="min-h-screen w-full shrink-0 border-r border-[#e5e5e5] bg-white px-8 py-7 shadow-[4px_0_20px_rgba(0,0,0,0.08)] md:w-[405px]">

        {/* Logo */}
        <h1 className="mb-5 text-[58px] font-light leading-tight tracking-tight text-[#bd454b]">
          notes
        </h1>

        {/* Search */}
        <div className="mb-5">
          <label className="mb-2 block text-[13px] font-medium text-[#999]">
            SEARCH
          </label>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title"
            className="w-full border border-[#e2e2e2] bg-white px-4 py-3 text-[16px] outline-none placeholder:italic placeholder:text-[#b8b8b8] focus:border-[#bd454b]"
          />
        </div>

        {/* New Note */}
        <form onSubmit={handleSubmit}>
          <label className="mb-2 block text-[13px] font-medium text-[#999]">
            NEW NOTE
          </label>

          <input
            ref={titleRef}
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            required
            className="mb-3 w-full border border-[#e2e2e2] bg-white px-4 py-3 text-[16px] outline-none placeholder:italic placeholder:text-[#b8b8b8] focus:border-[#bd454b]"
          />

          <textarea
            name="body"
            value={form.body}
            onChange={handleChange}
            placeholder="Write your note"
            rows="4"
            required
            className="w-full resize-none border border-[#e2e2e2] bg-white px-4 py-3 text-[16px] outline-none placeholder:italic placeholder:text-[#b8b8b8] focus:border-[#bd454b]"
          />

          <button
            type="submit"
            className="mt-3 w-full cursor-pointer bg-[#b83f45] px-5 py-3 text-[16px] text-white transition-colors hover:bg-[#a9343a]"
          >
            Add note
          </button>
        </form>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 px-6 py-9 md:px-10">

        <h2 className="mb-5 text-[28px] font-normal">
          All notes
        </h2>

        {visibleNotes.length === 0 ? (
          <p className="text-[16px] text-[#999]">
            No notes found.
          </p>
        ) : (
          <ul className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 xl:grid-cols-3">

            {visibleNotes.map((note) => (
              <li
                key={note.id}
                className="relative min-h-[123px] bg-white px-6 py-5 shadow-[0_2px_5px_rgba(0,0,0,0.15),0_20px_35px_rgba(0,0,0,0.08)]"
              >
                <NoteCard
                  id={note.id}
                  title={note.title}
                  body={note.body}
                  onDelete={handleDelete}
                />

                <button
                  type="button"
                  onClick={() => handleDelete(note.id)}
                  aria-label={`Delete ${note.title}`}
                  className="absolute right-5 top-4 cursor-pointer text-[25px] leading-none text-[#999] transition-colors hover:text-[#bd454b]"
                >
                  ×
                </button>
              </li>
            ))}

          </ul>
        )}
      </main>
    </div>
  )
}

export default Notes
