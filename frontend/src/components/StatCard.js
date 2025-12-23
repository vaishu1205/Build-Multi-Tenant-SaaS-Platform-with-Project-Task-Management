export default function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "var(--panel)",
        padding: 20,
        borderRadius: 8,
        border: "1px solid var(--border)",
      }}
    >
      <p style={{ color: "var(--muted)", fontSize: 13 }}>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}
