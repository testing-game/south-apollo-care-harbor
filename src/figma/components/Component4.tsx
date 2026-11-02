import Component1 from "./Component1";

interface Component4Props {
  className?: string;
  text: string;
  variant: string;
  hover: string;
}

const Component4 = ({ className, text, variant, hover }: Component4Props) => {
  const variantBodies = {
    "false/2": (
      <>
        {/* Component 4 */}
        <div className={`flex flex-col items-center relative self-stretch h-[150px] bg-wwwevercarebdcom-athens-gray rounded-xl border border-wwwevercarebdcom-mystic pt-[88px] pr-3 pb-10 pl-3 hover:bg-color-azure-17 transition ${className ?? ""}`.trim()}>
          {/* Text */}
          <p className="text-sm font-normal text-center text-color-azure-5 leading-[1.45] w-fit h-fit">&#123;text&#125;</p>
          {/* Component 1 */}
          <Component1 className="absolute top-[29px] left-[76px]" variant="6" />
        </div>
      </>
    ),
    "false/4": (
      <>
        {/* variant=4,:hover=false */}
        <div className={`flex flex-col items-center relative w-48 h-[150px] bg-wwwevercarebdcom-athens-gray rounded-xl border border-wwwevercarebdcom-mystic pt-[88px] pr-3 pb-5 pl-3 hover:bg-color-azure-17 transition ${className ?? ""}`.trim()}>
          {/* Text */}
          <p className="text-sm font-normal text-center text-color-azure-5 leading-[1.43] w-fit h-fit">Accident &amp; Emergency</p>
          {/* Component 1 */}
          <Component1 className="absolute top-[29px] left-[76px]" variant="10" />
        </div>
      </>
    ),
    "false/6": (
      <>
        {/* variant=6,:hover=false */}
        <div className={`flex flex-col items-center relative w-48 h-[150px] bg-wwwevercarebdcom-athens-gray rounded-xl border border-wwwevercarebdcom-mystic pt-[88px] pr-3 pb-10 pl-3 hover:bg-color-azure-17 transition ${className ?? ""}`.trim()}>
          {/* Text */}
          <p className="text-sm font-normal text-center text-color-azure-5 leading-[1.43] w-fit h-fit">Accident &amp; Emergency</p>
          {/* Component 1 */}
          <Component1 className="absolute top-[29px] left-[76px]" variant="14" />
        </div>
      </>
    ),
    "false/8": (
      <>
        {/* variant=8,:hover=false */}
        <div className={`flex flex-col items-center relative w-48 h-[150px] bg-wwwevercarebdcom-athens-gray rounded-xl border border-wwwevercarebdcom-mystic pt-[88px] pr-3 pb-10 pl-3 hover:bg-color-azure-17 transition ${className ?? ""}`.trim()}>
          {/* Text */}
          <p className="text-sm font-normal text-center text-color-azure-5 leading-[1.43] w-fit h-fit">Accident &amp; Emergency</p>
          {/* Component 1 */}
          <Component1 className="absolute top-[29px] left-[76px]" variant="18" />
        </div>
      </>
    ),
    "false/10": (
      <>
        {/* variant=10,:hover=false */}
        <div className={`flex flex-col items-center relative w-48 h-[150px] bg-wwwevercarebdcom-athens-gray rounded-xl border border-wwwevercarebdcom-mystic pt-[88px] pr-3 pb-5 pl-3 hover:bg-color-azure-17 transition ${className ?? ""}`.trim()}>
          {/* Text */}
          <p className="text-sm font-normal text-center text-color-azure-5 leading-[1.44] w-fit h-fit">Accident &amp; Emergency</p>
          {/* Component 1 */}
          <Component1 className="absolute top-[29px] left-[76px]" variant="22" />
        </div>
      </>
    ),
    "false/12": (
      <>
        {/* variant=12,:hover=false */}
        <div className={`flex flex-col items-center relative w-48 h-[150px] bg-wwwevercarebdcom-athens-gray rounded-xl border border-wwwevercarebdcom-mystic pt-[88px] pr-3 pb-5 pl-3 hover:bg-color-azure-17 transition ${className ?? ""}`.trim()}>
          {/* Text */}
          <p className="text-sm font-normal text-center text-color-azure-5 leading-[1.43] w-fit h-fit">Accident &amp; Emergency</p>
          {/* Component 1 */}
          <Component1 className="absolute top-[29px] left-[76px]" variant="26" />
        </div>
      </>
    ),
    "false/14": (
      <>
        {/* variant=14,:hover=false */}
        <div className={`flex flex-col items-center relative w-48 h-[150px] bg-wwwevercarebdcom-athens-gray rounded-xl border border-wwwevercarebdcom-mystic pt-[88px] pr-3 pb-5 pl-3 hover:bg-color-azure-17 transition ${className ?? ""}`.trim()}>
          {/* Text */}
          <p className="text-sm font-normal text-center text-color-azure-5 leading-[1.43] w-fit h-fit">Accident &amp; Emergency</p>
          {/* Component 1 */}
          <Component1 className="absolute top-[29px] left-[76px]" variant="30" />
        </div>
      </>
    ),
    "false/16": (
      <>
        {/* variant=16,:hover=false */}
        <div className={`flex flex-col items-center relative w-48 h-[150px] bg-wwwevercarebdcom-athens-gray rounded-xl border border-wwwevercarebdcom-mystic pt-[88px] pr-3 pb-10 pl-3 hover:bg-color-azure-17 transition ${className ?? ""}`.trim()}>
          {/* Text */}
          <p className="text-sm font-normal text-center text-color-azure-5 leading-[1.43] w-fit h-fit">Accident &amp; Emergency</p>
          {/* Component 1 */}
          <Component1 className="absolute top-[29px] left-[76px]" variant="34" />
        </div>
      </>
    ),
    "false/18": (
      <>
        {/* variant=18,:hover=false */}
        <div className={`flex flex-col items-center relative w-48 h-[150px] bg-wwwevercarebdcom-athens-gray rounded-xl border border-wwwevercarebdcom-mystic pt-[88px] pr-3 pb-10 pl-3 hover:bg-color-azure-17 transition ${className ?? ""}`.trim()}>
          {/* Text */}
          <p className="text-sm font-normal text-center text-color-azure-5 leading-[1.43] w-fit h-fit">Accident &amp; Emergency</p>
          {/* Component 1 */}
          <Component1 className="absolute top-[29px] left-[76px]" variant="38" />
        </div>
      </>
    ),
    "false/20": (
      <>
        {/* variant=20,:hover=false */}
        <div className={`flex flex-col items-center relative w-48 h-[150px] bg-wwwevercarebdcom-athens-gray rounded-xl border border-wwwevercarebdcom-mystic pt-[88px] pr-3 pb-5 pl-3 hover:bg-color-azure-17 transition ${className ?? ""}`.trim()}>
          {/* Text */}
          <p className="text-sm font-normal text-center text-color-azure-5 leading-[1.43] w-fit h-fit">Accident &amp; Emergency</p>
          {/* Component 1 */}
          <Component1 className="absolute top-[29px] left-[76px]" variant="42" />
        </div>
      </>
    ),
    "false/22": (
      <>
        {/* variant=22,:hover=false */}
        <div className={`flex flex-col items-center relative w-48 h-[150px] bg-wwwevercarebdcom-athens-gray rounded-xl border border-wwwevercarebdcom-mystic pt-[88px] pr-3 pb-5 pl-3 hover:bg-color-azure-17 transition ${className ?? ""}`.trim()}>
          {/* Text */}
          <p className="text-sm font-normal text-center text-color-azure-5 leading-[1.43] w-fit h-fit">Accident &amp; Emergency</p>
          {/* Component 1 */}
          <Component1 className="absolute top-[29px] left-[76px]" variant="46" />
        </div>
      </>
    ),
    "false/24": (
      <>
        {/* variant=24,:hover=false */}
        <div className={`flex flex-col items-center relative w-48 h-[150px] bg-wwwevercarebdcom-athens-gray rounded-xl border border-wwwevercarebdcom-mystic pt-[88px] pr-3 pb-5 pl-3 hover:bg-color-azure-17 transition ${className ?? ""}`.trim()}>
          {/* Text */}
          <p className="text-sm font-normal text-center text-color-azure-5 leading-[1.43] w-fit h-fit">Accident &amp; Emergency</p>
          {/* Component 1 */}
          <Component1 className="absolute top-[29px] left-[76px]" variant="50" />
        </div>
      </>
    ),
    "false/26": (
      <>
        {/* variant=26,:hover=false */}
        <div className={`flex flex-col items-center relative w-48 h-[150px] bg-wwwevercarebdcom-athens-gray rounded-xl border border-wwwevercarebdcom-mystic pt-[88px] pr-3 pb-5 pl-3 hover:bg-color-azure-17 transition ${className ?? ""}`.trim()}>
          {/* Text */}
          <p className="text-sm font-normal text-center text-color-azure-5 leading-[1.43] w-fit h-fit">Accident &amp; Emergency</p>
          {/* Component 1 */}
          <Component1 className="absolute top-[29px] left-[76px]" variant="54" />
        </div>
      </>
    ),
    "false/28": (
      <>
        {/* variant=28,:hover=false */}
        <div className={`flex flex-col items-center relative w-48 h-[150px] bg-wwwevercarebdcom-athens-gray rounded-xl border border-wwwevercarebdcom-mystic pt-[88px] pr-3 pb-10 pl-3 hover:bg-color-azure-17 transition ${className ?? ""}`.trim()}>
          {/* Text */}
          <p className="text-sm font-normal text-center text-color-azure-5 leading-[1.43] w-fit h-fit">Accident &amp; Emergency</p>
          {/* Component 1 */}
          <Component1 className="absolute top-[29px] left-[76px]" variant="58" />
        </div>
      </>
    ),
    "false/30": (
      <>
        {/* variant=30,:hover=false */}
        <div className={`flex flex-col items-center relative w-48 h-[150px] bg-wwwevercarebdcom-athens-gray rounded-xl border border-wwwevercarebdcom-mystic pt-[88px] pr-3 pb-5 pl-3 hover:bg-color-azure-17 transition ${className ?? ""}`.trim()}>
          {/* Text */}
          <p className="text-sm font-normal text-center text-color-azure-5 leading-normal w-fit h-fit">Accident &amp; Emergency</p>
          {/* Component 1 */}
          <Component1 className="absolute top-[29px] left-[76px]" variant="62" />
        </div>
      </>
    )
  };
  const variantKey = [hover, variant].map(String).join("/");
  const defaultKey = "false/2";
  return variantBodies[variantKey] ?? variantBodies[defaultKey];
};

export default Component4;
