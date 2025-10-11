export default function ReactFlowType({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  return (
    <div
      style={{
        width: width,
        height: height,
        borderRadius: "50%",
        background: "#4f46e5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: "bold",
        border: "2px solid #1e1b4b",
      }}
    ></div>
  );
}
