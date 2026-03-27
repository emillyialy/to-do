import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [isLogged, setIsLogged] = useState(() => {
    return localStorage.getItem("isLogged") === "true";
  });

  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem("currentUser");
  });

  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [task, setTask] = useState("");
  const [category, setCategory] = useState("estudo");
  const [filter, setFilter] = useState("todas");

  const [tasks, setTasks] = useState([]);

  // carregar tarefas do usuário
  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`tasks_${currentUser}`);
      setTasks(saved ? JSON.parse(saved) : []);
    }
  }, [currentUser]);

  // salvar tarefas
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`tasks_${currentUser}`, JSON.stringify(tasks));
    }
  }, [tasks, currentUser]);

  function handleRegister() {
    if (!email || !password) return alert("Preencha tudo");

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find((u) => u.email === email)) {
      return alert("Usuário já existe");
    }

    users.push({ email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Conta criada!");
    setIsRegister(false);
    setEmail("");
    setPassword("");
  }

  function handleLogin() {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("isLogged", "true");
      localStorage.setItem("currentUser", email);
      setCurrentUser(email);
      setIsLogged(true);
    } else {
      alert("Credenciais inválidas");
    }
  }

  function logout() {
    localStorage.removeItem("isLogged");
    localStorage.removeItem("currentUser");
    setIsLogged(false);
    setCurrentUser(null);
  }

  function addTask() {
    if (task.trim() === "") return;

    const newTask = {
      id: Date.now(),
      text: task,
      done: false,
      category,
    };

    setTasks([...tasks, newTask]);
    setTask("");
  }

  function toggleTask(id) {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  }

  function deleteTask(id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  const total = tasks.length;
  const completed = tasks.filter((t) => t.done).length;
  const percentage =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  // 🔐 LOGIN / CADASTRO
  if (!isLogged) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white">

        <AnimatePresence mode="wait">
          <motion.div
            key={isRegister ? "register" : "login"}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="w-full max-w-sm p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 shadow-xl"
          >
            <h1 className="text-2xl mb-4 text-center">
              {isRegister ? "Criar Conta" : "Login"}
            </h1>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-3 rounded-lg bg-white/10 border border-white/20"
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg bg-white/10 border border-white/20"
            />

            <button
              onClick={isRegister ? handleRegister : handleLogin}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 p-3 rounded-lg mb-2"
            >
              {isRegister ? "Cadastrar" : "Entrar"}
            </button>

            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setEmail("");
                setPassword("");
              }}
              className="text-sm text-purple-400 w-full"
            >
              {isRegister
                ? "Já tem conta? Entrar"
                : "Criar conta"}
            </button>
          </motion.div>
        </AnimatePresence>

      </div>
    );
  }

  // 🧠 APP PRINCIPAL
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-800 text-white px-4 py-10">

      <button
        onClick={logout}
        className="fixed top-5 right-5 bg-red-500/80 px-4 py-2 rounded-xl"
      >
        Sair
      </button>

      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">Minha Rotina ✨</h1>
        <p className="text-zinc-400">{currentUser}</p>

        {/* progresso */}
        <div className="mt-4 mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Progresso</span>
            <span>{percentage}%</span>
          </div>

          <div className="w-full bg-zinc-800 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* filtros */}
        <div className="flex gap-2 mb-6">
          {["todas", "estudo", "treino", "pessoal"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full ${
                filter === f
                  ? "bg-gradient-to-r from-purple-600 to-pink-500"
                  : "bg-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* input */}
        <div className="flex gap-2 mb-6 bg-white/5 p-3 rounded-xl">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 bg-white/10 rounded-lg"
          >
            <option value="estudo">📚</option>
            <option value="treino">🏋️</option>
            <option value="pessoal">🧠</option>
          </select>

          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Digite uma tarefa..."
            className="flex-1 p-3 bg-white/10 rounded-lg"
          />

          <button
            onClick={addTask}
            className="bg-purple-600 px-5 rounded-lg"
          >
            +
          </button>
        </div>

        {/* lista */}
        <div className="space-y-3">
          <AnimatePresence>
            {tasks
              .filter((t) => filter === "todas" || t.category === filter)
              .map((t) => (
                <motion.div
                  layout
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-between items-center p-4 rounded-xl bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => toggleTask(t.id)}
                    />

                    <div>
                      <p className={t.done ? "line-through" : ""}>
                        {t.text}
                      </p>
                      <span className="text-xs text-purple-300">
                        {t.category}
                      </span>
                    </div>
                  </div>

                  <button onClick={() => deleteTask(t.id)}>✕</button>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

export default App;