// @ts-nocheck -- generated Figma export
import Component1 from "./Component1";
import Component14 from "./Component14";

interface Component15Props {
  className?: string;
  variant: string;
  hover: string;
}

const Component15 = ({ className, variant, hover }: Component15Props) => {
  const variantBodies = {
    "false/1": (
      <>
        {/* Component 15 */}
        <div className={`flex flex-col items-start w-fit h-fit ${className ?? ""}`.trim()}>
          {/* Component 14 */}
          <Component14 text="Specialities" variant="2" hover="false" />
        </div>
      </>
    )
  };
  const variantKey = [hover, variant].map(String).join("/");
  const defaultKey = "false/1";
  return variantBodies[variantKey] ?? variantBodies[defaultKey];
};

export default Component15;
