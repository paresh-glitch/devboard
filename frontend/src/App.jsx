import { useState, useEffect } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const fetchTasks = () =>
    fetch('/api/tasks').then(r => r.json()).then(setTasks);

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    setTitle('');
    fetchTasks();
  };

  const toggleTask = async (id, done) => {
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !done })
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  const pending = tasks.filter(t => !t.done);
  const completed = tasks.filter(t => t.done);

  const styles = {
    app: { maxWidth: 560, margin: '0 auto', padding: '2rem 1rem', fontFamily: 'sans-serif' },
    header: { marginBottom: '2rem' },
    h1: { fontSize: 24, fontWeight: 500, margin: 0 },
    subtitle: { fontSize: 13, color: '#888', marginTop: 4 },
    inputRow: { display: 'flex', gap: 8, marginBottom: '1.5rem' },
    input: { flex: 1, padding: '0 12px', height: 38, border: '1px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none' },
    addBtn: { height: 38, padding: '0 16px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', fontSize: 14, cursor: 'pointer' },
    stats: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: '1.5rem' },
    stat: { background: '#f5f5f5', borderRadius: 8, padding: '0.75rem 1rem' },
    statLabel: { fontSize: 12, color: '#888', marginBottom: 4 },
    statValue: { fontSize: 20, fontWeight: 500 },
    sectionLabel: { fontSize: 12, fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 },
    taskList: { display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1.5rem' },
    task: { display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: '0.875rem 1rem' },
    checkbox: { width: 18, height: 18, borderRadius: '50%', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 },
    checkboxDone: { width: 18, height: 18, borderRadius: '50%', background: '#1D9E75', border: '1px solid #1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 },
    taskTitle: { flex: 1, fontSize: 14 },
    taskTitleDone: { flex: 1, fontSize: 14, textDecoration: 'line-through', color: '#aaa' },
    deleteBtn: { width: 28, height: 28, borderRadius: 8, border: 'none', background: 'transparent', color: '#ccc', cursor: 'pointer', fontSize: 16 },
    empty: { textAlign: 'center', padding: '2rem', color: '#aaa', fontSize: 14 },
  };

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <h1 style={styles.h1}>DevBoard</h1>
        <p style={styles.subtitle}>Track your development tasks</p>
      </div>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="Add a new task..."
        />
        <button style={styles.addBtn} onClick={addTask}>+ Add</button>
      </div>

      <div style={styles.stats}>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Total</div>
          <div style={styles.statValue}>{tasks.length}</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Done</div>
          <div style={{...styles.statValue, color: '#1D9E75'}}>{completed.length}</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statLabel}>Pending</div>
          <div style={{...styles.statValue, color: '#BA7517'}}>{pending.length}</div>
        </div>
      </div>

      {pending.length > 0 && (
        <>
          <div style={styles.sectionLabel}>Pending</div>
          <div style={styles.taskList}>
            {pending.map(t => (
              <div key={t._id} style={styles.task}>
                <div style={styles.checkbox} onClick={() => toggleTask(t._id, t.done)} />
                <span style={styles.taskTitle}>{t.title}</span>
                <button style={styles.deleteBtn} onClick={() => deleteTask(t._id)}>✕</button>
              </div>
            ))}
          </div>
        </>
      )}

      {completed.length > 0 && (
        <>
          <div style={styles.sectionLabel}>Completed</div>
          <div style={styles.taskList}>
            {completed.map(t => (
              <div key={t._id} style={{...styles.task, opacity: 0.6}}>
                <div style={styles.checkboxDone} onClick={() => toggleTask(t._id, t.done)}>✓</div>
                <span style={styles.taskTitleDone}>{t.title}</span>
                <button style={styles.deleteBtn} onClick={() => deleteTask(t._id)}>✕</button>
              </div>
            ))}
          </div>
        </>
      )}

      {tasks.length === 0 && <div style={styles.empty}>No tasks yet — add one above!</div>}
    </div>
  );
}
