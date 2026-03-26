import { useState, useEffect } from "react"; 
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [task, setTask] = useState("");
  const [category, setCategory] = useState("estudo");
  const [filter, setFilter] = useState("todas");
  const [tasks, setTasks] = useState(() => {
  const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    if (task.trim() === "") return;

    const newTask = {
      id: Date.now(),
      text: task,
      done: false,
      category: category,
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

 return (
  <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white px-4 py-10">

    <div className="max-w-3xl mx-auto">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Minha Rotina</h1>
        <p className="text-zinc-400">Organize seu dia com estilo</p>

        {/* PROGRESSO */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progresso</span>
            <span>{percentage}%</span>
          </div>

          <div className="w-full bg-zinc-800 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* FILTROS */}
      <div className="flex gap-2 mb-6">
        {["todas", "estudo", "treino", "pessoal"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm transition ${
              filter === f
                ? "bg-purple-600"
                : "bg-zinc-800 hover:bg-zinc-700"
            }`}
          >
            {f === "todas" && "Todas"}
            {f === "estudo" && "📚 Estudo"}
            {f === "treino" && "🏋️ Treino"}
            {f === "pessoal" && "🧠 Pessoal"}
          </button>
        ))}
      </div>

      {/* INPUT */}
      <div className="flex gap-2 mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 rounded-lg bg-zinc-800 border border-zinc-700"
        >
          <option value="estudo">📚</option>
          <option value="treino">🏋️</option>
          <option value="pessoal">🧠</option>
        </select>

        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Digite uma tarefa..."
          className="flex-1 p-3 rounded-lg bg-zinc-800 border border-zinc-700 outline-none"
        />

        <button
          onClick={addTask}
          className="bg-purple-600 px-5 rounded-lg hover:bg-purple-700 transition"
        >
          +
        </button>
      </div>

      {/* LISTA */}
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
                className="flex justify-between items-center p-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleTask(t.id)}
                    className="accent-purple-500 w-4 h-4"
                  />

                  <div>
                    <p
                      className={`${
                        t.done ? "line-through text-zinc-500" : ""
                      }`}
                    >
                      {t.text}
                    </p>
                    <span className="text-xs text-purple-400">
                      {t.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(t.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

    </div>
  </div>
);
}

export default App;