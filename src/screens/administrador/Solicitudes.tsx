/*----
 * Programa: Solicitudes.tsx
 * Objetivo: Implementación del módulo Solicitudes
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
export default function Solicitudes() {
  return (
    <div
      className="bg-[#fafafa] content-stretch flex flex-col items-start relative size-full"
      data-node-id="2081:3418"
      data-name="solicitudes de libros - administrador"
    >
      <div
        className="bg-[#fafafa] content-stretch flex flex-col items-start min-w-[320px] relative shrink-0 w-full"
        data-node-id="2081:3419"
        data-name="AppShell"
      >
        <div
          className="bg-white content-stretch flex flex-col h-[76px] items-start relative shrink-0 w-full"
          data-node-id="2081:3421"
          data-name="header"
        >
          <div
            className="absolute backdrop-blur-[12px] bg-[rgba(255,255,255,0)] border-[#d4d4d4] border-b border-solid content-stretch flex gap-[20px] h-[76px] items-center left-0 pl-[48px] pr-[32px] top-0 w-[1280px]"
            data-node-id="I2081:3421;62:561"
            data-name="Header"
          >
            <div
              className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex gap-[12px] h-[75px] items-center min-h-[40px] px-[14.4px] py-[8.8px] relative rounded-[6px] shrink-0 w-[182.914px]"
              data-node-id="I2081:3421;62:562"
              data-name="Identidad · Biblioteca"
            >
              <img
                alt=""
                className="absolute inset-0 max-w-none object-contain pointer-events-none rounded-[6px] size-full"
                src={imgIdentidadBiblioteca}
              />
            </div>
            <div
              className="content-stretch flex flex-[1_0_0] gap-[12px] h-[50px] items-center justify-center min-w-px px-[24px] relative"
              data-node-id="I2081:3421;62:570"
              data-name="Navigation"
            >
              <button
                className="bg-[#00a99b] border border-[rgba(0,0,0,0)] border-solid content-stretch cursor-pointer flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I2081:3421;207:687"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap"
                  data-node-id="I2081:3421;207:687;144:1469"
                >
                  Compras
                </DesignText>
              </button>
            </div>
            <div
              className="content-stretch flex gap-[24px] h-[75px] items-center justify-end overflow-clip relative shrink-0"
              data-node-id="I2081:3421;62:576"
              data-name="Container"
            >
              <div
                className="content-stretch flex gap-[9.6px] items-center relative shrink-0"
                data-node-id="I2081:3421;62:584"
                data-name="Container"
              >
                <div
                  className="bg-[#262626] grid grid-cols-[_32px] grid-rows-[_32px] relative rounded-[16px] shrink-0 size-[32px]"
                  data-node-id="I2081:3421;62:585"
                  data-name="Text"
                >
                  <DesignText
                    className="[word-break:break-word] col-1 font-['Poppins:Regular'] justify-self-center leading-[18px] not-italic relative row-1 self-center shrink-0 text-[12px] text-white whitespace-nowrap"
                    data-node-id="I2081:3421;62:586"
                  >
                    ML
                  </DesignText>
                </div>
                <div
                  className="content-stretch cursor-pointer flex flex-col items-start relative shrink-0"
                  data-node-id="I2081:3421;62:587"
                  data-name="Container"
                >
                  <button
                    className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                    data-node-id="I2081:3421;62:588"
                    data-name="Bold Text"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] text-left whitespace-nowrap"
                      data-node-id="I2081:3421;62:589"
                    >
                      Mariana López
                    </DesignText>
                  </button>
                  <button
                    className="content-stretch flex flex-col h-[18px] items-start max-w-[160px] overflow-clip relative shrink-0"
                    data-node-id="I2081:3421;62:590"
                    data-name="Small"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Regular'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] text-left whitespace-nowrap"
                      data-node-id="I2081:3421;62:591"
                    >
                      Alumno
                    </DesignText>
                  </button>
                </div>
              </div>
              <div
                className="content-stretch cursor-pointer flex items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                data-node-id="I2081:3421;62:592"
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
          data-node-id="2081:3422"
          data-name="Main Content:margin"
        >
          <div
            className="content-stretch flex flex-col items-start min-h-[278px] pb-[80px] pt-[56px] relative shrink-0 w-full"
            data-node-id="2081:3423"
            data-name="Main Content"
          >
            <div
              className="content-stretch flex h-[90px] items-end justify-between relative shrink-0 w-full"
              data-node-id="2081:3424"
              data-name="PageHeader"
            >
              <div
                className="content-stretch flex flex-col items-start relative shrink-0 w-[356.573px]"
                data-node-id="2081:3425"
                data-name="Container"
              >
                <div
                  className="content-stretch flex flex-col items-start min-h-[36px] relative shrink-0 w-full"
                  data-node-id="2081:3426"
                  data-name="Heading"
                >
                  <DesignText
                    className="[word-break:break-word] font-['Poppins:Medium'] leading-[32px] not-italic relative shrink-0 text-[#1f1f1f] text-[24px] whitespace-nowrap"
                    data-node-id="2081:3427"
                  >
                    Solicitudes de libros
                  </DesignText>
                </div>
                <div
                  className="content-stretch flex flex-col h-[34.8px] items-start max-w-[720px] pt-[8.8px] relative shrink-0 w-[356.573px]"
                  data-node-id="2081:3428"
                  data-name="Paragraph"
                >
                  <DesignText
                    className="[word-break:break-word] font-['Poppins:Medium'] leading-[24px] not-italic relative shrink-0 text-[#4b4b4b] text-[16px] whitespace-nowrap"
                    data-node-id="2081:3429"
                  >
                    Solicita libros y actualiza la lista para consultar el avance de tus
                    solicitudes.
                  </DesignText>
                </div>
              </div>
              <div
                className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[140px]"
                data-node-id="2081:3430"
                data-name="Button · DS"
              >
                <Buttons
                  buttonText="+ Solicitar libro"
                  className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                />
              </div>
            </div>
            <div
              className="content-stretch flex flex-col items-start py-[20px] relative shrink-0 w-full"
              data-node-id="2081:3445"
              data-name="Panel:margin"
            >
              <div
                className="bg-white border-[#e1e1e1] border-[0.667px] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col items-start p-[24px] relative rounded-[12px] shrink-0 w-full"
                data-node-id="2081:3446"
                data-name="Panel"
              >
                <div
                  className="bg-[#fafafa] border-[#eee] border-[0.667px] border-solid gap-x-[12px] gap-y-[12px] grid grid-cols-[___523.10px_261.56px_0px] grid-rows-[_64.62px] p-[16px] relative rounded-[8px] shrink-0 w-full"
                  data-node-id="2081:3447"
                  data-name="Toolbar"
                >
                  <div
                    className="col-1 content-stretch flex flex-col gap-[6.4px] items-start justify-self-stretch relative row-1 self-end shrink-0"
                    data-node-id="2081:3448"
                    data-name="Field"
                  >
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="2081:3449"
                      data-name="Text"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                        data-node-id="2081:3450"
                      >
                        Buscar petición
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] overflow-clip relative rounded-[6px] shrink-0 w-[523.104px]"
                      data-node-id="2081:3451"
                      data-name="Input · DS"
                    >
                      <DesignInput
                        className="block cursor-pointer h-[40px] relative rounded-[4px] shrink-0 w-[523.104px]"
                        data-node-id="2081:3452"
                        data-name="Left icon"
                        label="Buscar petición"
                        initialValue=""
                      >
                        <div
                          className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
                          data-node-id="I2081:3452;65:3042"
                          data-name="Base"
                        />
                        <div
                          className="-translate-y-1/2 absolute left-[12px] size-[18px] top-1/2"
                          data-node-id="I2081:3452;65:3043"
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
                          data-node-id="I2081:3452;65:3044"
                        >
                          ​
                        </DesignText>
                      </DesignInput>
                    </div>
                  </div>
                  <div
                    className="col-2 content-stretch flex flex-col gap-[6.4px] items-start justify-self-stretch relative row-1 self-end shrink-0"
                    data-node-id="2081:3453"
                    data-name="Field"
                  >
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="2081:3454"
                      data-name="Text"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                        data-node-id="2081:3455"
                      >
                        Estado
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] overflow-clip relative rounded-[6px] shrink-0 w-[261.563px]"
                      data-node-id="2081:3456"
                      data-name="Select · DS"
                    >
                      <DesignSelect
                        className="border border-[#cacaca] border-solid content-stretch cursor-pointer flex flex-col gap-[2px] h-[32px] items-start overflow-clip relative rounded-[10px] shrink-0 w-[261.563px]"
                        data-node-id="2081:3457"
                        data-name="dropdown"
                        label="Estado"
                        initialValue="Todos"
                      >
                        <div
                          className="content-stretch flex gap-[10px] h-[32px] items-center justify-center overflow-clip p-[10px] relative rounded-[10px] shrink-0 w-full"
                          data-node-id="I2081:3457;7:1352"
                          data-name="dropdown-input"
                        >
                          <DesignText
                            className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[#4b4b4b] text-[12px] text-left"
                            data-node-id="I2081:3457;7:1353"
                          >
                            Todos
                          </DesignText>
                          <div
                            className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[15px]"
                            data-node-id="I2081:3457;7:1354"
                            data-name="Container"
                          >
                            <div
                              className="relative shrink-0 size-[12px]"
                              data-node-id="I2081:3457;7:1354;7:710"
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
                </div>
                <DynamicSlot
                  className="content-stretch flex flex-col h-[484px] items-start pt-[24px] relative shrink-0 w-full"
                  data-node-id="2081:3458"
                  data-name="Table"
                >
                  <div
                    className="grid grid-cols-[______minmax(0,74.47fr)_minmax(0,225.93fr)_minmax(0,124.12fr)_minmax(0,119.90fr)_minmax(0,109.41fr)_minmax(0,188.18fr)] grid-rows-[______40px_84px_84px_84px_84px_84px] h-[460px] relative shrink-0 w-full"
                    data-node-id="2081:3459"
                    data-name="Table"
                  >
                    <div
                      className="border-[#8e8e8e] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0"
                      data-node-id="2081:3460"
                      data-name="Header Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                        data-node-id="2081:3461"
                      >
                        Folio
                      </DesignText>
                    </div>
                    <div
                      className="border-[#8e8e8e] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0"
                      data-node-id="2081:3462"
                      data-name="Header Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                        data-node-id="2081:3463"
                      >
                        Libro solicitado
                      </DesignText>
                    </div>
                    <div
                      className="border-[#8e8e8e] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0"
                      data-node-id="2081:3464"
                      data-name="Header Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                        data-node-id="2081:3465"
                      >
                        Solicitante
                      </DesignText>
                    </div>
                    <div
                      className="border-[#8e8e8e] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0"
                      data-node-id="2081:3466"
                      data-name="Header Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                        data-node-id="2081:3467"
                      >
                        Costo estimado
                      </DesignText>
                    </div>
                    <div
                      className="border-[#8e8e8e] border-b-[0.667px] border-solid col-5 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0"
                      data-node-id="2081:3468"
                      data-name="Header Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                        data-node-id="2081:3469"
                      >
                        Estado
                      </DesignText>
                    </div>
                    <div
                      className="border-[#8e8e8e] border-b-[0.667px] border-solid col-6 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0"
                      data-node-id="2081:3470"
                      data-name="Header Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                        data-node-id="2081:3471"
                      >
                        Acción
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 shrink-0"
                      data-node-id="2081:3472"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="2081:3473"
                      >
                        SOL-2418
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 shrink-0"
                      data-node-id="2081:3474"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="2081:3475"
                      >
                        Diseño de sistemas interactivos
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 shrink-0"
                      data-node-id="2081:3476"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="2081:3477"
                      >
                        Facultad de Diseño
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 shrink-0"
                      data-node-id="2081:3478"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="2081:3479"
                      >
                        2340.00
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-5 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 shrink-0"
                      data-node-id="2081:3480"
                      data-name="Table Cell"
                    >
                      <div
                        className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0"
                        data-node-id="2081:3481"
                        data-name="Badge · DS"
                      >
                        <div
                          className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0"
                          data-node-id="2081:3482"
                          data-name="Badge"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#4b4b4b] text-[12px] whitespace-nowrap"
                            data-node-id="I2081:3482;137:4655"
                          >
                            Por autorizar
                          </DesignText>
                        </div>
                      </div>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-6 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 shrink-0"
                      data-node-id="2081:3483"
                      data-name="Table Cell"
                    >
                      <div
                        className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[74.354px]"
                        data-node-id="2081:3484"
                        data-name="Button · DS"
                      >
                        <Buttons
                          buttonText="Ver historial"
                          className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                          type="secondary"
                        />
                      </div>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col h-[78.271px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 shrink-0"
                      data-node-id="2081:3486"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="2081:3487"
                      >
                        SOL-2391
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col h-[78.271px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 shrink-0"
                      data-node-id="2081:3488"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="2081:3489"
                      >
                        Artificial Intelligence: A Modern Approach
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col h-[78.271px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 shrink-0"
                      data-node-id="2081:3490"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="2081:3491"
                      >
                        Ing. Computación
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col h-[78.271px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 shrink-0"
                      data-node-id="2081:3492"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="2081:3493"
                      >
                        1820.00
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-5 content-stretch flex flex-col h-[78.271px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 shrink-0"
                      data-node-id="2081:3494"
                      data-name="Table Cell"
                    >
                      <div
                        className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0"
                        data-node-id="2081:3495"
                        data-name="Badge · DS"
                      >
                        <div
                          className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0"
                          data-node-id="2081:3496"
                          data-name="Badge"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#4b4b4b] text-[12px] whitespace-nowrap"
                            data-node-id="I2081:3496;137:4655"
                          >
                            Autorizado
                          </DesignText>
                        </div>
                      </div>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-6 content-stretch flex flex-col h-[78.271px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 shrink-0"
                      data-node-id="2081:3497"
                      data-name="Table Cell"
                    >
                      <div
                        className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[158px]"
                        data-node-id="2081:3498"
                        data-name="Button · DS"
                      >
                        <Buttons
                          buttonText="Ver historial"
                          className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                          type="secondary"
                        />
                      </div>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0"
                      data-node-id="2081:3500"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="2081:3501"
                      >
                        SOL-2345
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0"
                      data-node-id="2081:3502"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="2081:3503"
                      >
                        El infinito en un junco
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0"
                      data-node-id="2081:3504"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="2081:3505"
                      >
                        Humanidades
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0"
                      data-node-id="2081:3506"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="2081:3507"
                      >
                        540.00
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-5 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0"
                      data-node-id="2081:3508"
                      data-name="Table Cell"
                    >
                      <div
                        className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0"
                        data-node-id="2081:3509"
                        data-name="Badge · DS"
                      >
                        <div
                          className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0"
                          data-node-id="2081:3510"
                          data-name="Badge"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#4b4b4b] text-[12px] whitespace-nowrap"
                            data-node-id="I2081:3510;137:4655"
                          >
                            Recibido
                          </DesignText>
                        </div>
                      </div>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-6 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0"
                      data-node-id="2081:3511"
                      data-name="Table Cell"
                    >
                      <div
                        className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[144px]"
                        data-node-id="2081:3512"
                        data-name="Button · DS"
                      >
                        <Buttons
                          buttonText="Ver historial"
                          className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                          type="secondary"
                        />
                      </div>
                    </div>
                  </div>
                </DynamicSlot>
                <div
                  className="content-stretch flex items-center justify-between pt-[20px] relative shrink-0 w-full"
                  data-node-id="2081:3528"
                  data-name="Pagination"
                >
                  <div
                    className="content-stretch flex flex-col items-start relative shrink-0"
                    data-node-id="2081:3529"
                    data-name="Text"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                      data-node-id="2081:3530"
                    >
                      Mostrando 1–3 de 3
                    </DesignText>
                  </div>
                  <div
                    className="content-stretch flex gap-[8px] items-center relative shrink-0"
                    data-node-id="2081:3531"
                    data-name="Container"
                  >
                    <div
                      className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[83.133px]"
                      data-node-id="2081:3532"
                      data-name="Button · DS"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Regular'] leading-[normal] not-italic relative shrink-0 text-[12px] text-black w-[110px]"
                        data-node-id="2185:2291"
                      >
                        Hoja 1 de 1
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[91.133px]"
                      data-node-id="2081:3534"
                      data-name="Button · DS"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="bg-white content-stretch cursor-pointer flex gap-[16px] items-start overflow-clip relative shrink-0"
              data-node-id="2081:3536"
              data-name="Seguimiento de solicitudes"
            >
              <Buttons
                buttonText="Actualizar lista de solicitudes"
                className="bg-[#00a99b] content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
              />
              <Buttons
                buttonText="Historial de adquisiciones"
                className="bg-[#00a99b] content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
              />
            </div>
          </div>
        </div>
        <div
          className="bg-white border-[#cacaca] border-solid border-t-[0.667px] content-stretch flex h-[65.948px] items-start justify-between px-[32px] py-[24px] relative shrink-0 w-full"
          data-node-id="2081:3539"
          data-name="Footer"
        >
          <div
            className="content-stretch flex flex-col h-full items-start relative shrink-0"
            data-node-id="2081:3540"
            data-name="Text"
          >
            <DesignText
              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
              data-node-id="2081:3541"
            >
              Universidad Ducky · Sistema de Biblioteca
            </DesignText>
          </div>
        </div>
      </div>
    </div>
  );
}
