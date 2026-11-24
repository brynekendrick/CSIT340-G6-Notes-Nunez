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

  // Save notes to localStorage
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

    if (!title || !body) {
      return
    }

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
  setNotes(notes.filter((note) => note.id !== id))
  }, [notes])

  const visibleNotes = useMemo(() => {
  return notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  )
  }, [notes, search])

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
      <div className="mb-10">
        <h1 className="text-[42px] font-normal tracking-tight">
          Notes
        </h1>

        <p className="mt-2 text-[16px] text-[#949494]">
          Keep track of what you need to remember.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-10">
        <div className="mb-4">
          <label className="mb-2 block text-[13px] font-normal tracking-wide text-[#949494]">
            NEW NOTE
          </label>

          <input
            ref={titleRef}
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            required
            className="w-full border-b border-[#d6d6d6] bg-transparent py-2 text-[22px] font-normal outline-none placeholder:text-[#b8b8b8]"
          />
        </div>

        <textarea
          name="body"
          value={form.body}
          onChange={handleChange}
          placeholder="Write your note..."
          rows="3"
          required
          className="w-full resize-none border-b border-[#d6d6d6] bg-transparent py-2 text-[17px] font-normal outline-none placeholder:text-[#b8b8b8]"
        />

        <button
          type="submit"
          className="mt-5 cursor-pointer bg-[#b83f45] px-5 py-2 text-[15px] text-white"
        >
          Add note
        </button>
      </form>

      <div className="mb-8">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="w-full border-b border-[#d6d6d6] bg-transparent py-2 text-[17px] outline-none placeholder:text-[#b8b8b8]"
        />
      </div>

      {visibleNotes.length === 0 ? (
        <p className="text-[17px] text-[#949494]">
          No notes found.
        </p>
      ) : (
        <ul className="space-y-5">
          {visibleNotes.map((note) => (
            <li
              key={note.id}
              className="relative min-h-32 bg-white px-6 py-5 shadow-[0_2px_4px_0_rgba(0,0,0,0.2),0_25px_50px_0_rgba(0,0,0,0.1)]"
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
                className="absolute top-4 right-5 cursor-pointer text-[26px] leading-none text-[#949494] hover:text-[#c18585]"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default Notes