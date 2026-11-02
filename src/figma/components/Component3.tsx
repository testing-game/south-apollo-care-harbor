import findADoctor from "../assets/find-a-doctor.png";
import requestAnAppointment from "../assets/request-an-appointment.png";
import onlineReport from "../assets/online-report.png";
import teleOnline from "../assets/tele-online.png";
import patientVisitorsGuide from "../assets/patient-visitors-guide.png";

interface Component3Props {
  className?: string;
  text: string;
  variant: string;
  hover: string;
}

const Component3 = ({ className, text, variant, hover }: Component3Props) => {
  const variantBodies = {
    "false/1": (
      <>
        {/* Component 3 */}
        <div className={`flex flex-col items-start w-fit self-stretch bg-wwwevercarebdcom-athens-gray border border-wwwevercarebdcom-big-stone-10/10 py-6 px-3 hover:bg-color-azure-17 transition ${className ?? ""}`.trim()}>
          {/* Container */}
          <div className="flex flex-row gap-item-spacing-s items-center w-fit h-fit px-2">
            {/* Heading 4 */}
            <div className="flex flex-col items-start w-40 h-fit">
              {/* Text */}
              <p className="text-lg font-bold text-left text-color-azure-17 leading-[1.11] w-fit h-fit">&#123;text&#125;</p>
            </div>
            {/* Background */}
            <div className="flex flex-row justify-center items-center w-14 h-14 bg-color-azure-17 rounded-corner-radius-9999">
              {/* FIND A DOCTOR */}
              <img className="w-9 h-9" src={findADoctor} alt="FIND A DOCTOR" />
            </div>
          </div>
        </div>
      </>
    ),
    "false/2": (
      <>
        {/* variant=2,:hover=false */}
        <div className={`flex flex-col items-start w-fit h-[105px] bg-tw-ring-offset-color border border-wwwevercarebdcom-big-stone-10/10 py-6 px-3 hover:bg-color-azure-17 transition ${className ?? ""}`.trim()}>
          {/* Container */}
          <div className="flex flex-row gap-item-spacing-s items-center w-fit h-fit px-2">
            {/* Heading 4 */}
            <div className="flex flex-col items-start w-40 h-fit">
              {/* Text */}
              <p className="text-lg font-bold text-left text-color-azure-17 leading-[1.16] w-fit h-fit">FIND A DOCTOR</p>
            </div>
            {/* Background */}
            <div className="flex flex-row justify-center items-center w-14 h-14 bg-color-azure-17 rounded-corner-radius-9999">
              {/* REQUEST AN APPOINTMENT */}
              <img className="w-9 h-9" src={requestAnAppointment} alt="REQUEST AN APPOINTMENT" />
            </div>
          </div>
        </div>
      </>
    ),
    "false/3": (
      <>
        {/* variant=3,:hover=false */}
        <div className={`flex flex-col items-start w-fit h-[105px] bg-tw-ring-offset-color border border-wwwevercarebdcom-big-stone-10/10 py-6 px-3 hover:bg-color-azure-17 transition ${className ?? ""}`.trim()}>
          {/* Container */}
          <div className="flex flex-row gap-item-spacing-s items-center w-fit h-fit px-2">
            {/* Heading 4 */}
            <div className="flex flex-col items-start w-40 h-fit">
              {/* Text */}
              <p className="text-lg font-bold text-left text-color-azure-17 leading-[1.13] w-fit h-fit">FIND A DOCTOR</p>
            </div>
            {/* Background */}
            <div className="flex flex-row justify-center items-center w-14 h-14 bg-color-azure-17 rounded-corner-radius-9999">
              {/* ONLINE REPORT */}
              <img className="w-9 h-9" src={onlineReport} alt="ONLINE REPORT" />
            </div>
          </div>
        </div>
      </>
    ),
    "false/4": (
      <>
        {/* variant=4,:hover=false */}
        <div className={`flex flex-col items-start w-fit h-[105px] bg-tw-ring-offset-color border border-wwwevercarebdcom-big-stone-10/10 py-6 px-3 hover:bg-color-azure-17 transition ${className ?? ""}`.trim()}>
          {/* Container */}
          <div className="flex flex-row gap-item-spacing-s items-center w-fit h-fit px-2">
            {/* Heading 4 */}
            <div className="flex flex-col items-start w-40 h-fit">
              {/* Text */}
              <p className="text-lg font-bold text-left text-color-azure-17 leading-[1.13] w-fit h-fit">FIND A DOCTOR</p>
            </div>
            {/* Background */}
            <div className="flex flex-row justify-center items-center w-14 h-14 bg-color-azure-17 rounded-corner-radius-9999">
              {/* TELE-ONLINE */}
              <img className="w-9 h-9" src={teleOnline} alt="TELE-ONLINE" />
            </div>
          </div>
        </div>
      </>
    ),
    "false/5": (
      <>
        {/* variant=5,:hover=false */}
        <div className={`flex flex-col items-start w-fit h-[105px] bg-tw-ring-offset-color border border-wwwevercarebdcom-big-stone-10/10 py-6 px-3 hover:bg-color-azure-17 transition ${className ?? ""}`.trim()}>
          {/* Container */}
          <div className="flex flex-row gap-item-spacing-s items-center w-fit h-fit px-2">
            {/* Heading 4 */}
            <div className="flex flex-col items-start w-40 h-fit">
              {/* Text */}
              <p className="text-lg font-bold text-left text-color-azure-17 leading-[1.15] w-fit h-fit">FIND A DOCTOR</p>
            </div>
            {/* Background */}
            <div className="flex flex-row justify-center items-center w-14 h-14 bg-color-azure-17 rounded-corner-radius-9999">
              {/* PATIENT & VISITORS GUIDE */}
              <img className="w-9 h-9" src={patientVisitorsGuide} alt="PATIENT & VISITORS GUIDE" />
            </div>
          </div>
        </div>
      </>
    )
  };
  const variantKey = [hover, variant].map(String).join("/");
  const defaultKey = "false/1";
  return variantBodies[variantKey] ?? variantBodies[defaultKey];
};

export default Component3;
