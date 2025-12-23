import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import Navbar from "../components/Navbar";

const columns = ["todo", "in_progress", "completed"];

export default function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api("/projects").then((res) => {
      const p = res.data.projects.find((x) => x.id === projectId);
      setProject(p);
    });

    api(`/projects/${projectId}/tasks`).then((res) => setTasks(res.data.tasks));
  }, [projectId]);

  if (!project) return null;

  return (
    <>
      <Navbar />
      <div style={{ padding: 32 }}>
        <h2>{project.name}</h2>
        <p style={{ color: "var(--muted)" }}>{project.description}</p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginTop: 32,
          }}
        >
          {columns.map((col) => (
            <div
              key={col}
              style={{
                background: "var(--panel)",
                borderRadius: 8,
                padding: 16,
                minHeight: 300,
              }}
            >
              <h4 style={{ textTransform: "capitalize" }}>
                {col.replace("_", " ")}
              </h4>

              {tasks
                .filter((t) => t.status === col)
                .map((task) => (
                  <div
                    key={task.id}
                    style={{
                      background: "#020617",
                      padding: 12,
                      borderRadius: 6,
                      marginTop: 12,
                    }}
                  >
                    <strong>{task.title}</strong>
                    <p style={{ fontSize: 12, color: "var(--muted)" }}>
                      {task.priority}
                    </p>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
