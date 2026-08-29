export default function ProductCard({ image, title, subtitle, price, badge, onDelete }) {
  return (
    <div className="card group relative overflow-hidden p-0">
      <div className="aspect-[4/3] bg-beige overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-soft text-sm">
            No photo
          </div>
        )}
      </div>

      {badge && (
        <span className="absolute top-3 left-3 bg-white/90 text-clay text-xs font-medium px-2 py-1 rounded-card">
          {badge}
        </span>
      )}

      <div className="p-4">
        <h3 className="font-display text-xl leading-tight">{title}</h3>
        {subtitle && <p className="text-sm text-ink-soft mt-1">{subtitle}</p>}

        <div className="flex items-center justify-between mt-3">
          {price && <span className="font-body font-semibold text-clay">{price}</span>}
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-xs text-red-600 hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
