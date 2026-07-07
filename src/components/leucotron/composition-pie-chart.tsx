import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { CompositionSlice } from "./composition-chart";

/**
 * Implementação Recharts do donut de composição. Fica em arquivo
 * separado para que o `React.lazy` do wrapper isole o bundle do
 * `recharts` em um chunk carregado apenas no browser.
 */
const PALETTE = ["#00C2D1", "#0E2A5C", "#3B82F6", "#00E0FF", "#1E40AF"];

export default function CompositionPieChart({
  data,
  formatBRL,
}: {
  data: CompositionSlice[];
  formatBRL: (v: number) => string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={120}
          paddingAngle={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v: number) => formatBRL(v)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
