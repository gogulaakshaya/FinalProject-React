import { useState } from "react";

export default function Register({ onRegister, onLogin }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  function submit(e) {
    e.preventDefault();
    onRegister?.({ name: form.username, email: form.email, password: form.password, role: "user" });
  }
  return <section className="form-box">
    <h2>Register</h2>
    <form onSubmit={submit}>
      <input placeholder="Username / Full name" value={form.username} onChange={e => setForm({...form, username:e.target.value})} required />
      <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} required />
      <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} required />
      <button type="submit">Register</button>
    </form>
    <p>Already registered? <button type="button" onClick={onLogin}>Login</button></p>
  </section>;
}
