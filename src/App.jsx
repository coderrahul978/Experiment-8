// Experiment 7: Single-page Notes application using React.js
// Features: view, add, update and delete notes (data kept in localStorage)
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'notes-app-data';

function loadNotes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [notes, setNotes] = useState(loadNotes);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null); // null = adding a new note

  // Save to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
  };

  // CREATE or UPDATE
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingId === null) {
      const newNote = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toLocaleString(),
      };
      setNotes([newNote, ...notes]);
    } else {
      setNotes(
        notes.map((n) =>
          n.id === editingId ? { ...n, title: title.trim(), content: content.trim() } : n
        )
      );
    }
    resetForm();
  };

  // Load a note into the form for editing
  const handleEdit = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // DELETE
  const handleDelete = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <div className="container">
      <h1>My Notes</h1>

      <form className="note-form" onSubmit={handleSubmit}>
        <h2>{editingId === null ? 'Add a Note' : 'Edit Note'}</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Write your note here..."
          rows="4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="form-buttons">
          <button type="submit" className="btn primary">
            {editingId === null ? 'Add Note' : 'Update Note'}
          </button>
          {editingId !== null && (
            <button type="button" className="btn" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2>All Notes ({notes.length})</h2>
      {notes.length === 0 ? (
        <p className="empty">No notes yet. Add your first note above.</p>
      ) : (
        <ul className="note-list">
          {notes.map((note) => (
            <li key={note.id} className="note">
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <small>{note.createdAt}</small>
              <div className="note-buttons">
                <button className="btn" onClick={() => handleEdit(note)}>
                  Edit
                </button>
                <button className="btn danger" onClick={() => handleDelete(note.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
