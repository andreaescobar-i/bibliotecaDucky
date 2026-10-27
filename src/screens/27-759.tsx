import { DesignInput, DesignSelect, DesignText, DynamicSlot } from '../design-controls';
const imgEf4Ee736F1424F5FAfd8Ab0Addcbca191 = '/assets/26c9f.png';
const imgSearch = '/assets/5ef97.svg';
const imgLock = '/assets/adc77.svg';
const imgLucideChevronDown = '/assets/b1c28.svg';
type ButtonsProps = {
  className?: string;
  buttonText?: string;
  icons?: 'false';
  size?: 'small';
  state?: 'Default';
  type?: 'primary' | 'secondary';
};
function Buttons({
  className,
  buttonText = 'text',
  icons = 'false',
  size = 'small',
  state = 'Default',
  type = 'primary',
}: ButtonsProps) {
  const isSecondary = type === 'secondary';
  return (
    <button
      type="button"
      className={
        className ||
        `content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] ${isSecondary ? 'border border-[#007566] border-solid' : 'bg-[#00a99b]'}`
      }
      id={isSecondary ? 'node-27_255' : 'node-27_182'}
    >
      {type === 'primary' && (
        <p
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap"
          data-node-id="27:180"
        >
          {buttonText}
        </p>
      )}
      {isSecondary && (
        <p
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#007566] text-[12px] whitespace-nowrap"
          data-node-id="27:256"
        >
          {buttonText}
        </p>
      )}
    </button>
  );
}
export default function InicioSesion() {
  return (
    <div
      className="bg-[#412300] content-stretch flex flex-col items-start relative size-full"
      data-node-id="27:759"
      data-name="inicio sesión"
    >
      <div
        className="bg-[#f9fffe] content-stretch flex flex-col h-[670px] items-start min-w-[320px] relative shrink-0 w-full"
        data-node-id="27:760"
        data-name="Body"
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 absolute bg-white border border-[#eee] border-solid content-stretch drop-shadow-[0px_8px_12px_rgba(0,0,0,0.04)] flex flex-col gap-[20px] items-center justify-center left-1/2 p-[24px] rounded-[16px] top-1/2 w-[435px]"
          data-node-id="27:782"
          data-name="Form"
        >
          <div
            className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-full"
            data-node-id="27:783"
            data-name="Container"
          >
            <div
              className="h-[60px] relative shrink-0 w-[90px]"
              data-node-id="2159:2274"
              data-name="EF4EE736-F142-4F5F-AFD8-AB0ADDCBCA19 1"
            >
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
                src={imgEf4Ee736F1424F5FAfd8Ab0Addcbca191}
              />
            </div>
            <DesignText
              className="[word-break:break-word] font-['Poppins:Medium'] leading-[32px] not-italic relative shrink-0 text-[#00a99b] text-[24px] whitespace-nowrap"
              data-node-id="27:785"
            >
              Acceso
            </DesignText>
            <DesignText
              className="[word-break:break-word] font-['Poppins:Medium'] leading-[28px] not-italic relative shrink-0 text-[#007566] text-[20px] whitespace-nowrap"
              data-node-id="27:788"
            >
              Iniciar sesión
            </DesignText>
            <DesignText
              className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] min-w-full not-italic relative shrink-0 text-[#4b4b4b] text-[14px] text-center w-[min-content]"
              data-node-id="27:791"
            >
              Ingresa tu usuario nombre.apellido, contraseña y rol asignado.
            </DesignText>
          </div>
          <div
            className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full"
            data-node-id="27:795"
            data-name="Field"
          >
            <DesignText
              className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#4b4b4b] text-[14px] whitespace-nowrap"
              data-node-id="27:797"
            >
              Usuario
            </DesignText>
            <DesignInput
              className="block cursor-pointer h-[40px] relative rounded-[4px] shrink-0 w-[385px]"
              data-node-id="65:3744"
              data-name="Left icon"
              label="Usuario"
              initialValue=""
            >
              <div
                className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
                data-node-id="I65:3744;65:3042"
                data-name="Base"
              />
              <div
                className="-translate-y-1/2 absolute left-[12px] size-[18px] top-1/2"
                data-node-id="I65:3744;65:3043"
                data-name="Search"
              >
                <img
                  alt=""
                  className="absolute block inset-0 max-w-none size-full"
                  src={imgSearch}
                />
              </div>
              <DesignText
                className="[word-break:break-word] absolute font-['Poppins:Regular'] leading-[24px] left-[38px] not-italic right-[12px] text-[#cacaca] text-[16px] text-left top-[calc(50%-12px)]"
                data-node-id="I65:3744;65:3044"
              >
                ​
              </DesignText>
            </DesignInput>
          </div>
          <div
            className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full"
            data-node-id="27:801"
            data-name="Field"
          >
            <DesignText
              className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#4b4b4b] text-[14px] whitespace-nowrap"
              data-node-id="27:803"
            >
              Contraseña
            </DesignText>
            <DesignInput
              className="block cursor-pointer h-[40px] relative rounded-[4px] shrink-0 w-[385px]"
              data-node-id="65:3757"
              data-name="Left icon"
              label="Contraseña"
              initialValue=""
            >
              <div
                className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
                data-node-id="I65:3757;65:3042"
                data-name="Base"
              />
              <div
                className="-translate-y-1/2 absolute left-[12px] size-[18px] top-1/2"
                data-node-id="I65:3757;65:3043"
                data-name="Search"
              >
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLock} />
              </div>
              <DesignText
                className="[word-break:break-word] absolute font-['Poppins:Regular'] leading-[24px] left-[38px] not-italic right-[12px] text-[#cacaca] text-[16px] text-left top-[calc(50%-12px)]"
                data-node-id="I65:3757;65:3044"
              >
                ​
              </DesignText>
            </DesignInput>
          </div>
          <div
            className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full"
            data-node-id="27:807"
            data-name="Field"
          >
            <DesignText
              className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#4b4b4b] text-[14px] whitespace-nowrap"
              data-node-id="27:809"
            >
              Rol
            </DesignText>
            <DesignSelect
              className="content-stretch cursor-pointer flex flex-col gap-[2px] h-[40px] items-start overflow-clip relative shrink-0 w-[385px]"
              data-node-id="124:3084"
              data-name="dropdown_rol"
              label="Rol"
              initialValue="Alumno  Item  Item  Item  Item  Item  Item"
            >
              <div
                className="content-stretch flex gap-[10px] items-center justify-center overflow-clip p-[10px] relative rounded-[10px] shrink-0 w-full"
                data-node-id="I124:3084;124:2796"
                data-name="dropdown-input"
              >
                <DesignText
                  className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[#4b4b4b] text-[12px] text-left"
                  data-node-id="I124:3084;124:2797"
                >
                  Alumno
                </DesignText>
                <div
                  className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[15px]"
                  data-node-id="I124:3084;124:2798"
                  data-name="Container"
                >
                  <div
                    className="relative shrink-0 size-[12px]"
                    data-node-id="I124:3084;124:2798;7:710"
                    data-name="lucide/chevron-down"
                  >
                    <img
                      alt=""
                      className="absolute block inset-0 max-w-none size-full"
                      src={imgLucideChevronDown}
                    />
                  </div>
                </div>
              </div>
              <div
                className="bg-white border border-[#8e8e8e] border-solid content-stretch drop-shadow-[2px_4px_2px_rgba(0,0,0,0.25)] flex flex-col items-start relative rounded-[4px] shrink-0 w-full"
                data-node-id="I124:3084;124:2799"
                data-name="dropdown-menu"
              >
                <div
                  className="bg-[#4b4b4b] content-stretch flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full"
                  data-node-id="I124:3084;124:2799;7:752"
                >
                  <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Poppins:Medium'] h-full justify-center leading-[0] min-w-px not-italic relative text-[12px] text-left text-white">
                    <DesignText className="leading-[18px]">Item</DesignText>
                  </div>
                </div>
                <div
                  className="bg-[#4b4b4b] content-stretch flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full"
                  data-node-id="I124:3084;124:2799;7:755"
                >
                  <DesignText
                    className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[12px] text-left text-white"
                    data-node-id="I124:3084;124:2799;7:755;7:740"
                  >
                    Item
                  </DesignText>
                </div>
                <div
                  className="bg-[#4b4b4b] content-stretch flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full"
                  data-node-id="I124:3084;124:2799;7:771"
                >
                  <DesignText
                    className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[12px] text-left text-white"
                    data-node-id="I124:3084;124:2799;7:771;7:740"
                  >
                    Item
                  </DesignText>
                </div>
                <div
                  className="bg-[#4b4b4b] content-stretch flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full"
                  data-node-id="I124:3084;124:2799;7:774"
                >
                  <DesignText
                    className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[12px] text-left text-white"
                    data-node-id="I124:3084;124:2799;7:774;7:740"
                  >
                    Item
                  </DesignText>
                </div>
                <div
                  className="bg-[#4b4b4b] content-stretch flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full"
                  data-node-id="I124:3084;124:2799;124:2846"
                >
                  <DesignText
                    className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[12px] text-left text-white"
                    data-node-id="I124:3084;124:2799;124:2846;7:740"
                  >
                    Item
                  </DesignText>
                </div>
                <div
                  className="bg-[#4b4b4b] content-stretch flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full"
                  data-node-id="I124:3084;124:2799;124:2901"
                >
                  <DesignText
                    className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[12px] text-left text-white"
                    data-node-id="I124:3084;124:2799;124:2901;7:740"
                  >
                    Item
                  </DesignText>
                </div>
              </div>
            </DesignSelect>
          </div>
          <Buttons
            buttonText="Ingresar"
            className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[382px]"
          />
          <Buttons
            buttonText="¿Olvidaste tu contraseña?"
            className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
            type="secondary"
          />
        </div>
      </div>
    </div>
  );
}
