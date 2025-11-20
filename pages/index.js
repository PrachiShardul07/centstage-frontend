import useSWR from 'swr';
import { useState } from 'react';

const fetcher = (url) => fetch(url).then(r => r.json());
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function Home() {
  const { data: tasks, mutate } = useSWR(API_BASE + '/tasks', fetcher);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  async function addTask(e) {
    e.preventDefault();
    if (!title) return;
    await fetch(API_BASE + '/tasks', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ title, description: desc })
    });
    setTitle(''); setDesc('');
    mutate();
  }

  async function toggle(id) {
    await fetch(API_BASE + '/tasks/' + id + '/toggle', { method: 'PATCH' });
    mutate();
  }

  async function del(id) {
    await fetch(API_BASE + '/tasks/' + id, { method: 'DELETE' });
    mutate();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">CentStage — Task Manager</h1>

        <form onSubmit={addTask} className="mb-4">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="border p-2 mr-2" />
          <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" className="border p-2 mr-2" />
          <button className="bg-blue-600 text-white px-3 py-2 rounded">Add</button>
        </form>

        <div>
          {!tasks && <div>Loading...</div>}
          {tasks && tasks.length === 0 && <div className="text-gray-500">No tasks yet</div>}
          <ul>
            {tasks && tasks.map(t => (
              <li key={t.id} className="flex items-center justify-between border-b py-2">
                <div>
                  <div className={t.status === 'done' ? 'line-through text-gray-500' : ''}><strong>{t.title}</strong></div>
                  {t.description && <div className="text-sm text-gray-600">{t.description}</div>}
                </div>
                <div className="space-x-2">
                  <button onClick={()=>toggle(t.id)} className="px-2 py-1 border rounded">{t.status === 'done' ? 'Undo' : 'Done'}</button>
                  <button onClick={()=>del(t.id)} className="px-2 py-1 border rounded">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
