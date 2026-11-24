const compact = new Intl.NumberFormat('en-NG', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const chartWidth = 720
const chartHeight = 240
const padding = { top: 16, right: 16, bottom: 36, left: 62 }
const innerWidth = chartWidth - padding.left - padding.right
const innerHeight = chartHeight - padding.top - padding.bottom

function getTopValue(values) {
  const max = Math.max(...values)
  if (max <= 0) return 1000
  const magnitude = 10 ** Math.floor(Math.log10(max))
  const step = magnitude / 2
  return Math.ceil(max / step) * step
}

export default function SalesChart({ points }) {
  const values = points.map((point) => point.value)
  const top = getTopValue(values)
  const bottom = padding.top + innerHeight
  const xFor = (index) =>
    padding.left +
    (points.length === 1 ? innerWidth / 2 : (index / (points.length - 1)) * innerWidth)
  const yFor = (value) => bottom - (value / top) * innerHeight
  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${xFor(index)} ${yFor(point.value)}`)
    .join(' ')
  const areaPath = `${linePath} L ${xFor(points.length - 1)} ${bottom} L ${xFor(0)} ${bottom} Z`
  const labelStep = Math.max(1, Math.ceil(points.length / 8))

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="h-auto w-full"
        role="img"
        aria-label="Sales trend line chart"
      >
        {[0, 1, 2, 3, 4].map((step) => {
          const y = padding.top + (innerHeight / 4) * step
          const value = top - (top / 4) * step
          return (
            <g key={step}>
              <line
                x1={padding.left}
                x2={chartWidth - padding.right}
                y1={y}
                y2={y}
                stroke="#e8e8ef"
                strokeWidth="1"
              />
              <text
                x={padding.left - 8}
                y={y + 4}
                textAnchor="end"
                fontSize="10"
                fill="#7a7a8c"
              >
                ₦{compact.format(value)}
              </text>
            </g>
          )
        })}

        <path d={areaPath} fill="rgba(0, 112, 240, 0.12)" />
        <path
          d={linePath}
          fill="none"
          stroke="#0070f0"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />

        {points.map((point, index) => (
          <g key={`${point.label}-${index}`}>
            <circle
              cx={xFor(index)}
              cy={yFor(point.value)}
              r="4"
              fill="#ffffff"
              stroke="#0070f0"
              strokeWidth="2"
            />
            <title>{`${point.label}: ₦${point.value.toLocaleString('en-NG')}`}</title>
            {(index % labelStep === 0 || index === points.length - 1) && (
              <text
                x={xFor(index)}
                y={chartHeight - 10}
                textAnchor="middle"
                fontSize="10"
                fill="#7a7a8c"
              >
                {point.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}
