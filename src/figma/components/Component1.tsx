import component1 from "../assets/component-1.png";
import variant2 from "../assets/variant2.png";
import variant6 from "../assets/variant6.png";
import variant10 from "../assets/variant10.png";
import variant14 from "../assets/variant14.png";
import variant18 from "../assets/variant18.png";
import variant22 from "../assets/variant22.png";
import variant26 from "../assets/variant26.png";
import variant30 from "../assets/variant30.png";
import variant34 from "../assets/variant34.png";
import variant38 from "../assets/variant38.png";
import dentishChair from "../assets/dentish-chair.png";
import variant46 from "../assets/variant46.png";
import variant50 from "../assets/variant50.png";
import variant54 from "../assets/variant54.png";
import variant58 from "../assets/variant58.png";
import variant62 from "../assets/variant62.png";
import variant63 from "../assets/variant63.png";
import variant64 from "../assets/variant64.png";
import variant65 from "../assets/variant65.png";
import variant66 from "../assets/variant66.png";
import variant67 from "../assets/variant67.png";
import group from "../assets/group.png";
import vector from "../assets/vector.svg";
import vector2 from "../assets/vector-2.svg";
import vector3 from "../assets/vector-3.svg";
import vector4 from "../assets/vector-4.svg";
import vector5 from "../assets/vector-5.svg";
import vector6 from "../assets/vector-6.svg";
import variant69 from "../assets/variant69.png";
import variant70 from "../assets/variant70.png";
import variant71 from "../assets/variant71.png";
import variant72 from "../assets/variant72.png";
import variant73 from "../assets/variant73.png";
import variant74 from "../assets/variant74.png";
import variant75 from "../assets/variant75.png";
import variant76 from "../assets/variant76.png";
import variant77 from "../assets/variant77.png";
import variant78 from "../assets/variant78.png";
import variant79 from "../assets/variant79.png";
import variant80 from "../assets/variant80.png";
import variant81 from "../assets/variant81.png";
import variant83 from "../assets/variant83.png";

interface Component1Props {
  className?: string;
  variant: string;
}

