import TrendIcon from './TrendIcon'

const CaseCard = ({ item, onOpen }) => {
  return (
    <button
      onClick={onOpen}
      className="text-left bg-white border border-gray-200 rounded-xl p-5 hover:border-primary transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
          <p className="text-sm text-gray-600">{item.disease}</p>
        </div>
        <div className="text-right">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-gray-300 text-sm text-gray-800">
            <span className="font-medium">{item.lastResult || 'No result'}</span>
            <TrendIcon trend={item.trend} />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Updated {item.lastUpdatedAt ? new Date(item.lastUpdatedAt).toLocaleDateString() : '-'}
          </p>
        </div>
      </div>
    </button>
  )
}

export default CaseCard


