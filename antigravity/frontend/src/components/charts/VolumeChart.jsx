import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg shadow-xl">
        <p className="text-zinc-400 text-xs mb-1">Week of {label}</p>
        <p className="text-lime-400 font-bold text-lg">
          {payload[0].value.toLocaleString()} kg
        </p>
      </div>
    );
  }
  return null;
};

const VolumeChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-zinc-500 text-sm">
        Not enough data to display chart
      </div>
    );
  }

  // Format data for Recharts (reverse to show chronological order left to right if needed, assuming backend sends oldest first)
  const chartData = [...data].sort((a, b) => new Date(a.week) - new Date(b.week)).map(item => ({
    ...item,
    weekFormatted: new Date(item.week).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis 
            dataKey="weekFormatted" 
            stroke="#71717a" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            dy={10}
          />
          <YAxis 
            stroke="#71717a" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${value / 1000}k`}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3f3f46', strokeWidth: 1, strokeDasharray: '5 5' }} />
          <Line
            type="monotone"
            dataKey="volume"
            stroke="#a3e635"
            strokeWidth={3}
            dot={{ r: 4, fill: '#a3e635', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#84cc16', stroke: '#18181b', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VolumeChart;
