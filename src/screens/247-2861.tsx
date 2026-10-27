import { DesignInput, DesignSelect, DesignText, DynamicSlot } from '../design-controls';
const imgIdentidadBiblioteca = '/assets/e387d.png';
const imgSearch = '/assets/5ef97.svg';
const imgLucideChevronDown = '/assets/b1c28.svg';
type ButtonsProps = {
  className?: string;
  buttonText?: string;
  icons?: 'false';
  size?: 'small' | 'medium';
  state?: 'Default' | 'disabled';
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
  const isMediumAndSecondaryAndDefault =
    size === 'medium' && type === 'secondary' && state === 'Default';
  const isSmallAndPrimaryAndDisabled =
    size === 'small' && type === 'primary' && state === 'disabled';
  const isSmallAndSecondaryAndDefault =
    size === 'small' && type === 'secondary' && state === 'Default';
  return (
    <button
      type="button"
      className={
        className ||
        `content-stretch flex items-center justify-center relative rounded-[8px] ${isMediumAndSecondaryAndDefault ? 'border border-[#007566] border-solid h-[45px] p-[10px]' : isSmallAndPrimaryAndDisabled ? 'bg-[#eefcfa] h-[40px] px-[10px] py-[5px]' : isSmallAndSecondaryAndDefault ? 'border border-[#007566] border-solid h-[40px] px-[10px] py-[5px]' : 'bg-[#00a99b] h-[40px] px-[10px] py-[5px]'}`
      }
      id={
        isMediumAndSecondaryAndDefault
          ? 'node-27_257'
          : isSmallAndPrimaryAndDisabled
            ? 'node-27_273'
            : isSmallAndSecondaryAndDefault
              ? 'node-27_255'
              : 'node-27_182'
      }
    >
      {size === 'small' && type === 'primary' && state === 'Default' && (
        <p
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap"
          data-node-id="27:180"
        >
          {buttonText}
        </p>
      )}
      {isSmallAndSecondaryAndDefault && (
        <p
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#007566] text-[12px] whitespace-nowrap"
          data-node-id="27:256"
        >
          {buttonText}
        </p>
      )}
      {isSmallAndPrimaryAndDisabled && (
        <p
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] whitespace-nowrap"
          data-node-id="27:274"
        >
          {buttonText}
        </p>
      )}
      {isMediumAndSecondaryAndDefault && (
        <p
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#007566] text-[14px] whitespace-nowrap"
          data-node-id="27:258"
        >
          {buttonText}
        </p>
      )}
    </button>
  );
}
type BadgeProps = {
  className?: string;
  label?: string;
  state?: 'Default';
};
function Badge({ className, label = 'Estado', state = 'Default' }: BadgeProps) {
  return (
    <div
      className={
        className ||
        'bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px]'
      }
      data-node-id="137:4657"
    >
      <p
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#4b4b4b] text-[12px] whitespace-nowrap"
        data-node-id="137:4655"
      >
        {label}
      </p>
    </div>
  );
}
export default function GestionDeLibrosAdministrador() {
  return (
    <div
      className="bg-[#fafafa] content-stretch flex flex-col items-start relative size-full"
      data-node-id="247:2861"
      data-name="gestión de libros - administrador"
    >
      <div
        className="bg-[#fafafa] content-stretch flex flex-col items-start min-h-[422px] min-w-[320px] relative shrink-0 w-full"
        data-node-id="247:2862"
        data-name="AppShell"
      >
        <div
          className="bg-white content-stretch flex flex-col h-[76px] items-start relative shrink-0 w-full"
          data-node-id="247:3366"
          data-name="header"
        >
          <div
            className="absolute backdrop-blur-[12px] bg-[rgba(255,255,255,0)] border-[#d4d4d4] border-b border-solid content-stretch flex gap-[20px] h-[76px] items-center left-0 pl-[48px] pr-[32px] top-0 w-[1280px]"
            data-node-id="I247:3366;62:561"
            data-name="Header"
          >
            <div
              className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex gap-[12px] h-[75px] items-center min-h-[40px] px-[14.4px] py-[8.8px] relative rounded-[6px] shrink-0 w-[182.914px]"
              data-node-id="I247:3366;62:562"
              data-name="Identidad · Biblioteca"
            >
              <img
                alt=""
                className="absolute inset-0 max-w-none object-contain pointer-events-none rounded-[6px] size-full"
                src={imgIdentidadBiblioteca}
              />
            </div>
            <div
              className="content-stretch cursor-pointer flex gap-[8px] h-[50px] items-center justify-center px-[24px] relative shrink-0 w-[645px]"
              data-node-id="I247:3366;62:570"
              data-name="Navigation"
            >
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I247:3366;207:651"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I247:3366;207:651;144:1484"
                >
                  Reportes
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I247:3366;207:652"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I247:3366;207:652;144:1484"
                >
                  Usuarios
                </DesignText>
              </button>
              <button
                className="bg-[#00a99b] border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I247:3366;207:653"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] font-medium leading-[18px] relative shrink-0 text-[12px] text-center text-white whitespace-nowrap"
                  data-node-id="I247:3366;207:653;144:1469"
                  style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
                >
                  Libros ▾
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I247:3366;207:654"
                data-name="Operaciones"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] font-medium leading-[18px] relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I247:3366;207:654;144:1484"
                  style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
                >
                  Administración ▾
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I247:3366;207:655"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I247:3366;207:655;144:1484"
                >
                  Operaciones ▾
                </DesignText>
              </button>
            </div>
            <div
              className="content-stretch flex h-[75px] items-center justify-between overflow-clip relative shrink-0 w-[332px]"
              data-node-id="I247:3366;62:576"
              data-name="Container"
            >
              <div
                className="content-stretch flex gap-[9.6px] items-center relative shrink-0"
                data-node-id="I247:3366;62:584"
                data-name="Container"
              >
                <div
                  className="bg-[#262626] grid grid-cols-[_32px] grid-rows-[_32px] relative rounded-[16px] shrink-0 size-[32px]"
                  data-node-id="I247:3366;62:585"
                  data-name="Text"
                >
                  <DesignText
                    className="[word-break:break-word] col-1 font-['Poppins:Regular'] justify-self-center leading-[18px] not-italic relative row-1 self-center shrink-0 text-[12px] text-white whitespace-nowrap"
                    data-node-id="I247:3366;62:586"
                  >
                    AC
                  </DesignText>
                </div>
                <div
                  className="content-stretch flex flex-col items-start relative shrink-0 w-[89.641px]"
                  data-node-id="I247:3366;62:587"
                  data-name="Container"
                >
                  <button
                    className="content-stretch cursor-pointer flex flex-col items-start relative shrink-0"
                    data-node-id="I247:3366;62:588"
                    data-name="Bold Text"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] text-left whitespace-nowrap"
                      data-node-id="I247:3366;62:589"
                    >
                      Alfonso Chapa
                    </DesignText>
                  </button>
                  <div
                    className="content-stretch flex flex-col h-[18px] items-start max-w-[160px] overflow-clip relative shrink-0"
                    data-node-id="I247:3366;62:590"
                    data-name="Small"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap"
                      data-node-id="I247:3366;62:591"
                    >
                      Admin
                    </DesignText>
                  </div>
                </div>
              </div>
              <div
                className="content-stretch cursor-pointer flex items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                data-node-id="I247:3366;62:592"
                data-name="Button · DS"
              >
                <Buttons
                  buttonText="Cerrar sesión"
                  className="aspect-[74/40] border border-[#007566] border-solid content-stretch flex items-center justify-center p-[10px] relative rounded-[8px] shrink-0"
                  size="medium"
                  type="secondary"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className="content-stretch flex flex-col items-center px-[27px] relative shrink-0 w-full"
          data-node-id="247:2864"
          data-name="Main Content:margin"
        >
          <div
            className="content-stretch flex flex-col items-start min-h-[278px] pb-[80px] pt-[56px] relative shrink-0 w-full"
            data-node-id="247:2865"
            data-name="Main Content"
          >
            <div
              className="content-stretch flex h-[90px] items-end justify-between relative shrink-0 w-full"
              data-node-id="247:2866"
              data-name="PageHeader"
            >
              <div
                className="content-stretch flex flex-col items-start relative shrink-0 w-[388.625px]"
                data-node-id="247:2867"
                data-name="Container"
              >
                <div
                  className="content-stretch flex flex-col items-start min-h-[36px] relative shrink-0 w-full"
                  data-node-id="247:2868"
                  data-name="Heading"
                >
                  <DesignText
                    className="[word-break:break-word] font-['Poppins:Medium'] leading-[32px] not-italic relative shrink-0 text-[#1f1f1f] text-[24px] whitespace-nowrap"
                    data-node-id="247:2869"
                  >
                    Gestión de libros
                  </DesignText>
                </div>
                <div
                  className="content-stretch flex flex-col h-[34.8px] items-start max-w-[720px] pt-[8.8px] relative shrink-0 w-[388.625px]"
                  data-node-id="247:2870"
                  data-name="Paragraph"
                >
                  <DesignText
                    className="[word-break:break-word] font-['Poppins:Medium'] leading-[24px] not-italic relative shrink-0 text-[#4b4b4b] text-[16px] whitespace-nowrap"
                    data-node-id="247:2871"
                  >
                    Agrega y edita libros, clasifica ejemplares y registra bajas conservando el
                    historial.
                  </DesignText>
                </div>
              </div>
              <div
                className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0"
                data-node-id="2190:3991"
              >
                <div
                  className="col-1 content-stretch flex h-[40px] items-center justify-center min-h-[40px] ml-0 mt-0 relative rounded-[6px] row-1 w-[59.615px]"
                  data-node-id="247:2872"
                  data-name="Button · DS"
                >
                  <Buttons
                    buttonText="+ Agregar libro"
                    className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                  />
                </div>
                <Buttons
                  buttonText="Recibidos de compras"
                  className="border border-[#007566] border-solid col-1 content-stretch cursor-pointer flex h-[40px] items-center justify-center ml-[106px] mt-0 px-[10px] py-[5px] relative rounded-[8px] row-1"
                  type="secondary"
                />
              </div>
            </div>
            <div
              className="content-stretch flex flex-col items-start pb-[20px] pt-[32px] relative shrink-0 w-full"
              data-node-id="247:2874"
              data-name="Panel:margin"
            >
              <div
                className="bg-white border-[#e1e1e1] border-[0.667px] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col items-start p-[24px] relative rounded-[12px] shrink-0 w-full"
                data-node-id="247:2875"
                data-name="Panel"
              >
                <div
                  className="bg-[#fafafa] border-[#eee] border-[0.667px] border-solid gap-x-[12px] gap-y-[12px] grid grid-cols-[___minmax(0,1fr)_237.94px_70.84px] grid-rows-[_64.62px] p-[16px] relative rounded-[8px] shrink-0 w-full"
                  data-node-id="247:2876"
                  data-name="Toolbar"
                >
                  <div
                    className="col-1 content-stretch flex flex-col gap-[6.4px] items-start justify-self-stretch relative row-1 self-end shrink-0"
                    data-node-id="247:2877"
                    data-name="Field"
                  >
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="247:2878"
                      data-name="Text"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                        data-node-id="247:2879"
                      >
                        Buscar en el catálogo
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] overflow-clip relative rounded-[6px] shrink-0 w-full"
                      data-node-id="247:2880"
                      data-name="Input · DS"
                    >
                      <DesignInput
                        className="block cursor-pointer flex-[1_0_0] h-[40px] min-w-px relative rounded-[4px]"
                        data-node-id="247:2881"
                        data-name="Left icon"
                        label="Buscar en el catálogo"
                        initialValue=""
                      >
                        <div
                          className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
                          data-node-id="I247:2881;65:3042"
                          data-name="Base"
                        />
                        <div
                          className="-translate-y-1/2 absolute left-[12px] size-[18px] top-1/2"
                          data-node-id="I247:2881;65:3043"
                          data-name="Search"
                        >
                          <img
                            alt=""
                            className="absolute block inset-0 max-w-none size-full"
                            src={imgSearch}
                          />
                        </div>
                        <DesignText
                          className="[word-break:break-word] absolute font-['Poppins:Regular'] leading-[24px] left-[38px] not-italic right-[12px] text-[#cacaca] text-[16px] text-left top-[calc(50%-12px)] whitespace-nowrap"
                          data-node-id="I247:2881;65:3044"
                        >
                          ​
                        </DesignText>
                      </DesignInput>
                    </div>
                  </div>
                  <div
                    className="col-2 content-stretch flex flex-col gap-[6.4px] items-start justify-self-stretch relative row-1 self-end shrink-0"
                    data-node-id="247:2882"
                    data-name="Field"
                  >
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="247:2883"
                      data-name="Text"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                        data-node-id="247:2884"
                      >
                        Tipo de uso
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] overflow-clip relative rounded-[6px] shrink-0 w-[237.938px]"
                      data-node-id="247:2885"
                      data-name="Select · DS"
                    >
                      <DesignSelect
                        className="border border-[#cacaca] border-solid content-stretch cursor-pointer flex flex-col gap-[2px] h-[32px] items-start overflow-clip relative rounded-[10px] shrink-0 w-[237.938px]"
                        data-node-id="247:2886"
                        data-name="dropdown"
                        label="Tipo de uso"
                        initialValue="Todos"
                      >
                        <div
                          className="content-stretch flex gap-[10px] h-[32px] items-center justify-center overflow-clip p-[10px] relative rounded-[10px] shrink-0 w-full"
                          data-node-id="I247:2886;7:1352"
                          data-name="dropdown-input"
                        >
                          <DesignText
                            className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[#4b4b4b] text-[12px] text-left"
                            data-node-id="I247:2886;7:1353"
                          >
                            Todos
                          </DesignText>
                          <div
                            className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[15px]"
                            data-node-id="I247:2886;7:1354"
                            data-name="Container"
                          >
                            <div
                              className="relative shrink-0 size-[12px]"
                              data-node-id="I247:2886;7:1354;7:710"
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
                      </DesignSelect>
                    </div>
                  </div>
                  <div
                    className="col-3 content-stretch flex h-[40px] items-center justify-center justify-self-stretch min-h-[40px] relative rounded-[6px] row-1 self-end shrink-0"
                    data-node-id="247:2887"
                    data-name="Button · DS"
                  >
                    <Buttons
                      buttonText="Buscar"
                      className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                      type="secondary"
                    />
                  </div>
                </div>
                <div
                  className="content-stretch flex flex-col items-start pt-[24px] relative shrink-0 w-full"
                  data-node-id="247:2889"
                  data-name="Table:margin"
                >
                  <DynamicSlot
                    className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                    data-node-id="247:2890"
                    data-name="Table"
                  >
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="247:2891"
                      data-name="Table"
                    >
                      <div
                        className="content-stretch flex h-[39px] items-start overflow-clip relative shrink-0 w-full"
                        data-node-id="428:5451"
                        data-name="Frame"
                      >
                        <div
                          className="border-[#8e8e8e] border-b-[0.667px] border-solid content-stretch flex flex-col h-[39px] items-start justify-center px-[12px] py-[11.2px] relative shrink-0 w-[129.368px]"
                          data-node-id="247:2892"
                          data-name="Header Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                            data-node-id="247:2893"
                          >
                            Clave
                          </DesignText>
                        </div>
                        <div
                          className="border-[#8e8e8e] border-b-[0.667px] border-solid content-stretch flex flex-col h-[39px] items-start justify-center px-[12px] py-[11.2px] relative shrink-0 w-[341.097px]"
                          data-node-id="247:2894"
                          data-name="Header Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                            data-node-id="247:2895"
                          >
                            Título y autor
                          </DesignText>
                        </div>
                        <div
                          className="border-[#8e8e8e] border-b-[0.667px] border-solid content-stretch flex flex-col h-[39px] items-start justify-center px-[12px] py-[11.2px] relative shrink-0 w-[107.398px]"
                          data-node-id="247:2896"
                          data-name="Header Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                            data-node-id="247:2897"
                          >
                            Ejemplares
                          </DesignText>
                        </div>
                        <div
                          className="border-[#8e8e8e] border-b-[0.667px] border-solid content-stretch flex flex-col h-[39px] items-start justify-center px-[12px] py-[11.2px] relative shrink-0 w-[157.284px]"
                          data-node-id="247:2898"
                          data-name="Header Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                            data-node-id="247:2899"
                          >
                            Tipo de uso
                          </DesignText>
                        </div>
                        <div
                          className="border-[#8e8e8e] border-b-[0.667px] border-solid content-stretch flex flex-col h-[39px] items-start justify-center px-[12px] py-[11.2px] relative shrink-0 w-[77.683px]"
                          data-node-id="247:2900"
                          data-name="Header Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                            data-node-id="247:2901"
                          >
                            Estado
                          </DesignText>
                        </div>
                        <div
                          className="border-[#8e8e8e] border-b-[0.667px] border-solid content-stretch flex flex-col h-[39px] items-start justify-center px-[12px] py-[11.2px] relative shrink-0 w-[363.837px]"
                          data-node-id="247:2902"
                          data-name="Header Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                            data-node-id="247:2903"
                          >
                            Acciones
                          </DesignText>
                        </div>
                      </div>
                      <div
                        className="content-stretch flex h-[74px] items-start overflow-clip relative shrink-0 w-full"
                        data-node-id="428:5452"
                        data-name="Libro · 0"
                      >
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[129.368px]"
                          data-node-id="428:5453"
                          data-name="Table Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                            data-node-id="428:5454"
                          >
                            LIT-863.64-GAR
                          </DesignText>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[341.097px]"
                          data-node-id="428:5455"
                          data-name="Table Cell"
                        >
                          <div
                            className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                            data-node-id="428:5456"
                            data-name="CatalogManagement"
                          >
                            <div
                              className="h-[18.717px] relative shrink-0 w-full"
                              data-node-id="428:5457"
                              data-name="Container"
                            >
                              <DesignText
                                className="[word-break:break-word] absolute font-['Poppins:Medium'] leading-[18px] left-0 not-italic text-[#1f1f1f] text-[12px] top-[-1.33px] whitespace-nowrap"
                                data-node-id="428:5458"
                              >
                                Cien años de soledad
                              </DesignText>
                            </div>
                            <div
                              className="content-stretch flex flex-col items-start pt-[3.2px] relative shrink-0 w-full"
                              data-node-id="428:5459"
                              data-name="Small:margin"
                            >
                              <div
                                className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                                data-node-id="428:5460"
                                data-name="Small"
                              >
                                <DesignText
                                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                                  data-node-id="428:5461"
                                >
                                  Gabriel García Márquez
                                </DesignText>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[107.398px]"
                          data-node-id="428:5462"
                          data-name="Table Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                            data-node-id="428:5463"
                          >
                            4
                          </DesignText>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[157.284px]"
                          data-node-id="428:5464"
                          data-name="Table Cell"
                        >
                          <div
                            className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0"
                            data-node-id="428:5465"
                            data-name="Badge · DS"
                          >
                            <Badge
                              className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0"
                              label="Préstamo externo"
                            />
                          </div>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[77.683px]"
                          data-node-id="428:5467"
                          data-name="Table Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                            data-node-id="428:5468"
                          >
                            Activo
                          </DesignText>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[363.837px]"
                          data-node-id="428:5469"
                          data-name="Table Cell"
                        >
                          <div
                            className="content-stretch flex gap-[1.6px] h-[40px] items-start relative shrink-0 w-full"
                            data-node-id="428:5470"
                            data-name="CatalogManagement"
                          >
                            <div
                              className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                              data-node-id="428:5471"
                              data-name="Button · DS"
                            >
                              <Buttons
                                buttonText="Editar"
                                className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                                type="secondary"
                              />
                            </div>
                            <div
                              className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                              data-node-id="428:5473"
                              data-name="Button · DS"
                            >
                              <Buttons
                                buttonText="Ejemplares"
                                className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                                type="secondary"
                              />
                            </div>
                            <div
                              className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                              data-node-id="428:5475"
                              data-name="Button · DS"
                            >
                              <Buttons
                                buttonText="Historial"
                                className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                                type="secondary"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="content-stretch flex h-[74px] items-start overflow-clip relative shrink-0 w-full"
                        data-node-id="428:5483"
                        data-name="Libro · 1"
                      >
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[129.368px]"
                          data-node-id="428:5484"
                          data-name="Table Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                            data-node-id="428:5485"
                          >
                            COM-005.1-COR
                          </DesignText>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[341.097px]"
                          data-node-id="428:5486"
                          data-name="Table Cell"
                        >
                          <div
                            className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                            data-node-id="428:5487"
                            data-name="CatalogManagement"
                          >
                            <div
                              className="h-[18.717px] relative shrink-0 w-full"
                              data-node-id="428:5488"
                              data-name="Container"
                            >
                              <DesignText
                                className="[word-break:break-word] absolute font-['Poppins:Medium'] leading-[18px] left-0 not-italic text-[#1f1f1f] text-[12px] top-[-1.33px] whitespace-nowrap"
                                data-node-id="428:5489"
                              >
                                Introducción a los algoritmos
                              </DesignText>
                            </div>
                            <div
                              className="content-stretch flex flex-col items-start pt-[3.2px] relative shrink-0 w-full"
                              data-node-id="428:5490"
                              data-name="Small:margin"
                            >
                              <div
                                className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                                data-node-id="428:5491"
                                data-name="Small"
                              >
                                <DesignText
                                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                                  data-node-id="428:5492"
                                >
                                  Thomas H. Cormen
                                </DesignText>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[107.398px]"
                          data-node-id="428:5493"
                          data-name="Table Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                            data-node-id="428:5494"
                          >
                            3
                          </DesignText>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[157.284px]"
                          data-node-id="428:5495"
                          data-name="Table Cell"
                        >
                          <div
                            className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0"
                            data-node-id="428:5496"
                            data-name="Badge · DS"
                          >
                            <Badge
                              className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0"
                              label="Préstamo externo"
                            />
                          </div>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[77.683px]"
                          data-node-id="428:5498"
                          data-name="Table Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                            data-node-id="428:5499"
                          >
                            Activo
                          </DesignText>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[363.837px]"
                          data-node-id="428:5500"
                          data-name="Table Cell"
                        >
                          <div
                            className="content-stretch flex gap-[1.6px] h-[40px] items-start relative shrink-0 w-full"
                            data-node-id="428:5501"
                            data-name="CatalogManagement"
                          >
                            <div
                              className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                              data-node-id="428:5502"
                              data-name="Button · DS"
                            >
                              <Buttons
                                buttonText="Editar"
                                className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                                type="secondary"
                              />
                            </div>
                            <div
                              className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                              data-node-id="428:5504"
                              data-name="Button · DS"
                            >
                              <Buttons
                                buttonText="Ejemplares"
                                className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                                type="secondary"
                              />
                            </div>
                            <div
                              className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                              data-node-id="428:5506"
                              data-name="Button · DS"
                            >
                              <Buttons
                                buttonText="Historial"
                                className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                                type="secondary"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="content-stretch flex h-[74px] items-start overflow-clip relative shrink-0 w-full"
                        data-node-id="428:5514"
                        data-name="Libro · 2"
                      >
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[129.368px]"
                          data-node-id="428:5515"
                          data-name="Table Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                            data-node-id="428:5516"
                          >
                            HIS-972-ESC
                          </DesignText>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[341.097px]"
                          data-node-id="428:5517"
                          data-name="Table Cell"
                        >
                          <div
                            className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                            data-node-id="428:5518"
                            data-name="CatalogManagement"
                          >
                            <div
                              className="h-[18.717px] relative shrink-0 w-full"
                              data-node-id="428:5519"
                              data-name="Container"
                            >
                              <DesignText
                                className="[word-break:break-word] absolute font-['Poppins:Medium'] leading-[18px] left-0 not-italic text-[#1f1f1f] text-[12px] top-[-1.33px] whitespace-nowrap"
                                data-node-id="428:5520"
                              >
                                Historia mínima de México
                              </DesignText>
                            </div>
                            <div
                              className="content-stretch flex flex-col items-start pt-[3.2px] relative shrink-0 w-full"
                              data-node-id="428:5521"
                              data-name="Small:margin"
                            >
                              <div
                                className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                                data-node-id="428:5522"
                                data-name="Small"
                              >
                                <DesignText
                                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                                  data-node-id="428:5523"
                                >
                                  Pablo Escalante
                                </DesignText>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[107.398px]"
                          data-node-id="428:5524"
                          data-name="Table Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                            data-node-id="428:5525"
                          >
                            3
                          </DesignText>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[157.284px]"
                          data-node-id="428:5526"
                          data-name="Table Cell"
                        >
                          <div
                            className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0"
                            data-node-id="428:5527"
                            data-name="Badge · DS"
                          >
                            <Badge
                              className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0"
                              label="Consulta interna"
                            />
                          </div>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[77.683px]"
                          data-node-id="428:5529"
                          data-name="Table Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                            data-node-id="428:5530"
                          >
                            Activo
                          </DesignText>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[363.837px]"
                          data-node-id="428:5531"
                          data-name="Table Cell"
                        >
                          <div
                            className="content-stretch flex gap-[1.6px] h-[40px] items-start relative shrink-0 w-full"
                            data-node-id="428:5532"
                            data-name="CatalogManagement"
                          >
                            <div
                              className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                              data-node-id="428:5533"
                              data-name="Button · DS"
                            >
                              <Buttons
                                buttonText="Editar"
                                className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                                type="secondary"
                              />
                            </div>
                            <div
                              className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                              data-node-id="428:5535"
                              data-name="Button · DS"
                            >
                              <Buttons
                                buttonText="Ejemplares"
                                className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                                type="secondary"
                              />
                            </div>
                            <div
                              className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                              data-node-id="428:5537"
                              data-name="Button · DS"
                            >
                              <Buttons
                                buttonText="Historial"
                                className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                                type="secondary"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="content-stretch flex h-[74px] items-start overflow-clip relative shrink-0 w-full"
                        data-node-id="428:5545"
                        data-name="Libro · 3"
                      >
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[129.368px]"
                          data-node-id="428:5546"
                          data-name="Table Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                            data-node-id="428:5547"
                          >
                            MAT-515-STE
                          </DesignText>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[341.097px]"
                          data-node-id="428:5548"
                          data-name="Table Cell"
                        >
                          <div
                            className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                            data-node-id="428:5549"
                            data-name="CatalogManagement"
                          >
                            <div
                              className="h-[18.717px] relative shrink-0 w-full"
                              data-node-id="428:5550"
                              data-name="Container"
                            >
                              <DesignText
                                className="[word-break:break-word] absolute font-['Poppins:Medium'] leading-[18px] left-0 not-italic text-[#1f1f1f] text-[12px] top-[-1.33px] whitespace-nowrap"
                                data-node-id="428:5551"
                              >
                                Cálculo de una variable
                              </DesignText>
                            </div>
                            <div
                              className="content-stretch flex flex-col items-start pt-[3.2px] relative shrink-0 w-full"
                              data-node-id="428:5552"
                              data-name="Small:margin"
                            >
                              <div
                                className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                                data-node-id="428:5553"
                                data-name="Small"
                              >
                                <DesignText
                                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                                  data-node-id="428:5554"
                                >
                                  James Stewart
                                </DesignText>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[107.398px]"
                          data-node-id="428:5555"
                          data-name="Table Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                            data-node-id="428:5556"
                          >
                            6
                          </DesignText>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[157.284px]"
                          data-node-id="428:5557"
                          data-name="Table Cell"
                        >
                          <div
                            className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0"
                            data-node-id="428:5558"
                            data-name="Badge · DS"
                          >
                            <Badge
                              className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0"
                              label="Reservado"
                            />
                          </div>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[77.683px]"
                          data-node-id="428:5560"
                          data-name="Table Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                            data-node-id="428:5561"
                          >
                            Activo
                          </DesignText>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[363.837px]"
                          data-node-id="428:5562"
                          data-name="Table Cell"
                        >
                          <div
                            className="content-stretch flex gap-[1.6px] h-[40px] items-start relative shrink-0 w-full"
                            data-node-id="428:5563"
                            data-name="CatalogManagement"
                          >
                            <div
                              className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                              data-node-id="428:5564"
                              data-name="Button · DS"
                            >
                              <Buttons
                                buttonText="Editar"
                                className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                                type="secondary"
                              />
                            </div>
                            <div
                              className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                              data-node-id="428:5566"
                              data-name="Button · DS"
                            >
                              <Buttons
                                buttonText="Ejemplares"
                                className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                                type="secondary"
                              />
                            </div>
                            <div
                              className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                              data-node-id="428:5568"
                              data-name="Button · DS"
                            >
                              <Buttons
                                buttonText="Historial"
                                className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                                type="secondary"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="content-stretch flex h-[74px] items-start overflow-clip relative shrink-0 w-full"
                        data-node-id="428:5576"
                        data-name="Libro · 4"
                      >
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[129.368px]"
                          data-node-id="428:5577"
                          data-name="Table Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                            data-node-id="428:5578"
                          >
                            LIT-863-RUL
                          </DesignText>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[341.097px]"
                          data-node-id="428:5579"
                          data-name="Table Cell"
                        >
                          <div
                            className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                            data-node-id="428:5580"
                            data-name="CatalogManagement"
                          >
                            <div
                              className="h-[18.717px] relative shrink-0 w-full"
                              data-node-id="428:5581"
                              data-name="Container"
                            >
                              <DesignText
                                className="[word-break:break-word] absolute font-['Poppins:Medium'] leading-[18px] left-0 not-italic text-[#1f1f1f] text-[12px] top-[-1.33px] whitespace-nowrap"
                                data-node-id="428:5582"
                              >
                                Pedro Páramo
                              </DesignText>
                            </div>
                            <div
                              className="content-stretch flex flex-col items-start pt-[3.2px] relative shrink-0 w-full"
                              data-node-id="428:5583"
                              data-name="Small:margin"
                            >
                              <div
                                className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                                data-node-id="428:5584"
                                data-name="Small"
                              >
                                <DesignText
                                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                                  data-node-id="428:5585"
                                >
                                  Juan Rulfo
                                </DesignText>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[107.398px]"
                          data-node-id="428:5586"
                          data-name="Table Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                            data-node-id="428:5587"
                          >
                            3
                          </DesignText>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[157.284px]"
                          data-node-id="428:5588"
                          data-name="Table Cell"
                        >
                          <div
                            className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0"
                            data-node-id="428:5589"
                            data-name="Badge · DS"
                          >
                            <Badge
                              className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0"
                              label="Préstamo externo"
                            />
                          </div>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[77.683px]"
                          data-node-id="428:5591"
                          data-name="Table Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                            data-node-id="428:5592"
                          >
                            Activo
                          </DesignText>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[363.837px]"
                          data-node-id="428:5593"
                          data-name="Table Cell"
                        >
                          <div
                            className="content-stretch flex gap-[1.6px] h-[40px] items-start relative shrink-0 w-full"
                            data-node-id="428:5594"
                            data-name="CatalogManagement"
                          >
                            <div
                              className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                              data-node-id="428:5595"
                              data-name="Button · DS"
                            >
                              <Buttons
                                buttonText="Editar"
                                className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                                type="secondary"
                              />
                            </div>
                            <div
                              className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                              data-node-id="428:5597"
                              data-name="Button · DS"
                            >
                              <Buttons
                                buttonText="Ejemplares"
                                className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                                type="secondary"
                              />
                            </div>
                            <div
                              className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                              data-node-id="428:5599"
                              data-name="Button · DS"
                            >
                              <Buttons
                                buttonText="Historial"
                                className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                                type="secondary"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DynamicSlot>
                </div>
                <div
                  className="content-stretch flex items-center justify-between pt-[20px] relative shrink-0 w-full"
                  data-node-id="247:3000"
                  data-name="Pagination"
                >
                  <div
                    className="content-stretch flex flex-col items-start relative shrink-0"
                    data-node-id="247:3001"
                    data-name="Text"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                      data-node-id="247:3002"
                    >
                      Página 1 · 10 libros
                    </DesignText>
                  </div>
                  <div
                    className="content-stretch flex gap-[8px] items-center relative shrink-0"
                    data-node-id="247:3003"
                    data-name="Container"
                  >
                    <div
                      className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[83.133px]"
                      data-node-id="247:3004"
                      data-name="Button · DS"
                    />
                    <div
                      className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[91.133px]"
                      data-node-id="247:3006"
                      data-name="Button · DS"
                    />
                  </div>
                </div>
                <div
                  className="absolute content-stretch cursor-pointer flex gap-[12px] items-center justify-center left-[1035.33px] overflow-clip top-[575.33px] w-[167px]"
                  data-node-id="428:6072"
                  data-name="Paginación de gestión"
                >
                  <Buttons
                    buttonText="Anterior"
                    className="bg-[#eefcfa] content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[74px]"
                    state="disabled"
                  />
                  <Buttons
                    buttonText="Siguiente"
                    className="bg-[#00a99b] content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="bg-white border-[#cacaca] border-solid border-t-[0.667px] content-stretch flex h-[65.948px] items-start justify-between px-[32px] py-[24px] relative shrink-0 w-full"
          data-node-id="247:3008"
          data-name="Footer"
        >
          <div
            className="content-stretch flex flex-col h-full items-start relative shrink-0"
            data-node-id="247:3009"
            data-name="Text"
          >
            <DesignText
              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
              data-node-id="247:3010"
            >
              Universidad Ducky · Sistema de Biblioteca
            </DesignText>
          </div>
        </div>
      </div>
    </div>
  );
}
