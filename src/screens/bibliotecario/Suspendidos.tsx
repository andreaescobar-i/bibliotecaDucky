/*----
 * Programa: Suspendidos.tsx
 * Objetivo: Implementación del módulo Suspendidos
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
  state?: 'terciary' | 'fourth';
};
function Badge({ className, label = 'Estado', state = 'terciary' }: BadgeProps) {
  const isTerciary = state === 'terciary';
  return (
    <div
      className={
        className ||
        `border border-[#4b4b4b] content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] ${isTerciary ? 'bg-white border-dashed' : 'bg-[#4b4b4b] border-solid'}`
      }
      id={isTerciary ? 'node-141_4665' : 'node-141_4720'}
    >
      {state === 'fourth' && (
        <p
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap"
          data-node-id="141:4721"
        >
          {label}
        </p>
      )}
      {isTerciary && (
        <p
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#4b4b4b] text-[12px] whitespace-nowrap"
          data-node-id="141:4666"
        >
          {label}
        </p>
      )}
    </div>
  );
}
export default function Suspendidos() {
  return (
    <div
      className="bg-[#fafafa] content-stretch flex flex-col items-start relative size-full"
      data-node-id="207:1046"
      data-name="suspendidos - bibliotecario"
    >
      <div
        className="bg-[#fafafa] content-stretch flex flex-col items-start min-h-[422px] min-w-[320px] relative shrink-0 w-full"
        data-node-id="207:1047"
        data-name="AppShell"
      >
        <div
          className="bg-white content-stretch flex flex-col items-start relative shrink-0 w-full"
          data-node-id="207:1171"
          data-name="header"
        >
          <div
            className="backdrop-blur-[12px] bg-[rgba(255,255,255,0)] border-[#d4d4d4] border-b border-solid content-stretch flex gap-[12px] h-[76px] items-center px-[24px] relative shrink-0 w-full"
            data-node-id="I207:1171;247:3311"
            data-name="Header · Bibliotecario"
          >
            <div
              className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex gap-[12px] h-[75px] items-center min-h-[40px] px-[14.4px] py-[8.8px] relative rounded-[6px] shrink-0 w-[183px]"
              data-node-id="I207:1171;247:3312"
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
              data-node-id="I207:1171;247:3320"
              data-name="Navigation"
            >
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I207:1171;247:3321"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I207:1171;247:3321;144:1484"
                >
                  Préstamos
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I207:1171;272:2415"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I207:1171;272:2415;144:1484"
                >
                  Catálogo
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I207:1171;247:3322"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I207:1171;247:3322;144:1484"
                >
                  Devolución
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I207:1171;247:3323"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I207:1171;247:3323;144:1484"
                >
                  Renovación
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I207:1171;247:3324"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I207:1171;247:3324;144:1484"
                >
                  Multas y pagos
                </DesignText>
              </button>
              <button
                className="bg-[#00a99b] border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I207:1171;247:3325"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap"
                  data-node-id="I207:1171;247:3325;144:1469"
                >
                  Suspendidos
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I207:1171;247:3360"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I207:1171;247:3360;144:1484"
                >
                  Gestión de libros
                </DesignText>
              </button>
            </div>
            <div
              className="content-stretch flex h-[75px] items-center justify-end overflow-clip relative shrink-0 w-[250px]"
              data-node-id="I207:1171;247:3332"
              data-name="Container"
            >
              <div
                className="content-stretch flex gap-[9.6px] items-center relative shrink-0"
                data-node-id="I207:1171;247:3340"
                data-name="Container"
              >
                <div
                  className="bg-[#262626] grid grid-cols-[_32px] grid-rows-[_32px] relative rounded-[16px] shrink-0 size-[32px]"
                  data-node-id="I207:1171;247:3341"
                  data-name="Text"
                >
                  <DesignText
                    className="[word-break:break-word] col-1 font-['Poppins:Medium'] justify-self-center leading-[18px] not-italic relative row-1 self-center shrink-0 text-[12px] text-white whitespace-nowrap"
                    data-node-id="I207:1171;247:3342"
                  >
                    ML
                  </DesignText>
                </div>
                <div
                  className="content-stretch cursor-pointer flex flex-col items-start relative shrink-0 w-[89.641px]"
                  data-node-id="I207:1171;247:3343"
                  data-name="Container"
                >
                  <button
                    className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                    data-node-id="I207:1171;247:3344"
                    data-name="Bold Text"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] text-left whitespace-nowrap"
                      data-node-id="I207:1171;247:3345"
                    >
                      Mariana López
                    </DesignText>
                  </button>
                  <button
                    className="content-stretch flex flex-col h-[18px] items-start max-w-[160px] overflow-clip relative shrink-0 w-full"
                    data-node-id="I207:1171;247:3346"
                    data-name="Small"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] text-left whitespace-nowrap"
                      data-node-id="I207:1171;247:3347"
                    >
                      Alumno
                    </DesignText>
                  </button>
                </div>
              </div>
              <div
                className="content-stretch cursor-pointer flex items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                data-node-id="I207:1171;247:3348"
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
          data-node-id="207:1068"
          data-name="Main Content:margin"
        >
          <div
            className="content-stretch flex flex-col items-start min-h-[278px] pb-[80px] pt-[56px] relative shrink-0 w-full"
            data-node-id="207:1069"
            data-name="Main Content"
          >
            <div
              className="content-stretch flex h-[90px] items-end justify-between relative shrink-0 w-full"
              data-node-id="207:1070"
              data-name="PageHeader"
            >
              <div
                className="content-stretch flex flex-col items-start relative shrink-0 w-[331.146px]"
                data-node-id="207:1071"
                data-name="Container"
              >
                <div
                  className="content-stretch flex flex-col items-start min-h-[36px] relative shrink-0 w-full"
                  data-node-id="207:1072"
                  data-name="Heading"
                >
                  <DesignText
                    className="[word-break:break-word] font-['Poppins:Medium'] leading-[32px] not-italic relative shrink-0 text-[#1f1f1f] text-[24px] whitespace-nowrap"
                    data-node-id="207:1073"
                  >
                    Alumnos suspendidos
                  </DesignText>
                </div>
                <div
                  className="content-stretch flex flex-col h-[34.8px] items-start max-w-[720px] pt-[8.8px] relative shrink-0 w-[331.146px]"
                  data-node-id="207:1074"
                  data-name="Paragraph"
                >
                  <DesignText
                    className="[word-break:break-word] font-['Poppins:Medium'] leading-[24px] not-italic relative shrink-0 text-[#4b4b4b] text-[16px] whitespace-nowrap"
                    data-node-id="207:1075"
                  >
                    Lista de adeudos para el periodo de exámenes.
                  </DesignText>
                </div>
              </div>
              <div
                className="content-stretch flex gap-[8px] items-center relative shrink-0"
                data-node-id="207:1076"
                data-name="Container"
              >
                <div
                  className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[112.133px]"
                  data-node-id="207:1077"
                  data-name="Button · DS"
                >
                  <Buttons
                    buttonText="Generar lista"
                    className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                    type="secondary"
                  />
                </div>
                <div
                  className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[230px]"
                  data-node-id="207:1079"
                  data-name="Button · DS"
                >
                  <Buttons
                    buttonText="Notificar a Servicios Escolares"
                    className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                  />
                </div>
              </div>
            </div>
            <div
              className="content-stretch flex flex-col items-start pb-[20px] pt-[32px] relative shrink-0 w-full"
              data-node-id="207:1081"
              data-name="Panel:margin"
            >
              <div
                className="bg-white border-[#e1e1e1] border-[0.667px] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col items-start p-[24px] relative rounded-[12px] shrink-0 w-full"
                data-node-id="207:1082"
                data-name="Panel"
              >
                <div
                  className="bg-[#fafafa] border-[#eee] border-[0.667px] border-solid gap-x-[12px] gap-y-[12px] grid grid-cols-[___minmax(0,1fr)_198.67px_188.67px] grid-rows-[_64.62px] p-[16px] relative rounded-[8px] shrink-0 w-full"
                  data-node-id="207:1083"
                  data-name="Toolbar"
                >
                  <div
                    className="col-1 content-stretch flex flex-col gap-[6.4px] items-start justify-self-stretch relative row-1 self-end shrink-0"
                    data-node-id="207:1084"
                    data-name="Field"
                  >
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="207:1085"
                      data-name="Text"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                        data-node-id="207:1086"
                      >
                        Buscar
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] overflow-clip relative rounded-[6px] shrink-0 w-full"
                      data-node-id="207:1087"
                      data-name="Input · DS"
                    >
                      <DesignInput
                        className="block cursor-pointer flex-[1_0_0] h-[40px] min-w-px relative rounded-[4px]"
                        data-node-id="207:1088"
                        data-name="Left icon"
                        label="Buscar"
                        initialValue=""
                      >
                        <div
                          className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
                          data-node-id="I207:1088;65:3042"
                          data-name="Base"
                        />
                        <div
                          className="-translate-y-1/2 absolute left-[12px] size-[18px] top-1/2"
                          data-node-id="I207:1088;65:3043"
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
                          data-node-id="I207:1088;65:3044"
                        >
                          ​
                        </DesignText>
                      </DesignInput>
                    </div>
                  </div>
                  <div
                    className="col-2 content-stretch flex flex-col gap-[6.4px] items-start justify-self-stretch relative row-1 self-end shrink-0"
                    data-node-id="207:1089"
                    data-name="Field"
                  >
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="207:1090"
                      data-name="Text"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                        data-node-id="207:1091"
                      >
                        Tipo de adeudo
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] overflow-clip relative rounded-[6px] shrink-0 w-[198.667px]"
                      data-node-id="207:1092"
                      data-name="Select · DS"
                    >
                      <DesignSelect
                        className="border border-[#cacaca] border-solid content-stretch cursor-pointer flex flex-col gap-[2px] h-[32px] items-start overflow-clip relative rounded-[10px] shrink-0 w-[198.667px]"
                        data-node-id="207:1093"
                        data-name="dropdown"
                        label="Tipo de adeudo"
                        initialValue="Todos"
                      >
                        <div
                          className="content-stretch flex gap-[10px] h-[32px] items-center justify-center overflow-clip p-[10px] relative rounded-[10px] shrink-0 w-full"
                          data-node-id="I207:1093;7:1352"
                          data-name="dropdown-input"
                        >
                          <DesignText
                            className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[#4b4b4b] text-[12px] text-left"
                            data-node-id="I207:1093;7:1353"
                          >
                            Todos
                          </DesignText>
                          <div
                            className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[15px]"
                            data-node-id="I207:1093;7:1354"
                            data-name="Container"
                          >
                            <div
                              className="relative shrink-0 size-[12px]"
                              data-node-id="I207:1093;7:1354;7:710"
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
                    className="col-3 content-stretch flex flex-col gap-[6.4px] items-start justify-self-stretch relative row-1 self-end shrink-0"
                    data-node-id="207:1094"
                    data-name="Field"
                  >
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="207:1095"
                      data-name="Text"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                        data-node-id="207:1096"
                      >
                        Programa
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] overflow-clip relative rounded-[6px] shrink-0 w-[188.667px]"
                      data-node-id="207:1097"
                      data-name="Select · DS"
                    >
                      <DesignSelect
                        className="border border-[#cacaca] border-solid content-stretch cursor-pointer flex flex-col gap-[2px] h-[32px] items-start overflow-clip relative rounded-[10px] shrink-0 w-[188.667px]"
                        data-node-id="207:1098"
                        data-name="dropdown"
                        label="Programa"
                        initialValue="Todos los programas"
                      >
                        <div
                          className="content-stretch flex gap-[10px] h-[32px] items-center justify-center overflow-clip p-[10px] relative rounded-[10px] shrink-0 w-full"
                          data-node-id="I207:1098;7:1352"
                          data-name="dropdown-input"
                        >
                          <DesignText
                            className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[#4b4b4b] text-[12px] text-left"
                            data-node-id="I207:1098;7:1353"
                          >
                            Todos los programas
                          </DesignText>
                          <div
                            className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[15px]"
                            data-node-id="I207:1098;7:1354"
                            data-name="Container"
                          >
                            <div
                              className="relative shrink-0 size-[12px]"
                              data-node-id="I207:1098;7:1354;7:710"
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
                <div
                  className="content-stretch flex flex-col items-center pt-[24px] relative shrink-0 w-full"
                  data-node-id="207:1099"
                  data-name="Suspended:margin"
                >
                  <div
                    className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex items-center justify-between pb-[16px] relative shrink-0 w-full"
                    data-node-id="207:1100"
                    data-name="Suspended"
                  >
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0"
                      data-node-id="207:1101"
                      data-name="Bold Text"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                        data-node-id="207:1102"
                      >
                        24 alumnos con suspensión
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0"
                      data-node-id="207:1103"
                      data-name="Text"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                        data-node-id="207:1104"
                      >
                        Corte: 12 oct 2025, 10:30 h
                      </DesignText>
                    </div>
                  </div>
                </div>
                <div
                  className="content-stretch flex flex-col h-[297px] items-start overflow-clip relative shrink-0 w-full"
                  data-node-id="207:1105"
                  data-name="Table"
                >
                  <div
                    className="grid grid-cols-[______minmax(0,250.64fr)_minmax(0,118.19fr)_minmax(0,143.94fr)_minmax(0,80.27fr)_minmax(0,121.64fr)_minmax(0,127.33fr)] grid-rows-[____38.80px_fit-content(100%)_fit-content(100%)_fit-content(100%)] h-[197.073px] relative shrink-0 w-full"
                    data-node-id="207:1106"
                    data-name="Table"
                  >
                    <div
                      className="border-[#8e8e8e] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0"
                      data-node-id="207:1107"
                      data-name="Header Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                        data-node-id="207:1108"
                      >
                        Alumno
                      </DesignText>
                    </div>
                    <div
                      className="border-[#8e8e8e] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0"
                      data-node-id="207:1109"
                      data-name="Header Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                        data-node-id="207:1110"
                      >
                        Programa
                      </DesignText>
                    </div>
                    <div
                      className="border-[#8e8e8e] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0"
                      data-node-id="207:1111"
                      data-name="Header Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                        data-node-id="207:1112"
                      >
                        Libros vencidos
                      </DesignText>
                    </div>
                    <div
                      className="border-[#8e8e8e] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0"
                      data-node-id="207:1113"
                      data-name="Header Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                        data-node-id="207:1114"
                      >
                        Multas
                      </DesignText>
                    </div>
                    <div
                      className="border-[#8e8e8e] border-b-[0.667px] border-solid col-5 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0"
                      data-node-id="207:1115"
                      data-name="Header Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                        data-node-id="207:1116"
                      >
                        Último aviso
                      </DesignText>
                    </div>
                    <div
                      className="border-[#8e8e8e] border-b-[0.667px] border-solid col-6 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0"
                      data-node-id="207:1117"
                      data-name="Header Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                        data-node-id="207:1118"
                      >
                        Estatus
                      </DesignText>
                    </div>
                    <div
                      className="[word-break:break-word] border-[#e1e1e1] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col font-['Poppins:Medium'] items-start justify-center justify-self-stretch leading-[18px] not-italic px-[12px] py-[13.6px] relative row-2 self-start shrink-0 text-[12px]"
                      data-node-id="207:1119"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="relative shrink-0 text-[#1f1f1f] w-full"
                        data-node-id="207:1120"
                      >
                        Ana Torres Ruiz · A01678234
                      </DesignText>
                      <div
                        className="content-stretch flex flex-col gap-[2px] items-start overflow-clip relative shrink-0 text-[#737373] w-full"
                        data-node-id="348:1878"
                        data-name="Estatus escolar del alumno"
                      >
                        <DesignText className="relative shrink-0 w-full" data-node-id="348:1879">
                          Estatus escolar
                        </DesignText>
                        <DesignText className="relative shrink-0 w-full" data-node-id="348:1880">
                          Inscrito
                        </DesignText>
                      </div>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 self-stretch shrink-0"
                      data-node-id="207:1121"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1122"
                      >
                        Ing. Industrial
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 self-stretch shrink-0"
                      data-node-id="207:1123"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1124"
                      >
                        2
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 self-stretch shrink-0"
                      data-node-id="207:1125"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1126"
                      >
                        $120.00
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-5 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 self-stretch shrink-0"
                      data-node-id="207:1127"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1128"
                      >
                        08 oct 2025
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-6 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 self-stretch shrink-0"
                      data-node-id="207:1129"
                      data-name="Table Cell"
                    >
                      <div
                        className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0"
                        data-node-id="207:1130"
                        data-name="Badge · DS"
                      >
                        <Badge
                          className="bg-[#4b4b4b] border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0"
                          label="Suspendida"
                          state="fourth"
                        />
                      </div>
                    </div>
                    <div
                      className="[word-break:break-word] border-[#e1e1e1] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col font-['Poppins:Medium'] items-start justify-center justify-self-stretch leading-[18px] not-italic px-[12px] py-[13.6px] relative row-3 self-start shrink-0 text-[12px]"
                      data-node-id="207:1132"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="relative shrink-0 text-[#1f1f1f] w-full"
                        data-node-id="207:1133"
                      >
                        Diego Sánchez Paz · A01882340
                      </DesignText>
                      <div
                        className="content-stretch flex flex-col gap-[2px] items-start overflow-clip relative shrink-0 text-[#737373] w-full"
                        data-node-id="348:1881"
                        data-name="Estatus escolar del alumno"
                      >
                        <DesignText className="relative shrink-0 w-full" data-node-id="348:1882">
                          Estatus escolar
                        </DesignText>
                        <DesignText className="relative shrink-0 w-full" data-node-id="348:1883">
                          Inscrito
                        </DesignText>
                      </div>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 self-stretch shrink-0"
                      data-node-id="207:1134"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1135"
                      >
                        Arquitectura
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 self-stretch shrink-0"
                      data-node-id="207:1136"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1137"
                      >
                        1
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 self-stretch shrink-0"
                      data-node-id="207:1138"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1139"
                      >
                        $0.00
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-5 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 self-stretch shrink-0"
                      data-node-id="207:1140"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1141"
                      >
                        10 oct 2025
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-6 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 self-stretch shrink-0"
                      data-node-id="207:1142"
                      data-name="Table Cell"
                    >
                      <div
                        className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0"
                        data-node-id="207:1143"
                        data-name="Badge · DS"
                      >
                        <Badge
                          className="bg-[#4b4b4b] border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0"
                          label="Suspendido"
                          state="fourth"
                        />
                      </div>
                    </div>
                    <div
                      className="[word-break:break-word] border-[#e1e1e1] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col font-['Poppins:Medium'] items-start justify-center justify-self-stretch leading-[18px] not-italic px-[12px] py-[13.6px] relative row-4 self-start shrink-0 text-[12px]"
                      data-node-id="207:1145"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="relative shrink-0 text-[#1f1f1f] w-full"
                        data-node-id="207:1146"
                      >
                        Elena Cruz Lara · A01455210
                      </DesignText>
                      <div
                        className="content-stretch flex flex-col gap-[2px] items-start overflow-clip relative shrink-0 text-[#737373] w-full"
                        data-node-id="348:1884"
                        data-name="Estatus escolar del alumno"
                      >
                        <DesignText className="relative shrink-0 w-full" data-node-id="348:1885">
                          Estatus escolar
                        </DesignText>
                        <DesignText className="relative shrink-0 w-full" data-node-id="348:1886">
                          Inscrito
                        </DesignText>
                      </div>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 self-stretch shrink-0"
                      data-node-id="207:1147"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1148"
                      >
                        Lic. Economía
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 self-stretch shrink-0"
                      data-node-id="207:1149"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1150"
                      >
                        0
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 self-stretch shrink-0"
                      data-node-id="207:1151"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1152"
                      >
                        $240.00
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-5 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 self-stretch shrink-0"
                      data-node-id="207:1153"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1154"
                      >
                        05 oct 2025
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-6 content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 self-stretch shrink-0"
                      data-node-id="207:1155"
                      data-name="Table Cell"
                    >
                      <div
                        className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0"
                        data-node-id="207:1156"
                        data-name="Badge · DS"
                      >
                        <Badge
                          className="bg-white border border-[#4b4b4b] border-dashed content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0"
                          label="Por notificar"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="content-stretch flex items-center justify-between pt-[20px] relative shrink-0 w-full"
                  data-node-id="207:1158"
                  data-name="Pagination"
                >
                  <div
                    className="content-stretch flex flex-col items-start relative shrink-0"
                    data-node-id="207:1159"
                    data-name="Text"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                      data-node-id="207:1160"
                    >
                      Mostrando 1–3 de 3
                    </DesignText>
                  </div>
                  <div
                    className="content-stretch flex gap-[8px] items-center relative shrink-0"
                    data-node-id="207:1161"
                    data-name="Container"
                  >
                    <div
                      className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[83.133px]"
                      data-node-id="207:1162"
                      data-name="Button · DS"
                    >
                      <button
                        className="bg-[#eefcfa] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[69px]"
                        data-node-id="207:1163"
                        data-name="Buttons"
                      >
                        <DesignText
                          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-left whitespace-nowrap"
                          data-node-id="I207:1163;27:274"
                        >
                          Anterior
                        </DesignText>
                      </button>
                    </div>
                    <div
                      className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[91.133px]"
                      data-node-id="207:1164"
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
          data-node-id="207:1166"
          data-name="Footer"
        >
          <div
            className="content-stretch flex flex-col h-full items-start relative shrink-0"
            data-node-id="207:1167"
            data-name="Text"
          >
            <DesignText
              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
              data-node-id="207:1168"
            >
              Universidad Ducky · Sistema de Biblioteca
            </DesignText>
          </div>
        </div>
      </div>
    </div>
  );
}
