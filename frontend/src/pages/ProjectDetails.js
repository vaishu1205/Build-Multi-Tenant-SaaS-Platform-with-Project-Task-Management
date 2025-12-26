import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import Navbar from "../components/Navbar";

const columns = ["todo", "in_progress", "completed"];

export default function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");

  const tenantId = localStorage.getItem("tenantId");

  const loadData = useCallback(async () => {
    const meRes = await api("/auth/me");
    setMe(meRes.data);

    const projectsRes = await api("/api/projects");
    setProject(projectsRes.data.projects.find((p) => p.id === projectId));

    const tasksRes = await api(`/api/projects/${projectId}/tasks`);
    setTasks(tasksRes.data.tasks);

    if (meRes.data.role === "tenant_admin") {
      const usersRes = await api(`/api/tenants/${tenantId}/users`);
      setUsers(usersRes.data.users);
    }

    setLoading(false);
  }, [projectId, tenantId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addTask = async () => {
    await api(`/api/projects/${projectId}/tasks`, {
      method: "POST",
      body: JSON.stringify({
        title,
        priority,
        assignedTo: assignedTo || null,
        dueDate: dueDate || null,
      }),
    });

    setTitle("");
    setAssignedTo("");
    setDueDate("");
    loadData();
  };

  const updateStatus = async (taskId, status) => {
    await api(`/api/tasks/${taskId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    loadData();
  };

  if (loading) return <p style={{ padding: 32 }}>Loading…</p>;
  if (!project) return <p>Project not found</p>;

  return (
    <>
      <Navbar />
      <div className="page" style={{ padding: 32 }}>
        <h2>{project.name}</h2>
        {project.description && (
          <p
            style={{
              marginTop: 6,
              marginBottom: 20,
              color: "var(--muted)",
              fontSize: 14,
              maxWidth: 700,
            }}
          >
            {project.description}
          </p>
        )}

        {me?.role === "tenant_admin" && (
          <div
            style={{
              maxWidth: 420,
              background: "var(--panel)",
              padding: 16,
              borderRadius: 8,
              border: "1px solid var(--border)",
              marginTop: 20,
            }}
          >
            <h4>Add Task</h4>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Assign user</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.full_name}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <button onClick={addTask}>Create Task</button>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            marginTop: 32,
          }}
        >
          {columns.map((col) => (
            <div
              key={col}
              style={{
                background: "var(--panel)",
                border: "1px solid var(--border)",
                padding: 16,
                borderRadius: 8,
              }}
            >
              <h4 style={{ marginBottom: 12 }}>{col.toUpperCase()}</h4>

              {tasks
                .filter((t) => t.status === col)
                .map((task) => (
                  <div
                    key={task.id}
                    style={{
                      background: "#020617",
                      padding: 12,
                      borderRadius: 6,
                      marginBottom: 12,
                    }}
                  >
                    <strong>{task.title}</strong>
                    <p style={{ fontSize: 12 }}>Priority: {task.priority}</p>

                    {task.full_name && (
                      <p style={{ fontSize: 12 }}>
                        Assigned: <strong>{task.full_name}</strong>
                      </p>
                    )}

                    {task.due_date && (
                      <p style={{ fontSize: 12 }}>Due: {task.due_date}</p>
                    )}

                    <select
                      value={task.status}
                      onChange={(e) => updateStatus(task.id, e.target.value)}
                    >
                      <option value="todo">Todo</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
