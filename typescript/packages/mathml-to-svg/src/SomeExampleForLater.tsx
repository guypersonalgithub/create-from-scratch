import { Fragment, JSX } from "react";

type MathMLToSVGProps = {
  mathmlStr: string;
};

const MathMLToSVG = ({ mathmlStr }: MathMLToSVGProps) => {
  const renderNode = (node: Element, x: number = 0, y: number = 50): JSX.Element | null => {
    switch (node.nodeName) {
      case "mi":
      case "mn":
        return (
          <text x={x} y={y} fontSize="20">
            {node.textContent}
          </text>
        );

      case "msup":
        const baseNode = node.children[0];
        const superscriptNode = node.children[1];
        const base = renderNode(baseNode, x, y);
        const baseWidth = 20;
        const superscript = renderNode(superscriptNode, x + baseWidth + 5, y - 15);
        return (
          <Fragment>
            {base}
            {superscript}
          </Fragment>
        );
      default:
        return null;
    }
  };

  const parseMathML = (mathmlString: string): Document => {
    const parser = new DOMParser();
    return parser.parseFromString(mathmlString, "application/xml");
  };

  const mathmlTree = parseMathML(mathmlStr);
  const mathmlRoot = mathmlTree.documentElement;

  return (
    <svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
      {Array.from(mathmlRoot.children).map(
        (node, index) => renderNode(node, index * 30, 50),
      )}
    </svg>
  );
};

export const Test = () => {
  const mathmlString = `
      <math xmlns="http://www.w3.org/1998/Math/MathML">
        <msup>
          <mi>x</mi>
          <mn>2</mn>
        </msup>
      </math>
    `;

  return <MathMLToSVG mathmlStr={mathmlString} />;
};
