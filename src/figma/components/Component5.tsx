import Component4 from "./Component4";

interface Component5Props {
  className?: string;
  variant: string;
  hover: string;
}

const Component5 = ({ className, variant, hover }: Component5Props) => {
  const variantBodies = {
    "false/1": (
      <>
        {/* Component 5 */}
        <div className={`flex flex-col items-start w-full h-fit ${className ?? ""}`.trim()}>
          {/* Component 4 */}
          <Component4 text="Accident & Emergency" variant="2" hover="false" />
        </div>
      </>
    ),
    "false/2": (
      <>
        {/* variant=2,:hover=false */}
        <div className={`flex flex-col items-start w-48 h-fit ${className ?? ""}`.trim()}>
          {/* Component 4 */}
          <Component4 text="Anesthesia and Pain
Medicine" variant="4" hover="false" />
        </div>
      </>
    ),
    "false/3": (
      <>
        {/* variant=3,:hover=false */}
        <div className={`flex flex-col items-start w-48 h-fit ${className ?? ""}`.trim()}>
          {/* Component 4 */}
          <Component4 text="Cancer Care Centre" variant="6" hover="false" />
        </div>
      </>
    ),
    "false/4": (
      <>
        {/* variant=4,:hover=false */}
        <div className={`flex flex-col items-start w-48 h-fit ${className ?? ""}`.trim()}>
          {/* Component 4 */}
          <Component4 text="Cardiology Care Centre" variant="8" hover="false" />
        </div>
      </>
    ),
    "false/5": (
      <>
        {/* variant=5,:hover=false */}
        <div className={`flex flex-col items-start w-48 h-fit ${className ?? ""}`.trim()}>
          {/* Component 4 */}
          <Component4 text="Cardiothoracic &
Vascular Surgery" variant="10" hover="false" />
        </div>
      </>
    ),
    "false/6": (
      <>
        {/* variant=6,:hover=false */}
        <div className={`flex flex-col items-start w-48 h-fit ${className ?? ""}`.trim()}>
          {/* Component 4 */}
          <Component4 text="Cardiothoracic
Anaesthesia" variant="12" hover="false" />
        </div>
      </>
    ),
    "false/7": (
      <>
        {/* variant=7,:hover=false */}
        <div className={`flex flex-col items-start w-48 h-fit ${className ?? ""}`.trim()}>
          {/* Component 4 */}
          <Component4 text="Child Development
Centre" variant="14" hover="false" />
        </div>
      </>
    ),
    "false/8": (
      <>
        {/* variant=8,:hover=false */}
        <div className={`flex flex-col items-start w-48 h-fit ${className ?? ""}`.trim()}>
          {/* Component 4 */}
          <Component4 text="Counselling Centre" variant="16" hover="false" />
        </div>
      </>
    ),
    "false/9": (
      <>
        {/* variant=9,:hover=false */}
        <div className={`flex flex-col items-start w-48 h-fit ${className ?? ""}`.trim()}>
          {/* Component 4 */}
          <Component4 text="Critical Care Units" variant="18" hover="false" />
        </div>
      </>
    ),
    "false/10": (
      <>
        {/* variant=10,:hover=false */}
        <div className={`flex flex-col items-start w-48 h-fit ${className ?? ""}`.trim()}>
          {/* Component 4 */}
          <Component4 text="Dental & Maxillofacial
Surgery" variant="20" hover="false" />
        </div>
      </>
    ),
    "false/11": (
      <>
        {/* variant=11,:hover=false */}
        <div className={`flex flex-col items-start w-48 h-fit ${className ?? ""}`.trim()}>
          {/* Component 4 */}
          <Component4 text="Dermatology &
Venereology" variant="22" hover="false" />
        </div>
      </>
    ),
    "false/12": (
      <>
        {/* variant=12,:hover=false */}
        <div className={`flex flex-col items-start w-48 h-fit ${className ?? ""}`.trim()}>
          {/* Component 4 */}
          <Component4 text="Diabetology &
Endocrinology" variant="24" hover="false" />
        </div>
      </>
    ),
    "false/13": (
      <>
        {/* variant=13,:hover=false */}
        <div className={`flex flex-col items-start w-48 h-fit ${className ?? ""}`.trim()}>
          {/* Component 4 */}
          <Component4 text="Diagnostic &
Interventional Radiology" variant="26" hover="false" />
        </div>
      </>
    ),
    "false/14": (
      <>
        {/* variant=14,:hover=false */}
        <div className={`flex flex-col items-start w-48 h-fit ${className ?? ""}`.trim()}>
          {/* Component 4 */}
          <Component4 text="Dietetics & Nutrition" variant="28" hover="false" />
        </div>
      </>
    ),
    "false/15": (
      <>
        {/* variant=15,:hover=false */}
        <div className={`flex flex-col items-start w-48 h-fit ${className ?? ""}`.trim()}>
          {/* Component 4 */}
          <Component4 text="ENT & Head Neck
Surgery" variant="30" hover="false" />
        </div>
      </>
    )
  };
  const variantKey = [hover, variant].map(String).join("/");
  const defaultKey = "false/1";
  return variantBodies[variantKey] ?? variantBodies[defaultKey];
};

export default Component5;
