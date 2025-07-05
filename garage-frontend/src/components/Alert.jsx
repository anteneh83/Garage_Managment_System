export default function Alert({ type = 'error', message, onClose }) {
  const bgColor = type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';

  return (
    <div className={`rounded-md p-4 mb-4 ${bgColor}`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="font-bold text-xl leading-none">&times;</button>
      </div>
    </div>
  );
}
