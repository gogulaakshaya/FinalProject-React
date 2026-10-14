import { useState } from "react";

export default function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function submit(e) { e.preventDefault(); onLogin?.({ email, password }); }
  return <section className="form-box">
    <h2>Login</h2>
    <form onSubmit={submit}>
      <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
    <p>New user? <button type="button" onClick={onRegister}>Register</button></p>
  </section>;
}
