import { useParams, useNavigate } from "react-router-dom";

export default function CycleList() {
  const { theme } = useParams();
  const navigate = useNavigate();

  // later we will show many cycles here
  // for now, just a placeholder
  const fakeCycleId = "demo1";

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">{theme} – Cycles</h1>

      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => navigate(`/kids/${theme}/${fakeCycleId}`)}
      >
        Go to customisation (demo)
      </button>
    </div>
  );
}
