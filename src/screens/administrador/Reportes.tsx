import { DesignInput, DesignSelect, DesignText, DynamicSlot } from '../../design-controls';
const imgIdentidadBiblioteca = '/assets/e387d.png';
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
export default function Reportes() {
  return (
    <div
      className="bg-[#fafafa] content-stretch flex flex-col items-start relative size-full"
      data-node-id="207:1430"
      data-name="reportes e inventario - administrador"
    >
      <div
        className="bg-[#fafafa] content-stretch flex flex-col items-start min-w-[320px] relative shrink-0 w-full"
        data-node-id="207:1431"
        data-name="AppShell"
      >
        <div
          className="bg-white content-stretch flex flex-col h-[76px] items-start relative shrink-0 w-full"
          data-node-id="207:1616"
          data-name="header"
        >
          <div
            className="absolute backdrop-blur-[12px] bg-[rgba(255,255,255,0)] border-[#d4d4d4] border-b border-solid content-stretch flex gap-[20px] h-[76px] items-center left-0 pl-[48px] pr-[32px] top-0 w-[1280px]"
            data-node-id="I207:1616;62:561"
            data-name="Header"
          >
            <div
              className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex gap-[12px] h-[75px] items-center min-h-[40px] px-[14.4px] py-[8.8px] relative rounded-[6px] shrink-0 w-[182.914px]"
              data-node-id="I207:1616;62:562"
              data-name="Identidad · Biblioteca"
            >
              <img
                alt=""
                className="absolute inset-0 max-w-none object-contain pointer-events-none rounded-[6px] size-full"
                src={imgIdentidadBiblioteca}
              />
            </div>
            <div
              className="content-stretch flex gap-[8px] h-[50px] items-center justify-center px-[24px] relative shrink-0 w-[645px]"
              data-node-id="I207:1616;62:570"
              data-name="Navigation"
            >
              <button
                className="bg-[#00a99b] border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I207:1616;207:651"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap"
                  data-node-id="I207:1616;207:651;144:1469"
                >
                  Reportes
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch cursor-pointer flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I207:1616;207:652"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I207:1616;207:652;144:1484"
                >
                  Usuarios
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch cursor-pointer flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I207:1616;207:653"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] font-medium leading-[18px] relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I207:1616;207:653;144:1484"
                  style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
                >
                  Libros ▾
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch cursor-pointer flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I207:1616;207:654"
                data-name="Operaciones"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] font-medium leading-[18px] relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I207:1616;207:654;144:1484"
                  style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
                >
                  Administración ▾
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch cursor-pointer flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I207:1616;207:655"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I207:1616;207:655;144:1484"
                >
                  Operaciones ▾
                </DesignText>
              </button>
            </div>
            <div
              className="content-stretch flex h-[75px] items-center justify-between overflow-clip relative shrink-0 w-[332px]"
              data-node-id="I207:1616;62:576"
              data-name="Container"
            >
              <div
                className="content-stretch flex gap-[9.6px] items-center relative shrink-0"
                data-node-id="I207:1616;62:584"
                data-name="Container"
              >
                <div
                  className="bg-[#262626] grid grid-cols-[_32px] grid-rows-[_32px] relative rounded-[16px] shrink-0 size-[32px]"
                  data-node-id="I207:1616;62:585"
                  data-name="Text"
                >
                  <DesignText
                    className="[word-break:break-word] col-1 font-['Poppins:Regular'] justify-self-center leading-[18px] not-italic relative row-1 self-center shrink-0 text-[12px] text-white whitespace-nowrap"
                    data-node-id="I207:1616;62:586"
                  >
                    AC
                  </DesignText>
                </div>
                <div
                  className="content-stretch cursor-pointer flex flex-col items-start relative shrink-0"
                  data-node-id="I207:1616;62:587"
                  data-name="Container"
                >
                  <button
                    className="content-stretch flex flex-col items-start relative shrink-0"
                    data-node-id="I207:1616;62:588"
                    data-name="Bold Text"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] text-left whitespace-nowrap"
                      data-node-id="I207:1616;62:589"
                    >
                      Alfonso Chapa
                    </DesignText>
                  </button>
                  <button
                    className="content-stretch flex flex-col h-[18px] items-start max-w-[160px] overflow-clip relative shrink-0"
                    data-node-id="I207:1616;62:590"
                    data-name="Small"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] text-left whitespace-nowrap"
                      data-node-id="I207:1616;62:591"
                    >
                      Admin
                    </DesignText>
                  </button>
                </div>
              </div>
              <div
                className="content-stretch cursor-pointer flex items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                data-node-id="I207:1616;62:592"
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
          data-node-id="207:1452"
          data-name="Main Content:margin"
        >
          <div
            className="content-stretch flex flex-col items-start min-h-[278px] pb-[80px] pt-[56px] relative shrink-0 w-full"
            data-node-id="207:1453"
            data-name="Main Content"
          >
            <div
              className="content-stretch flex h-[90px] items-end justify-between relative shrink-0 w-full"
              data-node-id="207:1454"
              data-name="PageHeader"
            >
              <div
                className="content-stretch flex flex-col items-start relative shrink-0 w-[392.333px]"
                data-node-id="207:1455"
                data-name="Container"
              >
                <div
                  className="content-stretch flex flex-col items-start min-h-[36px] relative shrink-0 w-full"
                  data-node-id="207:1456"
                  data-name="Heading"
                >
                  <DesignText
                    className="[word-break:break-word] font-['Poppins:Medium'] leading-[32px] not-italic relative shrink-0 text-[#1f1f1f] text-[24px] whitespace-nowrap"
                    data-node-id="207:1457"
                  >
                    Reportes e inventario
                  </DesignText>
                </div>
                <div
                  className="content-stretch flex flex-col h-[34.8px] items-start max-w-[720px] pt-[8.8px] relative shrink-0 w-[392.333px]"
                  data-node-id="207:1458"
                  data-name="Paragraph"
                >
                  <DesignText
                    className="[word-break:break-word] font-['Poppins:Medium'] leading-[24px] not-italic relative shrink-0 text-[#4b4b4b] text-[16px] whitespace-nowrap"
                    data-node-id="207:1459"
                  >
                    Consulta indicadores de circulación, existencia y multas.
                  </DesignText>
                </div>
              </div>
              <div
                className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[134px]"
                data-node-id="207:1460"
                data-name="Button · DS"
              >
                <Buttons
                  buttonText="Exportar reporte"
                  className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                />
              </div>
            </div>
            <div
              className="content-stretch flex flex-col items-start pt-[32px] relative shrink-0 w-full"
              data-node-id="207:1462"
              data-name="Toolbar:margin"
            >
              <div
                className="bg-[#fafafa] border-[#eee] border-[0.667px] border-solid gap-x-[12px] gap-y-[12px] grid grid-cols-[____minmax(0,1fr)_220px_174px_174px] grid-rows-[__64.62px_40px] h-[101px] p-[16px] relative rounded-[8px] shrink-0 w-full"
                data-node-id="207:1463"
                data-name="Toolbar"
              >
                <div
                  className="col-1 content-stretch flex flex-col gap-[6.4px] items-start justify-self-stretch relative row-1 self-end shrink-0"
                  data-node-id="207:1464"
                  data-name="Field"
                >
                  <div
                    className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                    data-node-id="207:1465"
                    data-name="Text"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                      data-node-id="207:1466"
                    >
                      Periodo
                    </DesignText>
                  </div>
                  <div
                    className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] overflow-clip relative rounded-[6px] shrink-0 w-full"
                    data-node-id="207:1467"
                    data-name="Select · DS"
                  >
                    <DesignSelect
                      className="border border-[#cacaca] border-solid content-stretch cursor-pointer flex flex-[1_0_0] flex-col gap-[2px] h-[32px] items-start min-w-px overflow-clip relative rounded-[10px]"
                      data-node-id="207:1468"
                      data-name="dropdown"
                      label="Periodo"
                      initialValue="Octubre 2025"
                    >
                      <div
                        className="content-stretch flex gap-[10px] h-[32px] items-center justify-center overflow-clip p-[10px] relative rounded-[10px] shrink-0 w-full"
                        data-node-id="I207:1468;7:1352"
                        data-name="dropdown-input"
                      >
                        <DesignText
                          className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[#4b4b4b] text-[12px] text-left"
                          data-node-id="I207:1468;7:1353"
                        >
                          Octubre 2025
                        </DesignText>
                        <div
                          className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[15px]"
                          data-node-id="I207:1468;7:1354"
                          data-name="Container"
                        >
                          <div
                            className="relative shrink-0 size-[12px]"
                            data-node-id="I207:1468;7:1354;7:710"
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
                  className="col-2 content-stretch flex flex-col gap-[6.4px] items-start justify-self-stretch relative row-1 self-end shrink-0"
                  data-node-id="207:1469"
                  data-name="Field"
                >
                  <div
                    className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                    data-node-id="207:1470"
                    data-name="Text"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                      data-node-id="207:1471"
                    >
                      Tema
                    </DesignText>
                  </div>
                  <div
                    className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] overflow-clip relative rounded-[6px] shrink-0 w-[220px]"
                    data-node-id="207:1472"
                    data-name="Select · DS"
                  >
                    <DesignSelect
                      className="border border-[#cacaca] border-solid content-stretch cursor-pointer flex flex-col gap-[2px] h-[32px] items-start overflow-clip relative rounded-[10px] shrink-0 w-[220px]"
                      data-node-id="207:1473"
                      data-name="dropdown"
                      label="Tema"
                      initialValue="Todos los temas"
                    >
                      <div
                        className="content-stretch flex gap-[10px] h-[32px] items-center justify-center overflow-clip p-[10px] relative rounded-[10px] shrink-0 w-full"
                        data-node-id="I207:1473;7:1352"
                        data-name="dropdown-input"
                      >
                        <DesignText
                          className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[#4b4b4b] text-[12px] text-left"
                          data-node-id="I207:1473;7:1353"
                        >
                          Todos los temas
                        </DesignText>
                        <div
                          className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[15px]"
                          data-node-id="I207:1473;7:1354"
                          data-name="Container"
                        >
                          <div
                            className="relative shrink-0 size-[12px]"
                            data-node-id="I207:1473;7:1354;7:710"
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
                  data-node-id="207:1474"
                  data-name="Field"
                >
                  <div
                    className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                    data-node-id="207:1475"
                    data-name="Text"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                      data-node-id="207:1476"
                    >
                      Estante
                    </DesignText>
                  </div>
                  <div
                    className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] overflow-clip relative rounded-[6px] shrink-0 w-[174px]"
                    data-node-id="207:1477"
                    data-name="Select · DS"
                  >
                    <DesignSelect
                      className="border border-[#cacaca] border-solid content-stretch cursor-pointer flex flex-col gap-[2px] h-[32px] items-start overflow-clip relative rounded-[10px] shrink-0 w-[174px]"
                      data-node-id="207:1478"
                      data-name="dropdown"
                      label="Estante"
                      initialValue="Todos los estantes"
                    >
                      <div
                        className="content-stretch flex gap-[10px] h-[32px] items-center justify-center overflow-clip p-[10px] relative rounded-[10px] shrink-0 w-full"
                        data-node-id="I207:1478;7:1352"
                        data-name="dropdown-input"
                      >
                        <DesignText
                          className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[#4b4b4b] text-[12px] text-left"
                          data-node-id="I207:1478;7:1353"
                        >
                          Todos los estantes
                        </DesignText>
                        <div
                          className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[15px]"
                          data-node-id="I207:1478;7:1354"
                          data-name="Container"
                        >
                          <div
                            className="relative shrink-0 size-[12px]"
                            data-node-id="I207:1478;7:1354;7:710"
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
                  className="col-4 content-stretch flex h-[40px] items-center justify-center justify-self-stretch min-h-[40px] relative rounded-[6px] row-1 self-end shrink-0"
                  data-node-id="308:2916"
                  data-name="Button · DS"
                >
                  <Buttons
                    buttonText="Aplicar filtros"
                    className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                    type="secondary"
                  />
                </div>
              </div>
            </div>
            <div
              className="content-stretch flex flex-col items-start pt-[24px] relative shrink-0 w-full"
              data-node-id="207:1481"
              data-name="Reports:margin"
            >
              <div
                className="gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[_164px] relative shrink-0 w-full"
                data-node-id="207:1482"
                data-name="Reports"
              >
                <div
                  className="col-1 content-stretch flex flex-col items-start justify-self-stretch pb-[20px] relative row-1 self-stretch shrink-0"
                  data-node-id="207:1483"
                  data-name="Panel:margin"
                >
                  <div
                    className="bg-white border-[#e1e1e1] border-[0.667px] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col gap-[5.6px] items-start p-[24px] relative rounded-[12px] shrink-0 w-full"
                    data-node-id="207:1484"
                    data-name="Panel"
                  >
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="207:1485"
                      data-name="Reports"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                        data-node-id="207:1486"
                      >
                        Existencia total
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex flex-col items-start min-h-[54px] relative shrink-0 w-full"
                      data-node-id="207:1487"
                      data-name="Reports"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[38px] not-italic relative shrink-0 text-[#1f1f1f] text-[30px] whitespace-nowrap"
                        data-node-id="207:1488"
                      >
                        8,420
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="207:1489"
                      data-name="Reports"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                        data-node-id="207:1490"
                      >
                        7,184 títulos
                      </DesignText>
                    </div>
                  </div>
                </div>
                <div
                  className="col-2 content-stretch flex flex-col items-start justify-self-stretch pb-[20px] relative row-1 self-stretch shrink-0"
                  data-node-id="207:1491"
                  data-name="Panel:margin"
                >
                  <div
                    className="bg-white border-[#e1e1e1] border-[0.667px] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col gap-[5.6px] items-start p-[24px] relative rounded-[12px] shrink-0 w-full"
                    data-node-id="207:1492"
                    data-name="Panel"
                  >
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="207:1493"
                      data-name="Reports"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                        data-node-id="207:1494"
                      >
                        Libros prestados
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex flex-col items-start min-h-[54px] relative shrink-0 w-full"
                      data-node-id="207:1495"
                      data-name="Reports"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[38px] not-italic relative shrink-0 text-[#1f1f1f] text-[30px] whitespace-nowrap"
                        data-node-id="207:1496"
                      >
                        386
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="207:1497"
                      data-name="Reports"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                        data-node-id="207:1498"
                      >
                        4.6% del inventario
                      </DesignText>
                    </div>
                  </div>
                </div>
                <div
                  className="col-3 content-stretch flex flex-col items-start justify-self-stretch pb-[20px] relative row-1 self-stretch shrink-0"
                  data-node-id="207:1499"
                  data-name="Panel:margin"
                >
                  <div
                    className="bg-white border-[#e1e1e1] border-[0.667px] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col gap-[5.6px] items-start p-[24px] relative rounded-[12px] shrink-0 w-full"
                    data-node-id="207:1500"
                    data-name="Panel"
                  >
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="207:1501"
                      data-name="Reports"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                        data-node-id="207:1502"
                      >
                        Préstamos vencidos
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex flex-col items-start min-h-[54px] relative shrink-0 w-full"
                      data-node-id="207:1503"
                      data-name="Reports"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[38px] not-italic relative shrink-0 text-[#1f1f1f] text-[30px] whitespace-nowrap"
                        data-node-id="207:1504"
                      >
                        42
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="207:1505"
                      data-name="Reports"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                        data-node-id="207:1506"
                      >
                        11% de préstamos
                      </DesignText>
                    </div>
                  </div>
                </div>
                <div
                  className="col-4 content-stretch flex flex-col items-start justify-self-stretch pb-[20px] relative row-1 self-stretch shrink-0"
                  data-node-id="207:1507"
                  data-name="Panel:margin"
                >
                  <div
                    className="bg-white border-[#e1e1e1] border-[0.667px] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col gap-[5.6px] items-start p-[24px] relative rounded-[12px] shrink-0 w-full"
                    data-node-id="207:1508"
                    data-name="Panel"
                  >
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="207:1509"
                      data-name="Reports"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                        data-node-id="207:1510"
                      >
                        Multas generadas
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex flex-col items-start min-h-[54px] relative shrink-0 w-full"
                      data-node-id="207:1511"
                      data-name="Reports"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[38px] not-italic relative shrink-0 text-[#1f1f1f] text-[30px] whitespace-nowrap"
                        data-node-id="207:1512"
                      >
                        $8,640
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="207:1513"
                      data-name="Reports"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                        data-node-id="207:1514"
                      >
                        Este mes
                      </DesignText>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[_321.33px] relative shrink-0 w-full"
              data-node-id="207:1515"
              data-name="Reports"
            >
              <div
                className="col-1 content-stretch flex flex-col items-start justify-self-stretch pb-[20px] relative row-1 self-stretch shrink-0"
                data-node-id="207:1516"
                data-name="Panel:margin"
              >
                <div
                  className="bg-white border-[#e1e1e1] border-[0.667px] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col h-[301.333px] items-start p-[24px] relative rounded-[12px] shrink-0 w-full"
                  data-node-id="207:1517"
                  data-name="Panel"
                >
                  <div
                    className="content-stretch flex flex-col items-start min-h-[30px] relative shrink-0 w-full"
                    data-node-id="207:1518"
                    data-name="Heading"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[28px] not-italic relative shrink-0 text-[#1f1f1f] text-[20px] whitespace-nowrap"
                      data-node-id="207:1519"
                    >
                      Existencia por tema
                    </DesignText>
                  </div>
                  <div
                    className="content-stretch flex flex-col gap-[16px] h-[174px] items-start pt-[20px] relative shrink-0 w-full"
                    data-node-id="207:1520"
                    data-name="Reports"
                  >
                    <div
                      className="gap-x-[16px] gap-y-[16px] grid-cols-[___96px_299.86px_48px] grid-rows-[_18px] inline-grid relative shrink-0"
                      data-node-id="207:1521"
                      data-name="Container"
                    >
                      <div
                        className="col-1 content-stretch flex flex-col h-[18px] items-start justify-self-stretch relative row-1 self-center shrink-0"
                        data-node-id="207:1522"
                        data-name="Text"
                      >
                        <DesignText
                          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                          data-node-id="207:1523"
                        >
                          Literatura
                        </DesignText>
                      </div>
                      <div
                        className="bg-[#e1e1e1] col-2 content-stretch flex flex-col h-[11.198px] items-start justify-self-stretch overflow-clip relative rounded-[999px] row-1 self-center shrink-0"
                        data-node-id="207:1524"
                        data-name="Container"
                      >
                        <div
                          className="bg-[#1f1f1f] h-[11.198px] relative shrink-0 w-[245.885px]"
                          data-node-id="207:1525"
                          data-name="Container"
                        />
                      </div>
                      <div
                        className="col-3 content-stretch flex flex-col h-[18px] items-start justify-self-stretch relative row-1 self-center shrink-0"
                        data-node-id="207:1526"
                        data-name="Bold Text"
                      >
                        <DesignText
                          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                          data-node-id="207:1527"
                        >
                          1230
                        </DesignText>
                      </div>
                    </div>
                    <div
                      className="gap-x-[16px] gap-y-[16px] grid-cols-[___96px_299.86px_48px] grid-rows-[_18px] inline-grid relative shrink-0"
                      data-node-id="207:1528"
                      data-name="Container"
                    >
                      <div
                        className="col-1 content-stretch flex flex-col h-[18px] items-start justify-self-stretch relative row-1 self-center shrink-0"
                        data-node-id="207:1529"
                        data-name="Text"
                      >
                        <DesignText
                          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                          data-node-id="207:1530"
                        >
                          Computación
                        </DesignText>
                      </div>
                      <div
                        className="bg-[#e1e1e1] col-2 content-stretch flex flex-col h-[11.198px] items-start justify-self-stretch overflow-clip relative rounded-[999px] row-1 self-center shrink-0"
                        data-node-id="207:1531"
                        data-name="Container"
                      >
                        <div
                          className="bg-[#1f1f1f] h-[11.198px] relative shrink-0 w-[191.906px]"
                          data-node-id="207:1532"
                          data-name="Container"
                        />
                      </div>
                      <div
                        className="col-3 content-stretch flex flex-col h-[18px] items-start justify-self-stretch relative row-1 self-center shrink-0"
                        data-node-id="207:1533"
                        data-name="Bold Text"
                      >
                        <DesignText
                          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                          data-node-id="207:1534"
                        >
                          960
                        </DesignText>
                      </div>
                    </div>
                    <div
                      className="gap-x-[16px] gap-y-[16px] grid-cols-[___96px_299.86px_48px] grid-rows-[_18px] inline-grid relative shrink-0"
                      data-node-id="207:1535"
                      data-name="Container"
                    >
                      <div
                        className="col-1 content-stretch flex flex-col h-[18px] items-start justify-self-stretch relative row-1 self-center shrink-0"
                        data-node-id="207:1536"
                        data-name="Text"
                      >
                        <DesignText
                          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                          data-node-id="207:1537"
                        >
                          Historia
                        </DesignText>
                      </div>
                      <div
                        className="bg-[#e1e1e1] col-2 content-stretch flex flex-col h-[11.198px] items-start justify-self-stretch overflow-clip relative rounded-[999px] row-1 self-center shrink-0"
                        data-node-id="207:1538"
                        data-name="Container"
                      >
                        <div
                          className="bg-[#1f1f1f] h-[11.198px] relative shrink-0 w-[152.927px]"
                          data-node-id="207:1539"
                          data-name="Container"
                        />
                      </div>
                      <div
                        className="col-3 content-stretch flex flex-col h-[18px] items-start justify-self-stretch relative row-1 self-center shrink-0"
                        data-node-id="207:1540"
                        data-name="Bold Text"
                      >
                        <DesignText
                          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                          data-node-id="207:1541"
                        >
                          765
                        </DesignText>
                      </div>
                    </div>
                    <div
                      className="gap-x-[16px] gap-y-[16px] grid-cols-[___96px_299.86px_48px] grid-rows-[_18px] inline-grid relative shrink-0"
                      data-node-id="207:1542"
                      data-name="Container"
                    >
                      <div
                        className="col-1 content-stretch flex flex-col h-[18px] items-start justify-self-stretch relative row-1 self-center shrink-0"
                        data-node-id="207:1543"
                        data-name="Text"
                      >
                        <DesignText
                          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                          data-node-id="207:1544"
                        >
                          Matemáticas
                        </DesignText>
                      </div>
                      <div
                        className="bg-[#e1e1e1] col-2 content-stretch flex flex-col h-[11.198px] items-start justify-self-stretch overflow-clip relative rounded-[999px] row-1 self-center shrink-0"
                        data-node-id="207:1545"
                        data-name="Container"
                      >
                        <div
                          className="bg-[#1f1f1f] h-[11.198px] relative shrink-0 w-[128.938px]"
                          data-node-id="207:1546"
                          data-name="Container"
                        />
                      </div>
                      <div
                        className="col-3 content-stretch flex flex-col h-[18px] items-start justify-self-stretch relative row-1 self-center shrink-0"
                        data-node-id="207:1547"
                        data-name="Bold Text"
                      >
                        <DesignText
                          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                          data-node-id="207:1548"
                        >
                          645
                        </DesignText>
                      </div>
                    </div>
                    <div
                      className="gap-x-[16px] gap-y-[16px] grid-cols-[___96px_299.86px_48px] grid-rows-[_18px] inline-grid relative shrink-0"
                      data-node-id="207:1549"
                      data-name="Container"
                    >
                      <div
                        className="col-1 content-stretch flex flex-col h-[18px] items-start justify-self-stretch relative row-1 self-center shrink-0"
                        data-node-id="207:1550"
                        data-name="Text"
                      >
                        <DesignText
                          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                          data-node-id="207:1551"
                        >
                          Ciencias
                        </DesignText>
                      </div>
                      <div
                        className="bg-[#e1e1e1] col-2 content-stretch flex flex-col h-[11.198px] items-start justify-self-stretch overflow-clip relative rounded-[999px] row-1 self-center shrink-0"
                        data-node-id="207:1552"
                        data-name="Container"
                      >
                        <div
                          className="bg-[#1f1f1f] h-[11.198px] relative shrink-0 w-[113.948px]"
                          data-node-id="207:1553"
                          data-name="Container"
                        />
                      </div>
                      <div
                        className="col-3 content-stretch flex flex-col h-[18px] items-start justify-self-stretch relative row-1 self-center shrink-0"
                        data-node-id="207:1554"
                        data-name="Bold Text"
                      >
                        <DesignText
                          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                          data-node-id="207:1555"
                        >
                          570
                        </DesignText>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="col-2 content-stretch flex flex-col items-start justify-self-stretch pb-[20px] relative row-1 self-stretch shrink-0"
                data-node-id="207:1556"
                data-name="Panel:margin"
              >
                <div
                  className="bg-white border-[#e1e1e1] border-[0.667px] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col h-[301.333px] items-start p-[24px] relative rounded-[12px] shrink-0 w-full"
                  data-node-id="207:1557"
                  data-name="Panel"
                >
                  <div
                    className="content-stretch flex flex-col items-start min-h-[30px] relative shrink-0 w-full"
                    data-node-id="207:1558"
                    data-name="Heading"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[28px] not-italic relative shrink-0 text-[#1f1f1f] text-[20px] whitespace-nowrap"
                      data-node-id="207:1559"
                    >
                      Estado del inventario
                    </DesignText>
                  </div>
                  <div
                    className="content-stretch flex gap-[24px] h-[228px] items-center justify-center min-h-[208px] pt-[20px] relative shrink-0 w-[300.802px]"
                    data-node-id="207:1560"
                    data-name="Reports"
                  >
                    <div
                      className="bg-[rgba(255,255,255,0)] border-[#e1e1e1] border-[18.667px] border-solid grid grid-cols-[_90.67px] grid-rows-[_90.67px] min-h-[36px] overflow-clip relative rounded-[64px] shadow-[0px_0px_0px_1px_#171717] shrink-0 size-[128px]"
                      data-node-id="207:1561"
                      data-name="Container"
                    >
                      <DesignText
                        className="[word-break:break-word] col-1 font-['Poppins:Medium'] justify-self-center leading-[32px] not-italic relative row-1 self-center shrink-0 text-[#1f1f1f] text-[24px] whitespace-nowrap"
                        data-node-id="207:1562"
                      >
                        86%
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0"
                      data-node-id="207:1563"
                      data-name="Container"
                    >
                      <div
                        className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                        data-node-id="207:1564"
                        data-name="Bold Text"
                      >
                        <DesignText
                          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap"
                          data-node-id="207:1565"
                        >
                          7,241 disponibles
                        </DesignText>
                      </div>
                      <div
                        className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                        data-node-id="207:1566"
                        data-name="Text"
                      >
                        <DesignText
                          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                          data-node-id="207:1567"
                        >
                          386 prestados
                        </DesignText>
                      </div>
                      <div
                        className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                        data-node-id="207:1568"
                        data-name="Text"
                      >
                        <DesignText
                          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
                          data-node-id="207:1569"
                        >
                          793 no disponibles
                        </DesignText>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="content-stretch flex flex-col items-start pb-[20px] relative shrink-0 w-full"
              data-node-id="207:1570"
              data-name="Panel:margin"
            >
              <div
                className="bg-white border-[#e1e1e1] border-[0.667px] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col items-start p-[24px] relative rounded-[12px] shrink-0 w-full"
                data-node-id="207:1571"
                data-name="Panel"
              >
                <div
                  className="content-stretch flex items-center justify-between relative shrink-0 w-full"
                  data-node-id="207:1572"
                  data-name="Reports"
                >
                  <div
                    className="content-stretch flex flex-col items-start min-h-[30px] relative shrink-0"
                    data-node-id="207:1573"
                    data-name="Heading"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[28px] not-italic relative shrink-0 text-[#1f1f1f] text-[20px] whitespace-nowrap"
                      data-node-id="207:1574"
                    >
                      Préstamos vencidos
                    </DesignText>
                  </div>
                  <div
                    className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[171px]"
                    data-node-id="207:1575"
                    data-name="Button · DS"
                  >
                    <Buttons
                      buttonText="Ver reporte completo"
                      className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                      type="secondary"
                    />
                  </div>
                </div>
                <div
                  className="content-stretch flex flex-col h-[198.854px] items-start overflow-clip pt-[20px] relative shrink-0 w-full"
                  data-node-id="207:1577"
                  data-name="Table"
                >
                  <div
                    className="grid grid-cols-[____minmax(0,257.99fr)_minmax(0,171.45fr)_minmax(0,249.17fr)_minmax(0,163.40fr)] grid-rows-[____38.80px_46.57px_46.57px_46.57px] h-[178.854px] relative shrink-0 w-full"
                    data-node-id="207:1578"
                    data-name="Table"
                  >
                    <div
                      className="border-[#8e8e8e] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0"
                      data-node-id="207:1579"
                      data-name="Header Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                        data-node-id="207:1580"
                      >
                        Rango de retraso
                      </DesignText>
                    </div>
                    <div
                      className="border-[#8e8e8e] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0"
                      data-node-id="207:1581"
                      data-name="Header Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                        data-node-id="207:1582"
                      >
                        Préstamos
                      </DesignText>
                    </div>
                    <div
                      className="border-[#8e8e8e] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0"
                      data-node-id="207:1583"
                      data-name="Header Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                        data-node-id="207:1584"
                      >
                        Monto generado
                      </DesignText>
                    </div>
                    <div
                      className="border-[#8e8e8e] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0"
                      data-node-id="207:1585"
                      data-name="Header Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full"
                        data-node-id="207:1586"
                      >
                        Variación
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col h-[46.573px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 shrink-0"
                      data-node-id="207:1587"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1588"
                      >
                        1–7 días
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col h-[46.573px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 shrink-0"
                      data-node-id="207:1589"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1590"
                      >
                        24
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col h-[46.573px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 shrink-0"
                      data-node-id="207:1591"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1592"
                      >
                        $820.00
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col h-[46.573px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 shrink-0"
                      data-node-id="207:1593"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1594"
                      >
                        +8%
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col h-[46.573px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 shrink-0"
                      data-node-id="207:1595"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1596"
                      >
                        8–14 días
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col h-[46.573px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 shrink-0"
                      data-node-id="207:1597"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1598"
                      >
                        11
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col h-[46.573px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 shrink-0"
                      data-node-id="207:1599"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1600"
                      >
                        $1,260.00
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col h-[46.573px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 shrink-0"
                      data-node-id="207:1601"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1602"
                      >
                        -3%
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col h-[46.573px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0"
                      data-node-id="207:1603"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1604"
                      >
                        15 días o más
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col h-[46.573px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0"
                      data-node-id="207:1605"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1606"
                      >
                        7
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col h-[46.573px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0"
                      data-node-id="207:1607"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1608"
                      >
                        $2,430.00
                      </DesignText>
                    </div>
                    <div
                      className="border-[#e1e1e1] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col h-[46.573px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0"
                      data-node-id="207:1609"
                      data-name="Table Cell"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full"
                        data-node-id="207:1610"
                      >
                        +12%
                      </DesignText>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Buttons
            buttonText="Solicitudes de libros"
            className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
          />
        </div>
        <div
          className="bg-white border-[#cacaca] border-solid border-t-[0.667px] content-stretch flex h-[65.948px] items-start justify-between px-[32px] py-[24px] relative shrink-0 w-full"
          data-node-id="207:1611"
          data-name="Footer"
        >
          <div
            className="content-stretch flex flex-col h-full items-start relative shrink-0"
            data-node-id="207:1612"
            data-name="Text"
          >
            <DesignText
              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
              data-node-id="207:1613"
            >
              Universidad Ducky · Sistema de Biblioteca
            </DesignText>
          </div>
        </div>
      </div>
    </div>
  );
}
