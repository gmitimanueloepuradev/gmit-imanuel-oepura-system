import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const RADIAN = Math.PI / 180;
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize="12"
    >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

export default function StatPieChart({
  title = "Statistik Jenis Kelamin",
  data = [
    { name: "Pria", value: 400 },
    { name: "Wanita", value: 300 },
  ],
  size = "normal", // "small", "normal", "large"
}) {
  // Dynamic sizing based on size prop
  const getSizing = () => {
    switch (size) {
      case "small":
        return {
          titleClass: "text-base font-medium mb-1",
          outerRadius: 50,
          legendHeight: 20,
          fontSize: "16px",
        };
      case "large":
        return {
          titleClass: "text-2xl font-medium mb-2",
          outerRadius: 100,
          legendHeight: 40,
          fontSize: "20px",
        };
      default: // normal
        return {
          titleClass: "text-lg font-medium mb-2",
          outerRadius: 65,
          legendHeight: 28,
          fontSize: "18px",
        };
    }
  };

  const sizing = getSizing();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h2 className={`text-center text-white dark:text-gray-200 ${sizing.titleClass} mb-1`}>{title}</h2>

      <div className="flex flex-col items-center">
        <div style={{ width: sizing.outerRadius * 2 + 20, height: sizing.outerRadius * 2 + 20 }}>
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={sizing.outerRadius}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-1 flex flex-wrap justify-center gap-x-2 gap-y-1 text-sm">
          {data.map((entry, index) => (
            <div
              key={entry.name}
              className="flex items-center"
            >
              <div
                className="w-2.5 h-2.5 mr-1.5"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="text-white dark:text-gray-200" style={{ fontSize: sizing.fontSize }}>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