const Component1 = ({ className, variant }: Component1Props) => {
  const variantBodies = {
    "1": (
      <>
        {/* Component 1 */}
        <img className={`w-4 h-4 ${className ?? ""}`.trim()} src={component1} alt="Component 1" />
      </>
    ),
    "2": (
      <>
        {/* variant=2 */}
        <img className={`w-4 h-4 ${className ?? ""}`.trim()} src={variant2} alt="variant=2" />
      </>
    ),
    "6": (
      <>
        {/* variant=6 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant6} alt="variant=6" />
      </>
    ),
    "10": (
      <>
        {/* variant=10 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant10} alt="variant=10" />
      </>
    ),
    "14": (
      <>
        {/* variant=14 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant14} alt="variant=14" />
      </>
    ),
    "18": (
      <>
        {/* variant=18 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant18} alt="variant=18" />
      </>
    ),
    "22": (
      <>
        {/* variant=22 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant22} alt="variant=22" />
      </>
    ),
    "26": (
      <>
        {/* variant=26 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant26} alt="variant=26" />
      </>
    ),
    "30": (
      <>
        {/* variant=30 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant30} alt="variant=30" />
      </>
    ),
    "34": (
      <>
        {/* variant=34 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant34} alt="variant=34" />
      </>
    ),
    "38": (
      <>
        {/* variant=38 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant38} alt="variant=38" />
      </>
    ),
    "42": (
      <>
        {/* variant=42 */}
        <div className={`relative w-10 h-10 overflow-hidden ${className ?? ""}`.trim()}>
          {/* Dentish Chair */}
          <img className="absolute w-10 h-10" src={dentishChair} alt="Dentish Chair" />
        </div>
      </>
    ),
    "46": (
      <>
        {/* variant=46 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant46} alt="variant=46" />
      </>
    ),
    "50": (
      <>
        {/* variant=50 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant50} alt="variant=50" />
      </>
    ),
    "54": (
      <>
        {/* variant=54 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant54} alt="variant=54" />
      </>
    ),
    "58": (
      <>
        {/* variant=58 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant58} alt="variant=58" />
      </>
    ),
    "62": (
      <>
        {/* variant=62 */}
        <img className={`w-10 h-10 ${className ?? ""}`.trim()} src={variant62} alt="variant=62" />
      </>
    ),
    "63": (
      <>
        {/* variant=63 */}
        <img className={`w-5 h-5 ${className ?? ""}`.trim()} src={variant63} alt="variant=63" />
      </>
    ),
    "64": (
      <>
        {/* variant=64 */}
        <img className={`w-5 h-5 ${className ?? ""}`.trim()} src={variant64} alt="variant=64" />
      </>
    ),
    "65": (
      <>
        {/* variant=65 */}
        <img className={`w-4 h-4 ${className ?? ""}`.trim()} src={variant65} alt="variant=65" />
      </>
    ),
    "66": (
      <>
        {/* variant=66 */}
        <img className={`w-4 h-4 ${className ?? ""}`.trim()} src={variant66} alt="variant=66" />
      </>
    ),
    "67": (
      <>
        {/* variant=67 */}
        <img className={`w-7 h-7 ${className ?? ""}`.trim()} src={variant67} alt="variant=67" />
      </>
    ),
    "68": (
      <>
        {/* variant=68 */}
        <div className={`relative w-[52px] h-[22px] overflow-hidden ${className ?? ""}`.trim()}>
          {/* Group */}
          <img className="absolute top-[3px] left-[2px] w-12 h-4" src={group} alt="Group" />
          {/* Vector */}
          <img className="absolute top-[4px] left-[3px] w-3 h-3" src={vector} alt="Vector" />
          {/* Vector */}
          <img className="absolute top-[8px] left-[15px] w-2 h-2" src={vector2} alt="Vector" />
          {/* Vector */}
          <img className="absolute top-[8px] left-[23px] w-2 h-2" src={vector3} alt="Vector" />
          {/* Vector */}
          <img className="absolute top-[8px] left-[31px] w-2 h-2.5" src={vector4} alt="Vector" />
          {/* Vector */}
          <img className="absolute top-[4px] left-[40px] w-0.5 h-2.5" src={vector5} alt="Vector" />
          {/* Vector */}
          <img className="absolute top-[8px] left-[42px] w-1.5 h-2" src={vector6} alt="Vector" />
        </div>
      </>
    ),
    "69": (
      <>
        {/* variant=69 */}
        <img className={`w-[18px] h-[18px] ${className ?? ""}`.trim()} src={variant69} alt="variant=69" />
      </>
    ),
    "70": (
      <>
        {/* variant=70 */}
        <img className={`w-[18px] h-[18px] ${className ?? ""}`.trim()} src={variant70} alt="variant=70" />
      </>
    ),
    "71": (
      <>
        {/* variant=71 */}
        <img className={`w-6 h-6 ${className ?? ""}`.trim()} src={variant71} alt="variant=71" />
      </>
    ),
    "72": (
      <>
        {/* variant=72 */}
        <img className={`w-6 h-6 ${className ?? ""}`.trim()} src={variant72} alt="variant=72" />
      </>
    ),
    "73": (
      <>
        {/* variant=73 */}
        <img className={`w-6 h-6 ${className ?? ""}`.trim()} src={variant73} alt="variant=73" />
      </>
    ),
    "74": (
      <>
        {/* variant=74 */}
        <img className={`w-6 h-6 ${className ?? ""}`.trim()} src={variant74} alt="variant=74" />
      </>
    ),
    "75": (
      <>
        {/* variant=75 */}
        <img className={`w-6 h-6 ${className ?? ""}`.trim()} src={variant75} alt="variant=75" />
      </>
    ),
    "76": (
      <>
        {/* variant=76 */}
        <img className={`w-6 h-6 ${className ?? ""}`.trim()} src={variant76} alt="variant=76" />
      </>
    ),
    "77": (
      <>
        {/* variant=77 */}
        <img className={`w-6 h-6 ${className ?? ""}`.trim()} src={variant77} alt="variant=77" />
      </>
    ),
    "78": (
      <>
        {/* variant=78 */}
        <img className={`w-4 h-4 ${className ?? ""}`.trim()} src={variant78} alt="variant=78" />
      </>
    ),
    "79": (
      <>
        {/* variant=79 */}
        <img className={`w-4 h-4 ${className ?? ""}`.trim()} src={variant79} alt="variant=79" />
      </>
    ),
    "80": (
      <>
        {/* variant=80 */}
        <img className={`w-4 h-4 ${className ?? ""}`.trim()} src={variant80} alt="variant=80" />
      </>
    ),
    "81": (
      <>
        {/* variant=81 */}
        <img className={`w-3 h-3 ${className ?? ""}`.trim()} src={variant81} alt="variant=81" />
      </>
    ),
    "83": (
      <>
        {/* variant=83 */}
        <img className={`w-4 h-4 ${className ?? ""}`.trim()} src={variant83} alt="variant=83" />
      </>
    )
  };
  const variantKey = [variant].map(String).join("/");
  const defaultKey = "1";
  return variantBodies[variantKey] ?? variantBodies[defaultKey];
};

export default Component1;
