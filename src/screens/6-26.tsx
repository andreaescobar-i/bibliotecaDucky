import { DesignInput, DesignSelect, DesignText, DynamicSlot } from '../design-controls';
const imgButton = '/assets/e387d.png';
const imgLeft = '/assets/4e569.svg';
const imgImage = '/assets/f037e.svg';
const imgAttachment = '/assets/31b09.svg';
const imgCalendar = '/assets/dc8c4.svg';
const imgCalendar1 = '/assets/99496.svg';
const imgUser = '/assets/1b1a9.svg';
export default function DetalleLibroUsuarios() {
  return (
    <div
      className="bg-[#fafafa] content-stretch flex flex-col items-start relative size-full"
      data-node-id="6:26"
      data-name="detalle libro - usuarios"
    >
      <div
        className="bg-[#fafafa] content-stretch flex flex-col items-start min-h-[668px] min-w-[320px] relative shrink-0 w-full"
        data-node-id="6:29"
        data-name="AppShell"
      >
        <div
          className="content-stretch flex items-start relative shrink-0"
          data-node-id="182:1353"
          data-name="header"
        >
          <div
            className="bg-white content-stretch flex flex-col h-[76px] items-start px-[330px] py-[17px] relative shrink-0 w-[1280px]"
            data-node-id="I182:1353;182:1029"
            data-name="header"
          >
            <div
              className="absolute backdrop-blur-[12px] bg-[rgba(255,255,255,0)] border-[#d4d4d4] border-b border-solid content-stretch flex gap-[20px] h-[76px] items-center left-0 pl-[48px] pr-[32px] top-0 w-[1280px]"
              data-node-id="I182:1353;182:1029;62:561"
              data-name="Header"
            >
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch cursor-pointer flex gap-[12px] h-[75px] items-center min-h-[40px] px-[14.4px] py-[8.8px] relative rounded-[6px] shrink-0 w-[182.914px]"
                data-node-id="I182:1353;182:1029;62:562"
                data-name="Button"
              >
                <img
                  alt=""
                  className="absolute inset-0 max-w-none object-contain pointer-events-none rounded-[6px] size-full"
                  src={imgButton}
                />
              </button>
              <div
                className="content-stretch cursor-pointer flex flex-[1_0_0] gap-[12px] h-[50px] items-center justify-center min-w-px px-[24px] relative"
                data-node-id="I182:1353;182:1029;62:570"
                data-name="Navigation"
              >
                <button
                  className="bg-[#00a99b] border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                  data-node-id="I182:1353;182:1029;144:1485"
                  data-name="nav"
                >
                  <DesignText
                    className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap"
                    data-node-id="I182:1353;182:1029;144:1485;144:1469"
                  >
                    Catálogo
                  </DesignText>
                </button>
                <button
                  className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                  data-node-id="I182:1353;182:1029;144:1506"
                  data-name="nav"
                >
                  <DesignText
                    className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                    data-node-id="I182:1353;182:1029;144:1506;144:1484"
                  >
                    Mi cuenta
                  </DesignText>
                </button>
              </div>
              <div
                className="content-stretch flex h-[75px] items-center justify-between overflow-clip relative shrink-0 w-[274.041px]"
                data-node-id="I182:1353;182:1029;62:576"
                data-name="Container"
              >
                <div
                  className="content-stretch flex gap-[9.6px] items-center relative shrink-0"
                  data-node-id="I182:1353;182:1029;62:584"
                  data-name="Container"
                >
                  <div
                    className="bg-[#262626] grid grid-cols-[_32px] grid-rows-[_32px] relative rounded-[16px] shrink-0 size-[32px]"
                    data-node-id="I182:1353;182:1029;62:585"
                    data-name="Text"
                  >
                    <DesignText
                      className="[word-break:break-word] col-1 font-['Poppins:Medium'] justify-self-center leading-[18px] not-italic relative row-1 self-center shrink-0 text-[12px] text-white whitespace-nowrap"
                      data-node-id="I182:1353;182:1029;62:586"
                    >
                      ML
                    </DesignText>
                  </div>
                  <div
                    className="content-stretch cursor-pointer flex flex-col items-start relative shrink-0"
                    data-node-id="I182:1353;182:1029;62:587"
                    data-name="Container"
                  >
                    <button
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="I182:1353;182:1029;62:588"
                      data-name="Bold Text"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] text-left whitespace-nowrap"
                        data-node-id="I182:1353;182:1029;62:589"
                      >
                        Mariana López
                      </DesignText>
                    </button>
                    <button
                      className="content-stretch flex flex-col h-[15.844px] items-start max-w-[160px] overflow-clip relative shrink-0"
                      data-node-id="I182:1353;182:1029;62:590"
                      data-name="Small"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] text-left whitespace-nowrap"
                        data-node-id="I182:1353;182:1029;62:591"
                      >
                        Alumno
                      </DesignText>
                    </button>
                  </div>
                </div>
                <button
                  className="border border-[#007566] border-solid content-stretch cursor-pointer flex flex-col items-center justify-center min-h-[40px] px-[14.4px] py-[8.8px] relative rounded-[6px] shrink-0"
                  data-node-id="I182:1353;182:1029;62:592"
                  data-name="Button"
                >
                  <DesignText
                    className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[14px] text-[transparent] text-center whitespace-nowrap"
                    data-node-id="I182:1353;182:1029;62:593"
                  >
                    Cerrar sesión
                  </DesignText>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="content-stretch flex flex-col items-center relative shrink-0 w-full"
          data-node-id="6:236"
          data-name="Main Content:margin"
        >
          <div
            className="content-stretch flex flex-col items-start min-h-[524px] pb-[80px] pt-[40px] relative shrink-0 w-[1232px]"
            data-node-id="6:81"
            data-name="Main Content"
          >
            <div
              className="content-stretch flex items-center pb-[24px] relative shrink-0 w-full"
              data-node-id="6:228"
              data-name="Container"
            >
              <button
                className="cursor-pointer grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0"
                data-node-id="143:1223"
              >
                <div
                  className="col-1 ml-0 mt-[2px] relative row-1 size-[16px]"
                  data-node-id="52:627"
                  data-name="Left"
                >
                  <img
                    alt=""
                    className="absolute block inset-0 max-w-none size-full"
                    src={imgLeft}
                  />
                </div>
                <DesignText
                  className="[word-break:break-word] col-1 font-['Poppins:Medium'] leading-[18px] ml-[22px] mt-0 not-italic relative row-1 text-[#007566] text-[12px] whitespace-nowrap"
                  data-node-id="52:629"
                >
                  Volver al catálogo
                </DesignText>
              </button>
            </div>
            <div
              className="content-stretch flex items-end justify-between pb-[32px] relative shrink-0 w-full"
              data-node-id="6:85"
              data-name="PageHeader"
            >
              <div
                className="[word-break:break-word] content-stretch flex flex-col font-['Poppins:Medium'] gap-[8px] items-start not-italic relative shrink-0 w-[600px] whitespace-nowrap"
                data-node-id="6:86"
                data-name="Container"
              >
                <DesignText
                  className="leading-[38px] relative shrink-0 text-[#1f1f1f] text-[30px]"
                  data-node-id="6:88"
                >
                  Introducción a los algoritmos
                </DesignText>
                <DesignText
                  className="leading-[22px] relative shrink-0 text-[#4b4b4b] text-[14px]"
                  data-node-id="6:91"
                >
                  Ficha bibliográfica y disponibilidad de ejemplares.
                </DesignText>
              </div>
            </div>
            <div
              className="content-stretch flex flex-col items-start relative shrink-0 w-full"
              data-node-id="6:227"
              data-name="BookDetail:margin"
            >
              <div
                className="gap-x-[20px] gap-y-[20px] grid grid-cols-[__272px_759px] grid-rows-[_635.16px] h-[555px] relative shrink-0 w-full"
                data-node-id="6:94"
                data-name="BookDetail"
              >
                <div
                  className="col-1 content-stretch flex flex-col h-[520px] items-start justify-self-stretch pb-[20px] relative row-1 self-start shrink-0"
                  data-node-id="6:225"
                  data-name="Panel:margin"
                >
                  <div
                    className="bg-[#4b4b4b] border border-[#e1e1e1] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col gap-[47px] h-[294px] items-start p-[24px] relative rounded-[14px] shrink-0 w-[272px]"
                    data-node-id="6:95"
                    data-name="Panel"
                  >
                    <div
                      className="bg-[#eee] border border-[#e1e1e1] border-solid content-stretch flex flex-col h-[240px] items-center justify-center relative rounded-[8px] shrink-0 w-full"
                      data-node-id="52:632"
                      data-name="Frame"
                    >
                      <div
                        className="content-stretch flex flex-col gap-[8px] items-center justify-center relative shrink-0"
                        data-node-id="52:633"
                        data-name="Frame"
                      >
                        <div
                          className="relative shrink-0 size-[36px]"
                          data-node-id="52:634"
                          data-name="Image"
                        >
                          <img
                            alt=""
                            className="absolute block inset-0 max-w-none size-full"
                            src={imgImage}
                          />
                        </div>
                        <div
                          className="[word-break:break-word] font-['Poppins:Medium'] leading-[0] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] text-center whitespace-nowrap"
                          data-node-id="52:636"
                        >
                          <DesignText className="leading-[18px] mb-0">PORTADA</DesignText>
                          <DesignText className="leading-[18px]">NO DISPONIBLE</DesignText>
                        </div>
                      </div>
                    </div>
                    <div
                      className="absolute content-stretch flex flex-col gap-[8px] items-start left-[-1px] top-[311px] w-[222px]"
                      data-node-id="52:637"
                      data-name="Frame"
                    >
                      <div
                        className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0"
                        data-node-id="143:1319"
                        data-name="Badge"
                      >
                        <DesignText
                          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#4b4b4b] text-[12px] whitespace-nowrap"
                          data-node-id="I143:1319;137:4655"
                        >
                          ​
                        </DesignText>
                      </div>
                      <div
                        className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0"
                        data-node-id="143:1322"
                        data-name="Badge"
                      >
                        <DesignText
                          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#4b4b4b] text-[12px] whitespace-nowrap"
                          data-node-id="I143:1322;137:4655"
                        >
                          Préstamo externo
                        </DesignText>
                      </div>
                    </div>
                  </div>
                  <div
                    className="absolute content-stretch flex flex-col gap-[10px] h-[98px] items-start left-0 overflow-clip top-[395px] w-[272px]"
                    data-node-id="2012:1851"
                    data-name="Acciones del libro · PDF e impresión"
                  >
                    <div
                      className="content-stretch flex h-[44px] items-center justify-center overflow-clip relative rounded-[8px] shrink-0 w-full"
                      data-node-id="2012:1852"
                      data-name="Button · DS"
                    >
                      <button
                        className="bg-[#00a99b] content-stretch cursor-pointer flex gap-[10px] h-[45px] items-center justify-center p-[10px] relative rounded-[8px] shrink-0 w-[271px]"
                        data-node-id="2022:2874"
                        data-name="Buttons"
                      >
                        <div
                          className="relative shrink-0 size-[12px]"
                          data-node-id="I2022:2874;27:340"
                          data-name="Plus"
                        >
                          <img
                            alt=""
                            className="absolute block inset-0 max-w-none size-full"
                            src={imgAttachment}
                          />
                        </div>
                        <DesignText
                          className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap"
                          data-node-id="I2022:2874;27:341"
                        >
                          Ver PDF
                        </DesignText>
                      </button>
                    </div>
                    <div
                      className="content-stretch flex h-[44px] items-center justify-center overflow-clip relative rounded-[8px] shrink-0 w-full"
                      data-node-id="2012:1856"
                      data-name="Button · DS"
                    >
                      <button
                        className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[45px] items-center justify-center p-[10px] relative rounded-[8px] shrink-0 w-[272px]"
                        data-node-id="2022:2876"
                        data-name="Buttons"
                      >
                        <DesignText
                          className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#007566] text-[14px] text-left whitespace-nowrap"
                          data-node-id="I2022:2876;27:258"
                        >
                          Mandar a imprimir
                        </DesignText>
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className="col-2 content-stretch flex flex-col h-[555px] items-start justify-self-start pb-[20px] relative row-1 self-start shrink-0 w-[940px]"
                  data-node-id="52:638"
                  data-name="Panel:margin"
                >
                  <div
                    className="bg-white border border-[#e1e1e1] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col h-[555px] items-start p-[28px] relative rounded-[14px] shrink-0 w-full"
                    data-node-id="6:107"
                    data-name="Panel"
                  >
                    <div
                      className="content-stretch flex flex-col items-start pb-[20px] relative shrink-0 w-full"
                      data-node-id="6:108"
                      data-name="Heading"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[26px] not-italic relative shrink-0 text-[#1f1f1f] text-[18px] whitespace-nowrap"
                        data-node-id="6:109"
                      >
                        Información del libro
                      </DesignText>
                    </div>
                    <div
                      className="[word-break:break-word] content-stretch flex font-['Poppins:Regular'] gap-[12px] items-start leading-[22px] not-italic overflow-clip relative shrink-0 text-[14px] text-black"
                      data-node-id="2136:2273"
                      data-name="Recepción y disponibilidad del libro"
                    >
                      <DesignText
                        className="relative shrink-0 whitespace-nowrap"
                        data-node-id="2136:2274"
                      >
                        Ejemplares recibidos:
                      </DesignText>
                      <DesignText className="relative shrink-0 w-[48px]" data-node-id="2136:2275">
                        4
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="6:221"
                      data-name="BookDetail:margin"
                    >
                      <div
                        className="gap-x-[20px] gap-y-[20px] grid grid-cols-[__344px_344px] grid-rows-[____42px_42px_42px_fit-content(100%)] h-[226px] relative shrink-0 w-full"
                        data-node-id="6:111"
                        data-name="BookDetail"
                      >
                        <div
                          className="col-1 content-stretch flex flex-col items-start justify-self-stretch relative row-1 self-stretch shrink-0"
                          data-node-id="6:112"
                          data-name="Container"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                            data-node-id="52:639"
                          >
                            Autor
                          </DesignText>
                          <div
                            className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0 w-full"
                            data-node-id="52:640"
                            data-name="Frame"
                          >
                            <DesignText
                              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                              data-node-id="6:117"
                            >
                              Thomas H. Cormen
                            </DesignText>
                          </div>
                        </div>
                        <div
                          className="col-2 content-stretch flex flex-col items-start justify-self-stretch relative row-1 self-stretch shrink-0"
                          data-node-id="6:120"
                          data-name="Container"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                            data-node-id="52:641"
                          >
                            Editorial
                          </DesignText>
                          <div
                            className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0 w-full"
                            data-node-id="52:642"
                            data-name="Frame"
                          >
                            <DesignText
                              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                              data-node-id="6:125"
                            >
                              MIT Press
                            </DesignText>
                          </div>
                        </div>
                        <div
                          className="col-1 content-stretch flex flex-col items-start justify-self-stretch relative row-2 self-stretch shrink-0"
                          data-node-id="6:128"
                          data-name="Container"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                            data-node-id="52:643"
                          >
                            Edición
                          </DesignText>
                          <div
                            className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0 w-full"
                            data-node-id="52:644"
                            data-name="Frame"
                          >
                            <DesignText
                              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                              data-node-id="6:133"
                            >
                              Edición del catálogo
                            </DesignText>
                          </div>
                        </div>
                        <div
                          className="col-2 content-stretch flex flex-col items-start justify-self-stretch relative row-2 self-stretch shrink-0"
                          data-node-id="6:136"
                          data-name="Container"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                            data-node-id="52:645"
                          >
                            Clave
                          </DesignText>
                          <div
                            className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0 w-full"
                            data-node-id="52:646"
                            data-name="Frame"
                          >
                            <DesignText
                              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                              data-node-id="6:141"
                            >
                              COM-005.1-COR
                            </DesignText>
                          </div>
                        </div>
                        <div
                          className="col-1 content-stretch flex flex-col items-start justify-self-stretch relative row-3 self-stretch shrink-0"
                          data-node-id="6:144"
                          data-name="Container"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                            data-node-id="52:647"
                          >
                            ISBN
                          </DesignText>
                          <div
                            className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0 w-full"
                            data-node-id="52:648"
                            data-name="Frame"
                          >
                            <DesignText
                              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                              data-node-id="6:149"
                            >
                              No registrado
                            </DesignText>
                          </div>
                        </div>
                        <div
                          className="col-2 content-stretch flex flex-col items-start justify-self-stretch relative row-3 self-stretch shrink-0"
                          data-node-id="6:152"
                          data-name="Container"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                            data-node-id="52:649"
                          >
                            Tema
                          </DesignText>
                          <div
                            className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0 w-full"
                            data-node-id="52:650"
                            data-name="Frame"
                          >
                            <DesignText
                              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                              data-node-id="6:157"
                            >
                              Computación
                            </DesignText>
                          </div>
                        </div>
                        <div
                          className="col-[1/span_2] content-stretch flex flex-col items-start justify-self-stretch relative row-4 self-start shrink-0"
                          data-node-id="6:160"
                          data-name="Container"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                            data-node-id="52:651"
                          >
                            Descripción
                          </DesignText>
                          <div
                            className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0 w-full"
                            data-node-id="52:652"
                            data-name="Frame"
                          >
                            <DesignText
                              className="[word-break:break-word] font-['Poppins:Regular'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                              data-node-id="6:165"
                            >
                              ​
                            </DesignText>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="content-stretch flex flex-col items-start pt-[20px] relative shrink-0 w-full"
                      data-node-id="6:222"
                      data-name="Divider"
                    >
                      <div
                        className="bg-[#e1e1e1] h-px relative shrink-0 w-full"
                        data-node-id="6:168"
                        data-name="BookDetail"
                      />
                    </div>
                    <div
                      className="content-stretch flex gap-[8px] items-center pb-[16px] pt-[20px] relative shrink-0 w-full"
                      data-node-id="6:169"
                      data-name="Heading"
                    >
                      <div
                        className="relative shrink-0 size-[18px]"
                        data-node-id="52:653"
                        data-name="Calendar"
                      >
                        <img
                          alt=""
                          className="absolute block inset-0 max-w-none size-full"
                          src={imgCalendar}
                        />
                      </div>
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#1f1f1f] text-[14px] whitespace-nowrap"
                        data-node-id="6:170"
                      >
                        Ejemplares
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex items-start relative shrink-0 w-full"
                      data-node-id="6:172"
                      data-name="Table"
                    >
                      <div
                        className="flex-[1_0_0] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[__36px_52px] h-[88px] min-w-px relative"
                        data-node-id="6:173"
                        data-name="Table"
                      >
                        <div
                          className="border-[#cacaca] border-b border-solid col-1 content-stretch flex flex-col h-[36px] items-start justify-center justify-self-stretch px-[12px] py-[8px] relative row-1 shrink-0"
                          data-node-id="6:176"
                          data-name="Header Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                            data-node-id="6:177"
                          >
                            Cantidad activa
                          </DesignText>
                        </div>
                        <div
                          className="border-[#cacaca] border-b border-solid col-2 content-stretch flex flex-col h-[36px] items-start justify-center justify-self-stretch px-[12px] py-[8px] relative row-1 shrink-0"
                          data-node-id="6:179"
                          data-name="Header Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                            data-node-id="6:180"
                          >
                            Ubicación EN BIBLIOTECA
                          </DesignText>
                        </div>
                        <div
                          className="border-[#cacaca] border-b border-solid col-4 content-stretch flex gap-[6px] h-[36px] items-center justify-self-stretch px-[12px] py-[8px] relative row-1 shrink-0"
                          data-node-id="6:185"
                          data-name="Header Cell"
                        >
                          <div
                            className="relative shrink-0 size-[14px]"
                            data-node-id="52:655"
                            data-name="Calendar"
                          >
                            <img
                              alt=""
                              className="absolute block inset-0 max-w-none size-full"
                              src={imgCalendar1}
                            />
                          </div>
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                            data-node-id="6:186"
                          >
                            Devolución estimada
                          </DesignText>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b border-solid col-1 content-stretch flex flex-col h-[52px] items-start justify-center justify-self-stretch px-[12px] py-[14px] relative row-2 shrink-0"
                          data-node-id="6:190"
                          data-name="Table Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Regular'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                            data-node-id="6:191"
                          >
                            4
                          </DesignText>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b border-solid col-2 content-stretch flex flex-col h-[52px] items-start justify-center justify-self-stretch px-[12px] py-[14px] relative row-2 shrink-0"
                          data-node-id="6:193"
                          data-name="Table Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Regular'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                            data-node-id="6:194"
                          >
                            ​
                          </DesignText>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b border-solid col-4 content-stretch flex flex-col h-[52px] items-start justify-center justify-self-stretch px-[12px] py-[14px] relative row-2 shrink-0"
                          data-node-id="6:200"
                          data-name="Table Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Regular'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                            data-node-id="6:201"
                          >
                            ​
                          </DesignText>
                        </div>
                        <div
                          className="border-[#e1e1e1] border-b border-solid col-3 content-stretch flex flex-col h-[52px] items-start justify-center justify-self-stretch px-[12px] py-[14px] relative row-2 shrink-0"
                          data-node-id="6:196"
                          data-name="Table Cell"
                        >
                          <div
                            className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0"
                            data-node-id="143:1324"
                            data-name="Badge"
                          >
                            <DesignText
                              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#4b4b4b] text-[12px] whitespace-nowrap"
                              data-node-id="I143:1324;137:4655"
                            >
                              ​
                            </DesignText>
                          </div>
                        </div>
                        <div
                          className="border-[#cacaca] border-b border-solid col-3 content-stretch flex flex-col h-[36px] items-start justify-center justify-self-stretch px-[12px] py-[8px] relative row-1 shrink-0"
                          data-node-id="6:182"
                          data-name="Header Cell"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                            data-node-id="6:183"
                          >
                            Estado
                          </DesignText>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="bg-white border-[#e1e1e1] border-solid border-t content-stretch flex items-center justify-between px-[32px] py-[20px] relative shrink-0 w-full"
          data-node-id="6:229"
          data-name="Footer"
        >
          <div
            className="content-stretch flex gap-[8px] items-center relative shrink-0"
            data-node-id="52:657"
            data-name="Footer Left"
          >
            <div className="relative shrink-0 size-[14px]" data-node-id="52:658" data-name="User">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgUser} />
            </div>
            <DesignText
              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
              data-node-id="6:231"
            >
              Universidad Ducky · Sistema de Biblioteca
            </DesignText>
          </div>
          <DesignText
            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#cacaca] text-[12px] whitespace-nowrap"
            data-node-id="52:660"
          >
            Mariana López
          </DesignText>
        </div>
      </div>
    </div>
  );
}
