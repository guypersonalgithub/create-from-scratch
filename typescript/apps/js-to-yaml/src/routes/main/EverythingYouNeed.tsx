import { DisplayCard } from "../../styledComponents";
import { Bidirectional, Download, Thunder } from "@packages/icons";

type EverythingYouNeedProps = {
  isDesktop: boolean;
};

export const EverythingYouNeed = ({ isDesktop }: EverythingYouNeedProps) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "fit-content",
          fontWeight: 500,
          borderRadius: "100px",
          whiteSpace: "nowrap",
          border: "1px solid var(--theme-border)",
          transition: "var(--theme-transition)",
          paddingLeft: "8px",
          paddingRight: "8px",
          paddingTop: "4px",
          paddingBottom: "4px",
          margin: "0 auto",
          fontSize: "12px",
          color: "var(--theme-thirdColor)",
        }}
      >
        Powerful Features
      </div>
      <div style={{ fontSize: "50px", fontWeight: "bold", textAlign: "center" }}>
        Everything You Need
      </div>
      <div
        style={{
          color: "var(--theme-thirdColor)",
          fontSize: "20px",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Our JavaScript to YAML converter comes packed with features to make your development
        workflow smoother.
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: isDesktop ? "row" : "column",
          gap: "30px",
          justifyContent: "space-between",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <DisplayCard
          icon={<Thunder size={24} />}
          title="Lightning Fast"
          content="Convert complex JavaScript objects to YAML in mere moments."
        />
        <DisplayCard
          icon={<Bidirectional size={24} />}
          title="Bidirectional"
          content="Convert from JavaScript to YAML and back again with perfect fidelity."
        />
        <DisplayCard
          icon={<Download size={24} />}
          title="Easy to Use"
          content="Download your converted YAML files or copy directly to clipboard with one click."
        />
      </div>
    </div>
  );
};
