import { useTheme } from "../../hooks/useTheme";

export const ColorPicker = ({ label, colorKey, description, previewColors, handleColorChange }) => {
  const { colors } = useTheme();

  return (
    <div style={{
      padding: "1rem",
      backgroundColor: colors.background,
      borderRadius: "0.5rem",
      border: `1px solid ${colors.border}`
    }}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <label style={{ fontSize: "0.875rem", fontWeight: "600", color: colors.textPrimary }}>
            {label}
          </label>
          {description && (
            <p style={{ fontSize: "0.75rem", color: colors.textSecondary, marginTop: "0.25rem" }}>
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={previewColors[colorKey] || "#000000"}
            onChange={(e) => handleColorChange(colorKey, e.target.value)}
            style={{
              width: "60px",
              height: "40px",
              border: `2px solid ${colors.border}`,
              borderRadius: "0.5rem",
              cursor: "pointer"
            }}
          />
          <input
            type="text"
            value={previewColors[colorKey] || "#000000"}
            onChange={(e) => handleColorChange(colorKey, e.target.value)}
            style={{
              width: "100px",
              padding: "0.5rem",
              border: `1px solid ${colors.border}`,
              borderRadius: "0.375rem",
              backgroundColor: colors.surface,
              color: colors.textPrimary,
              fontSize: "0.875rem",
              fontFamily: "monospace"
            }}
          />
        </div>
      </div>
    </div>
  );
};
