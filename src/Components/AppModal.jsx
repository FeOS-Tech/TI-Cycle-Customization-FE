export default function AppModal({ open, title, message, actions = [], onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-5 w-full max-w-sm shadow-xl">

        {title && (
          <h2 className="text-lg font-semibold mb-2">
            {title}
          </h2>
        )}

        {message && (
          <p className="text-sm text-gray-600 mb-4">
            {message}
          </p>
        )}

        <div className="space-y-2">
          {actions.map((btn, i) => (
            <button
              key={i}
              onClick={btn.onClick}
              className={`w-full py-2 rounded-lg ${btn.className || "bg-gray-200"}`}
            >
              {btn.label}
            </button>
          ))}

          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
