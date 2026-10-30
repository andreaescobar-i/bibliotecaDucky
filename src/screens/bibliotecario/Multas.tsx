/*----
 * Programa: Multas.tsx
 * Objetivo: Implementación del módulo Multas
 */

import { DesignInput, DesignSelect, DesignText, DynamicSlot } from '../../design-controls';
const imgIdentidadBiblioteca = '/assets/e387d.png';
const imgSearch = '/assets/5ef97.svg';
const imgLucideChevronDown = '/assets/b1c28.svg';
type ButtonsProps = {
  className?: string;
  buttonText?: string;
  icons?: 'false';
  size?: 'small' | 'medium';
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
  const isMediumAndSecondary = size === 'medium' && type === 'secondary';
  const isSmallAndSecondary = size === 'small' && type === 'secondary';
  return (
    <button
      type="button"
      className={
        className ||
        `content-stretch flex items-center justify-center relative rounded-[8px] ${isMediumAndSecondary ? 'border border-[#007566] border-solid h-[45px] p-[10px]' : isSmallAndSecondary ? 'border border-[#007566] border-solid h-[40px] px-[10px] py-[5px]' : 'bg-[#00a99b] h-[40px] px-[10px] py-[5px]'}`
      }
      id={
        isMediumAndSecondary ? 'node-27_257' : isSmallAndSecondary ? 'node-27_255' : 'node-27_182'
      }
    >
      {size === 'small' && type === 'primary' && (
        <p
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap"
          data-node-id="27:180"
        >
          {buttonText}
        </p>
      )}
      {isSmallAndSecondary && (
        <p
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#007566] text-[12px] whitespace-nowrap"
          data-node-id="27:256"
        >
          {buttonText}
        </p>
      )}
      {isMediumAndSecondary && (
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
  state?: 'secondary' | 'terciary';
};
function Badge({ className, label = 'Estado', state = 'secondary' }: BadgeProps) {
  const isSecondary = state === 'secondary';
  return (
    <div
      className={
        className ||
        `border content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] ${isSecondary ? 'bg-[#e1e1e1] border-[#737373] border-solid' : 'bg-white border-[#4b4b4b] border-dashed'}`
      }
      id={isSecondary ? 'node-137_4663' : 'node-141_4665'}
    >
      {state === 'terciary' && (
        <p
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#4b4b4b] text-[12px] whitespace-nowrap"
          data-node-id="141:4666"
        >
          {label}
        </p>
      )}
      {isSecondary && (
        <p
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap"
          data-node-id="137:4664"
        >
          {label}
        </p>
      )}
    </div>
  );
}
export default function Multas() {
  return (
    <div
      className="bg-[#fafafa] content-stretch flex flex-col items-start relative size-full"
      data-node-id="207:849"
      data-name="multas y pagos - bibliotecario"
    >
      <div
        className="bg-[#fafafa] content-stretch flex flex-col items-start min-h-[422px] min-w-[320px] relative shrink-0 w-full"
        data-node-id="207:850"
        data-name="AppShell"
      >
        <div
          className="bg-white content-stretch flex flex-col items-start relative shrink-0 w-full"
          data-node-id="207:979"
          data-name="header"
        >
          <div
            className="backdrop-blur-[12px] bg-[rgba(255,255,255,0)] border-[#d4d4d4] border-b border-solid content-stretch flex gap-[12px] h-[76px] items-center px-[24px] relative shrink-0 w-full"
            data-node-id="I207:979;247:3311"
            data-name="Header · Bibliotecario"
          >
            <div
              className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex gap-[12px] h-[75px] items-center min-h-[40px] px-[14.4px] py-[8.8px] relative rounded-[6px] shrink-0 w-[183px]"
              data-node-id="I207:979;247:3312"
              data-name="Identidad · Biblioteca"
            >
              <img
                alt=""
                className="absolute inset-0 max-w-none object-contain pointer-events-none rounded-[6px] size-full"
                src={imgIdentidadBiblioteca}
              />
            </div>
            <div
              className="content-stretch cursor-pointer flex flex-[1_0_0] gap-[4px] h-[50px] items-center justify-center min-w-px px-[24px] relative"
              data-node-id="I207:979;247:3320"
              data-name="Navigation"
            >
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I207:979;247:3321"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I207:979;247:3321;144:1484"
                >
                  Préstamos
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I207:979;272:2415"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I207:979;272:2415;144:1484"
                >
                  Catálogo
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I207:979;247:3322"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I207:979;247:3322;144:1484"
                >
                  Devolución
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I207:979;247:3323"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I207:979;247:3323;144:1484"
                >
                  Renovación
                </DesignText>
              </button>
              <button
                className="bg-[#00a99b] border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I207:979;247:3324"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap"
                  data-node-id="I207:979;247:3324;144:1469"
                >
                  Multas y pagos
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I207:979;247:3325"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I207:979;247:3325;144:1484"
                >
                  Suspendidos
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I207:979;247:3360"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I207:979;247:3360;144:1484"
                >
                  Gestión de libros
                </DesignText>
              </button>
            </div>
            <div
              className="content-stretch flex h-[75px] items-center justify-end overflow-clip relative shrink-0 w-[250px]"
              data-node-id="I207:979;247:3332"
              data-name="Container"
            >
              <div
                className="content-stretch flex gap-[9.6px] items-center relative shrink-0"
                data-node-id="I207:979;247:3340"
                data-name="Container"
              >
                <div
                  className="bg-[#262626] grid grid-cols-[_32px] grid-rows-[_32px] relative rounded-[16px] shrink-0 size-[32px]"
                  data-node-id="I207:979;247:3341"
                  data-name="Text"
                >
                  <DesignText
                    className="[word-break:break-word] col-1 font-['Poppins:Medium'] justify-self-center leading-[18px] not-italic relative row-1 self-center shrink-0 text-[12px] text-white whitespace-nowrap"
                    data-node-id="I207:979;247:3342"
                  >
                    ML
                  </DesignText>
                </div>
                <div
                  className="content-stretch cursor-pointer flex flex-col items-start relative shrink-0 w-[89.641px]"
                  data-node-id="I207:979;247:3343"
                  data-name="Container"
                >
                  <button
                    className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                    data-node-id="I207:979;247:3344"
                    data-name="Bold Text"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] text-left whitespace-nowrap"
                      data-node-id="I207:979;247:3345"
                    >
                      Mariana López
                    </DesignText>
                  </button>
                  <button
                    className="content-stretch flex flex-col h-[18px] items-start max-w-[160px] overflow-clip relative shrink-0 w-full"
                    data-node-id="I207:979;247:3346"
                    data-name="Small"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] text-left whitespace-nowrap"
                      data-node-id="I207:979;247:3347"
                    >
                      Alumno
                    </DesignText>
                  </button>
                </div>
              </div>
              <div
                className="content-stretch cursor-pointer flex items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                data-node-id="I207:979;247:3348"
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
          data-node-id="207:871"
          data-name="Main Content:margin"
        >
          <div
            className="content-stretch flex flex-col items-start min-h-[278px] pb-[80px] pt-[56px] relative shrink-0 w-full"
            data-node-id="207:872"
            data-name="Main Content"
          >
            <div
              className="content-stretch flex h-[90px] items-end justify-between relative shrink-0 w-full"
              data-node-id="207:873"
              data-name="PageHeader"
            >
              <div
                className="content-stretch flex flex-col items-start relative shrink-0 w-[460.271px]"
                data-node-id="207:874"
                data-name="Container"
              >
                <div
                  className="content-stretch flex flex-col items-start min-h-[36px] relative shrink-0 w-full"
                  data-node-id="207:875"
                  data-name="Heading"
                >
                  <DesignText
                    className="[word-break:break-word] font-['Poppins:Medium'] leading-[32px] not-italic relative shrink-0 text-[#1f1f1f] text-[24px] whitespace-nowrap"
                    data-node-id="207:876"
                  >
                    Multas y pagos
                  </DesignText>
                </div>
                <div
                  className="content-stretch flex flex-col h-[34.8px] items-start max-w-[720px] pt-[8.8px] relative shrink-0 w-[460.271px]"
                  data-node-id="207:877"
                  data-name="Paragraph"
                >
                  <DesignText
                    className="[word-break:break-word] font-['Poppins:Medium'] leading-[24px] not-italic relative shrink-0 text-[#4b4b4b] text-[16px] whitespace-nowrap"
                    data-node-id="207:878"
                  >
                    Consulta adeudos y registra comprobantes pagados en Tesorería.
                  </DesignText>
                </div>
              </div>
              <div
                className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[175px]"
                data-node-id="207:879"
                data-name="Button · DS"
              >
                <Buttons
                  buttonText="Reportar libro perdido"
                  className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                  type="secondary"
                />
              </div>
            </div>
            <div
              className="content-stretch flex flex-col items-start pb-[20px] pt-[32px] relative shrink-0 w-full"
              data-node-id="207:881"
              data-name="Panel:margin"
            >
              <div
                className="bg-white border-[#e1e1e1] border-[0.667px] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col items-start p-[24px] relative rounded-[12px] shrink-0 w-full"
                data-node-id="207:882"
                data-name="Panel"
              >
                <div
                  className="bg-[#fafafa] border-[#eee] border-[0.667px] border-solid gap-x-[12px] gap-y-[12px] grid grid-cols-[___minmax(0,1fr)_239.21px_67.03px] grid-rows-[_64.62px] p-[16px] relative rounded-[8px] shrink-0 w-full"
                  data-node-id="207:883"
                  data-name="Toolbar"
                >
                  <div
                    className="col-1 content-stretch flex flex-col gap-[6.4px] items-start justify-self-stretch relative row-1 self-end shrink-0"
                    data-node-id="207:884"
                    data-name="Field"
                  >
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="207:885"
                      data-name="Text"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                        data-node-id="207:886"
                      >
                        Buscar alumno
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] overflow-clip relative rounded-[6px] shrink-0 w-full"
                      data-node-id="207:887"
                      data-name="Input · DS"
                    >
                      <DesignInput
                        className="block cursor-pointer flex-[1_0_0] h-[40px] min-w-px relative rounded-[4px]"
                        data-node-id="207:888"
                        data-name="Left icon"
                        label="Buscar alumno"
                        initialValue=""
                      >
                        <div
                          className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
                          data-node-id="I207:888;65:3042"
                          data-name="Base"
                        />
                        <div
                          className="-translate-y-1/2 absolute left-[12px] size-[18px] top-1/2"
                          data-node-id="I207:888;65:3043"
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
                          data-node-id="I207:888;65:3044"
                        >
                          ​
                        </DesignText>
                      </DesignInput>
                    </div>
                  </div>
                  <div
                    className="col-2 content-stretch flex flex-col gap-[6.4px] items-start justify-self-stretch relative row-1 self-end shrink-0"
                    data-node-id="207:889"
                    data-name="Field"
                  >
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="207:890"
                      data-name="Text"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                        data-node-id="207:891"
                      >
                        Estado
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] overflow-clip relative rounded-[6px] shrink-0 w-[239.208px]"
                      data-node-id="207:892"
                      data-name="Select · DS"
                    >
                      <DesignSelect
                        className="border border-[#cacaca] border-solid content-stretch cursor-pointer flex flex-col gap-[2px] h-[32px] items-start overflow-clip relative rounded-[10px] shrink-0 w-[239.208px]"
                        data-node-id="207:893"
                        data-name="dropdown"
                        label="Estado"
                        initialValue="Todas"
                      >
                        <div
                          className="content-stretch flex gap-[10px] h-[32px] items-center justify-center overflow-clip p-[10px] relative rounded-[10px] shrink-0 w-full"
                          data-node-id="I207:893;7:1352"
                          data-name="dropdown-input"
                        >
                          <DesignText
                            className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[#4b4b4b] text-[12px] text-left"
                            data-node-id="I207:893;7:1353"
                          >
                            Todas
                          </DesignText>
                          <div
                            className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[15px]"
                            data-node-id="I207:893;7:1354"
                            data-name="Container"
                          >
                            <div
                              className="relative shrink-0 size-[12px]"
                              data-node-id="I207:893;7:1354;7:710"
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
                    data-node-id="207:894"
                    data-name="Button · DS"
                  >
                    <Buttons
                      buttonText="Filtrar"
                      className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                      type="secondary"
                    />
                  </div>
                </div>
                <DynamicSlot
                  className="content-stretch flex flex-col h-[348px] items-start overflow-clip pt-[24px] relative shrink-0 w-full"
                  data-node-id="207:896"
                  data-name="Table"
                >
                  <div
                    className="grid grid-cols-[______minmax(0,166.36fr)_minmax(0,148.17fr)_minmax(0,107.50fr)_minmax(0,85.58fr)_minmax(0,158.76fr)_minmax(0,175.62fr)] grid-rows-[repeat(4,fit-content(100%))] h-[239.583px] relative shrink-0 w-full"
                    data-node-id="207:897"
                    data-name="Table"
                  >
                    <div
                      className="border-[#8e8e8e] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0"
                      data-node-id="207:898"
                      data-name="Header Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                        data-node-id="207:899"
                      >
                        Alumno
                      </DesignText>
                    </div>
                    <div
                      className="border-[#8e8e8e] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0"
                      data-node-id="207:900"
                      data-name="Header Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                        data-node-id="207:901"
                      >
                        Concepto
                      </DesignText>
                    </div>
                    <div
                      className="border-[#8e8e8e] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0"
                      data-node-id="207:902"
                      data-name="Header Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                        data-node-id="207:903"
                      >
                        Fecha
                      </DesignText>
                    </div>
                    <div
                      className="border-[#8e8e8e] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0"
                      data-node-id="207:904"
                      data-name="Header Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                        data-node-id="207:905"
                      >
                        Monto
                      </DesignText>
                    </div>
                    <div
                      className="border-[#8e8e8e] border-b-[0.667px] border-solid col-5 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0"
                      data-node-id="207:906"
                      data-name="Header Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                        data-node-id="207:907"
                      >
                        Estado
                      </DesignText>
                    </div>
                    <div
                      className="border-[#8e8e8e] border-b-[0.667px] border-solid col-6 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0"
                      data-node-id="207:908"
                      data-name="Header Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                        data-node-id="207:909"
                      >
                        Acción
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 self-start shrink-0"
                      data-node-id="207:910"
                      data-name="Table Cell"
                    >
                      <div
                        className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                        data-node-id="207:911"
                        data-name="Fines"
                      >
                        <div
                          className="h-[18.717px] relative shrink-0 w-full"
                          data-node-id="207:912"
                          data-name="Container"
                        >
                          <DesignText
                            className="[word-break:break-word] absolute font-['Poppins:Medium'] leading-[18px] left-0 not-italic text-[#1f1f1f] text-[12px] top-[-1.33px] whitespace-nowrap"
                            data-node-id="207:913"
                          >
                            Ana Torres Ruiz
                          </DesignText>
                        </div>
                        <div
                          className="content-stretch flex flex-col items-start pt-[3.2px] relative shrink-0 w-full"
                          data-node-id="207:914"
                          data-name="Small:margin"
                        >
                          <div
                            className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                            data-node-id="207:915"
                            data-name="Small"
                          >
                            <DesignText
                              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                              data-node-id="207:916"
                            >
                              A01678234
                            </DesignText>
                          </div>
                        </div>
                        <div
                          className="[word-break:break-word] content-stretch flex flex-col font-['Poppins:Medium'] gap-[2px] items-start leading-[18px] not-italic overflow-clip relative shrink-0 text-[#737373] text-[12px] w-full"
                          data-node-id="348:1872"
                          data-name="Estatus escolar del alumno"
                        >
                          <DesignText className="relative shrink-0 w-full" data-node-id="348:1873">
                            Estatus escolar
                          </DesignText>
                          <DesignText className="relative shrink-0 w-full" data-node-id="348:1874">
                            Inscrito
                          </DesignText>
                        </div>
                      </div>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 self-stretch shrink-0"
                      data-node-id="207:917"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:918"
                      >
                        12 días de retraso
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 self-stretch shrink-0"
                      data-node-id="207:919"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:920"
                      >
                        10 oct 2025
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 self-stretch shrink-0"
                      data-node-id="207:921"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:922"
                      >
                        $120.00
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-5 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 self-stretch shrink-0"
                      data-node-id="207:923"
                      data-name="Table Cell"
                    >
                      <div
                        className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0"
                        data-node-id="207:924"
                        data-name="Badge · DS"
                      >
                        <Badge
                          className="bg-white border border-[#4b4b4b] border-dashed content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0"
                          label="Pendiente"
                          state="terciary"
                        />
                      </div>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-6 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 self-stretch shrink-0"
                      data-node-id="207:926"
                      data-name="Table Cell"
                    >
                      <div
                        className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[125px]"
                        data-node-id="207:927"
                        data-name="Button · DS"
                      >
                        <Buttons
                          buttonText="Registrar pago"
                          className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                          type="secondary"
                        />
                      </div>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 self-stretch shrink-0"
                      data-node-id="207:929"
                      data-name="Table Cell"
                    >
                      <div
                        className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                        data-node-id="207:930"
                        data-name="Fines"
                      >
                        <div
                          className="h-[18.717px] relative shrink-0 w-full"
                          data-node-id="207:931"
                          data-name="Container"
                        >
                          <DesignText
                            className="[word-break:break-word] absolute font-['Poppins:Medium'] leading-[18px] left-0 not-italic text-[#1f1f1f] text-[12px] top-[-1.33px] whitespace-nowrap"
                            data-node-id="207:932"
                          >
                            Rodrigo Díaz
                          </DesignText>
                        </div>
                        <div
                          className="content-stretch flex flex-col items-start pt-[3.2px] relative shrink-0 w-full"
                          data-node-id="207:933"
                          data-name="Small:margin"
                        >
                          <div
                            className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                            data-node-id="207:934"
                            data-name="Small"
                          >
                            <DesignText
                              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                              data-node-id="207:935"
                            >
                              A01987654
                            </DesignText>
                          </div>
                        </div>
                        <div
                          className="[word-break:break-word] content-stretch flex flex-col font-['Poppins:Medium'] gap-[2px] items-start leading-[18px] not-italic overflow-clip relative shrink-0 text-[#737373] text-[12px] w-full"
                          data-node-id="348:1875"
                          data-name="Estatus escolar del alumno"
                        >
                          <DesignText className="relative shrink-0 w-full" data-node-id="348:1876">
                            Estatus escolar
                          </DesignText>
                          <DesignText className="relative shrink-0 w-full" data-node-id="348:1877">
                            Inscrito
                          </DesignText>
                        </div>
                      </div>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 self-stretch shrink-0"
                      data-node-id="207:936"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:937"
                      >
                        5 días de retraso
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 self-stretch shrink-0"
                      data-node-id="207:938"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:939"
                      >
                        12 oct 2025
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 self-stretch shrink-0"
                      data-node-id="207:940"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:941"
                      >
                        $50.00
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-5 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 self-stretch shrink-0"
                      data-node-id="207:942"
                      data-name="Table Cell"
                    >
                      <div
                        className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0"
                        data-node-id="207:943"
                        data-name="Badge · DS"
                      >
                        <Badge
                          className="bg-white border border-[#4b4b4b] border-dashed content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0"
                          label="Por registrar"
                          state="terciary"
                        />
                      </div>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-6 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 self-stretch shrink-0"
                      data-node-id="207:945"
                      data-name="Table Cell"
                    >
                      <div
                        className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[125px]"
                        data-node-id="207:946"
                        data-name="Button · DS"
                      >
                        <Buttons
                          buttonText="Registrar pago"
                          className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                          type="secondary"
                        />
                      </div>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col h-[64.74px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0"
                      data-node-id="207:948"
                      data-name="Table Cell"
                    >
                      <div
                        className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                        data-node-id="207:949"
                        data-name="Fines"
                      >
                        <div
                          className="h-[18.717px] relative shrink-0 w-full"
                          data-node-id="207:950"
                          data-name="Container"
                        >
                          <DesignText
                            className="[word-break:break-word] absolute font-['Poppins:Medium'] leading-[18px] left-0 not-italic text-[#1f1f1f] text-[12px] top-[-1.33px] whitespace-nowrap"
                            data-node-id="207:951"
                          >
                            Laura Méndez Soto
                          </DesignText>
                        </div>
                        <div
                          className="content-stretch flex flex-col items-start pt-[3.2px] relative shrink-0 w-full"
                          data-node-id="207:952"
                          data-name="Small:margin"
                        >
                          <div
                            className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                            data-node-id="207:953"
                            data-name="Small"
                          >
                            <DesignText
                              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                              data-node-id="207:954"
                            >
                              M004129
                            </DesignText>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col h-[64.74px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0"
                      data-node-id="207:955"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:956"
                      >
                        8 días de retraso
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col h-[64.74px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0"
                      data-node-id="207:957"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:958"
                      >
                        03 oct 2025
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col h-[64.74px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0"
                      data-node-id="207:959"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:960"
                      >
                        $80.00
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-5 content-stretch flex flex-col h-[64.74px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0"
                      data-node-id="207:961"
                      data-name="Table Cell"
                    >
                      <div
                        className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0"
                        data-node-id="207:962"
                        data-name="Badge · DS"
                      >
                        <Badge
                          className="bg-[#e1e1e1] border border-[#737373] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0"
                          label="Pagada · F-88421"
                        />
                      </div>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-6 content-stretch flex flex-col h-[64.74px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0"
                      data-node-id="207:964"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:965"
                      >
                        Registrada
                      </DesignText>
                    </div>
                  </div>
                </DynamicSlot>
                <div
                  className="content-stretch flex items-center justify-between pt-[20px] relative shrink-0 w-full"
                  data-node-id="207:966"
                  data-name="Pagination"
                >
                  <div
                    className="content-stretch flex flex-col items-start relative shrink-0"
                    data-node-id="207:967"
                    data-name="Text"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                      data-node-id="207:968"
                    >
                      Mostrando 1–3 de 3
                    </DesignText>
                  </div>
                  <div
                    className="content-stretch flex gap-[8px] items-center relative shrink-0"
                    data-node-id="207:969"
                    data-name="Container"
                  >
                    <div
                      className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[83.133px]"
                      data-node-id="207:970"
                      data-name="Button · DS"
                    >
                      <button
                        className="aspect-[77/40] bg-[#eefcfa] content-stretch cursor-pointer flex items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                        data-node-id="207:971"
                        data-name="Buttons"
                      >
                        <DesignText
                          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-left whitespace-nowrap"
                          data-node-id="I207:971;27:274"
                        >
                          Anterior
                        </DesignText>
                      </button>
                    </div>
                    <div
                      className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[91.133px]"
                      data-node-id="207:972"
                      data-name="Button · DS"
                    >
                      <Buttons
                        buttonText="Siguiente"
                        className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="bg-white border-[#cacaca] border-solid border-t-[0.667px] content-stretch flex h-[65.948px] items-start justify-between px-[32px] py-[24px] relative shrink-0 w-full"
          data-node-id="207:974"
          data-name="Footer"
        >
          <div
            className="content-stretch flex flex-col h-full items-start relative shrink-0"
            data-node-id="207:975"
            data-name="Text"
          >
            <DesignText
              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
              data-node-id="207:976"
            >
              Universidad Ducky · Sistema de Biblioteca
            </DesignText>
          </div>
        </div>
      </div>
    </div>
  );
}
