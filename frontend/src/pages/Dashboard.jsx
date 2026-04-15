import { useEffect, useMemo, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const initialTask = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
};

export default function Dashboard() {
  const { profile, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [taskForm, setTaskForm] = useState(initialTask);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ status: '', priority: '' });

  const loadTasks = async () => {
    const res = await client.get('/tasks', { params: filter });
    setTasks(res.data.data.items);
  };

  useEffect(() => {
    loadTasks().catch(() => setError('Failed to load tasks'));
  }, [filter.status, filter.priority]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((task) => task.status === 'done').length;
    return { total, done, progress: total ? Math.round((done / total) * 100) : 0 };
  }, [tasks]);

  const submitTask = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      if (editingId) {
        await client.patch(`/tasks/${editingId}`, taskForm);
        setMessage('Task updated successfully');
      } else {
        await client.post('/tasks', taskForm);
        setMessage('Task created successfully');
      }

      setTaskForm(initialTask);
      setEditingId(null);
      await loadTasks();
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to save task');
    }
  };

  const onEdit = (task) => {
    setEditingId(task._id);
    setTaskForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
    });
  };

  const onDelete = async (id) => {
    try {
      await client.delete(`/tasks/${id}`);
      setMessage('Task deleted');
      await loadTasks();
    } catch {
      setError('Failed to delete task');
    }
  };

  return (
    <div className="dashboard">
      <header className="topbar card">
        <div>
          <h1>Task Command Center</h1>
          <p>
            {profile?.name} ({profile?.role})
          </p>
        </div>
        <button onClick={logout}>Logout</button>
      </header>

      <section className="stats">
        <div className="card">
          <h3>Total tasks</h3>
          <p>{stats.total}</p>
        </div>
        <div className="card">
          <h3>Completed</h3>
          <p>{stats.done}</p>
        </div>
        <div className="card">
          <h3>Progress</h3>
          <p>{stats.progress}%</p>
        </div>
      </section>

      <section className="grid-two">
        <div className="card">
          <h2>{editingId ? 'Edit task' : 'Create task'}</h2>
          <form onSubmit={submitTask} className="form-grid">
            <input
              placeholder="Task title"
              value={taskForm.title}
              onChange={(e) => setTaskForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
            <textarea
              placeholder="Description"
              value={taskForm.description}
              onChange={(e) =>
                setTaskForm((p) => ({ ...p, description: e.target.value }))
              }
            />
            <select
              value={taskForm.status}
              onChange={(e) => setTaskForm((p) => ({ ...p, status: e.target.value }))}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <select
              value={taskForm.priority}
              onChange={(e) => setTaskForm((p) => ({ ...p, priority: e.target.value }))}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button type="submit">{editingId ? 'Update' : 'Create'} Task</button>
          </form>
        </div>

        <div className="card">
          <h2>Filters</h2>
          <div className="form-grid">
            <select
              value={filter.status}
              onChange={(e) => setFilter((p) => ({ ...p, status: e.target.value }))}
            >
              <option value="">All statuses</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <select
              value={filter.priority}
              onChange={(e) => setFilter((p) => ({ ...p, priority: e.target.value }))}
            >
              <option value="">All priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </section>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <section className="card">
        <h2>Your tasks</h2>
        <div className="task-list">
          {tasks.map((task) => (
            <article key={task._id} className="task-item">
              <div>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <small>
                  {task.status} • {task.priority}
                </small>
              </div>
              <div className="actions">
                <button onClick={() => onEdit(task)}>Edit</button>
                <button onClick={() => onDelete(task._id)} className="danger">
                  Delete
                </button>
              </div>
            </article>
          ))}
          {!tasks.length && <p>No tasks yet. Create your first task.</p>}
        </div>
      </section>
    </div>
  );
}
