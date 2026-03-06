export const DeviceFrame: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dotStyle = {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.3)",
  };

  return (
    <div
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={dotStyle} />
        <div style={dotStyle} />
        <div style={dotStyle} />
        <div
          style={{
            marginLeft: 12,
            flex: 1,
            height: 24,
            borderRadius: 6,
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
        />
      </div>
      <div>{children}</div>
    </div>
  );
};
