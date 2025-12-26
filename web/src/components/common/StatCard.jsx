import { useTheme } from "../../hooks/useTheme";

export const StatCard = ({ title, value, icon, colorClass, bgClass }) => {
  const { colors } = useTheme();

  return (
    <div style={{
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      borderRadius: "0.75rem",
      padding: "1.5rem",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
    }}>
      <div className="flex items-center justify-between">
        <div>
          <p style={{ fontSize: "0.875rem", color: colors.textSecondary, marginBottom: "0.5rem" }}>
            {title}
          </p>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: colors.textPrimary }}>
            {value}
          </p>
        </div>
        <div className={`${bgClass} ${colorClass} w-16 h-16 rounded-full flex items-center justify-center text-3xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
