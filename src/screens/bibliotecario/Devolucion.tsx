import { DesignInput, DesignSelect, DesignText, DynamicSlot } from '../../design-controls';
const imgIdentidadBiblioteca = '/assets/e387d.png';
const imgSearch = '/assets/7c10f.svg';
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
  return (
    <button
      type="button"
      className={
        className ||
        `content-stretch flex items-center justify-center relative rounded-[8px] ${isMediumAndSecondary ? 'border border-[#007566] border-solid h-[45px] p-[10px]' : 'bg-[#00a99b] h-[40px] px-[10px] py-[5px]'}`
      }
      id={isMediumAndSecondary ? 'node-27_257' : 'node-27_182'}
    >
      {size === 'small' && type === 'primary' && (
        <p
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap"
          data-node-id="27:180"
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
export default function Devolucion() {
  return (
    <div
      className="bg-[#fafafa] content-stretch flex flex-col items-start relative size-full"
      data-node-id="182:908"
      data-name="devolución - bibliotecario"
    >
      <div
        className="bg-[#fafafa] content-stretch flex flex-col h-[789px] items-start min-h-[422px] min-w-[320px] relative shrink-0 w-full"
        data-node-id="182:909"
        data-name="AppShell"
      >
        <div
          className="bg-white content-stretch flex flex-col items-start relative shrink-0 w-[1280px]"
          data-node-id="185:1909"
          data-name="header"
        >
          <div
            className="backdrop-blur-[12px] bg-[rgba(255,255,255,0)] border-[#d4d4d4] border-b border-solid content-stretch flex gap-[12px] h-[76px] items-center px-[24px] relative shrink-0 w-full"
            data-node-id="I185:1909;247:3311"
            data-name="Header · Bibliotecario"
          >
            <div
              className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex gap-[12px] h-[75px] items-center min-h-[40px] px-[14.4px] py-[8.8px] relative rounded-[6px] shrink-0 w-[183px]"
              data-node-id="I185:1909;247:3312"
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
              data-node-id="I185:1909;247:3320"
              data-name="Navigation"
            >
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I185:1909;247:3321"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I185:1909;247:3321;144:1484"
                >
                  Préstamos
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I185:1909;272:2415"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I185:1909;272:2415;144:1484"
                >
                  Catálogo
                </DesignText>
              </button>
              <button
                className="bg-[#00a99b] border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I185:1909;247:3322"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap"
                  data-node-id="I185:1909;247:3322;144:1469"
                >
                  Devolución
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I185:1909;247:3323"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I185:1909;247:3323;144:1484"
                >
                  Renovación
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I185:1909;247:3324"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I185:1909;247:3324;144:1484"
                >
                  Multas y pagos
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I185:1909;247:3325"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I185:1909;247:3325;144:1484"
                >
                  Suspendidos
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I185:1909;247:3360"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I185:1909;247:3360;144:1484"
                >
                  Gestión de libros
                </DesignText>
              </button>
            </div>
            <div
              className="content-stretch flex h-[75px] items-center justify-end overflow-clip relative shrink-0 w-[250px]"
              data-node-id="I185:1909;247:3332"
              data-name="Container"
            >
              <div
                className="content-stretch flex gap-[9.6px] items-center relative shrink-0"
                data-node-id="I185:1909;247:3340"
                data-name="Container"
              >
                <div
                  className="bg-[#262626] grid grid-cols-[_32px] grid-rows-[_32px] relative rounded-[16px] shrink-0 size-[32px]"
                  data-node-id="I185:1909;247:3341"
                  data-name="Text"
                >
                  <DesignText
                    className="[word-break:break-word] col-1 font-['Poppins:Medium'] justify-self-center leading-[18px] not-italic relative row-1 self-center shrink-0 text-[12px] text-white whitespace-nowrap"
                    data-node-id="I185:1909;247:3342"
                  >
                    ML
                  </DesignText>
                </div>
                <div
                  className="content-stretch cursor-pointer flex flex-col items-start relative shrink-0 w-[89.641px]"
                  data-node-id="I185:1909;247:3343"
                  data-name="Container"
                >
                  <button
                    className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                    data-node-id="I185:1909;247:3344"
                    data-name="Bold Text"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] text-left whitespace-nowrap"
                      data-node-id="I185:1909;247:3345"
                    >
                      Mariana López
                    </DesignText>
                  </button>
                  <button
                    className="content-stretch flex flex-col h-[18px] items-start max-w-[160px] overflow-clip relative shrink-0 w-full"
                    data-node-id="I185:1909;247:3346"
                    data-name="Small"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] text-left whitespace-nowrap"
                      data-node-id="I185:1909;247:3347"
                    >
                      Alumno
                    </DesignText>
                  </button>
                </div>
              </div>
              <div
                className="content-stretch cursor-pointer flex items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                data-node-id="I185:1909;247:3348"
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
          className="content-stretch flex flex-col h-[713px] items-center relative shrink-0 w-full"
          data-node-id="182:930"
          data-name="Main Content:margin"
        >
          <div
            className="content-stretch flex flex-col items-start pb-[80px] pt-[56px] relative shrink-0 w-[1226px]"
            data-node-id="182:931"
            data-name="Main Content"
          >
            <div
              className="content-stretch flex h-[90px] items-end justify-between relative shrink-0 w-full"
              data-node-id="182:932"
              data-name="PageHeader"
            >
              <div
                className="content-stretch flex flex-col items-start relative shrink-0 w-[316.99px]"
                data-node-id="182:933"
                data-name="Container"
              >
                <div
                  className="content-stretch flex flex-col items-start min-h-[36px] relative shrink-0 w-full"
                  data-node-id="182:934"
                  data-name="Heading"
                >
                  <DesignText
                    className="[word-break:break-word] font-['Poppins:Medium'] leading-[32px] not-italic relative shrink-0 text-[#1f1f1f] text-[24px] whitespace-nowrap"
                    data-node-id="182:935"
                  >
                    Registrar devolución
                  </DesignText>
                </div>
                <div
                  className="content-stretch flex flex-col h-[34.8px] items-start max-w-[720px] pt-[8.8px] relative shrink-0 w-[316.99px]"
                  data-node-id="182:936"
                  data-name="Paragraph"
                >
                  <DesignText
                    className="[word-break:break-word] font-['Poppins:Medium'] leading-[24px] not-italic relative shrink-0 text-[#4b4b4b] text-[16px] whitespace-nowrap"
                    data-node-id="182:937"
                  >
                    Localiza el préstamo y revisa si existe retraso.
                  </DesignText>
                </div>
              </div>
            </div>
            <div
              className="content-stretch flex flex-col items-start pb-[20px] pt-[32px] relative shrink-0 w-full"
              data-node-id="182:938"
              data-name="Panel:margin"
            >
              <div
                className="bg-white border-[#e1e1e1] border-[0.667px] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col items-start p-[24px] relative rounded-[12px] shrink-0 w-full"
                data-node-id="182:939"
                data-name="Panel"
              >
                <div
                  className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full"
                  data-node-id="182:940"
                  data-name="Toolbar:margin"
                >
                  <div
                    className="bg-[#fafafa] border border-[#e5e5e5] border-solid content-stretch flex gap-[12px] items-center p-[16px] relative rounded-[10px] shrink-0 w-[1176px]"
                    data-node-id="182:1016"
                    data-name="Toolbar"
                  >
                    <div
                      className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative"
                      data-node-id="I182:1016;7:1281"
                      data-name="Field"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] whitespace-nowrap"
                        data-node-id="I182:1016;7:1283"
                      >
                        Folio, matrícula o clave del ejemplar
                      </DesignText>
                      <DesignInput
                        className="content-stretch cursor-pointer flex gap-[10px] h-[44px] items-center px-[14px] py-[10px] relative rounded-[8px] shrink-0 w-full"
                        data-node-id="I182:1016;165:2416"
                        data-name="Input · Interactivo"
                        label="Folio, matrícula o clave del ejemplar"
                        initialValue="Ej. PRE-2025-1731"
                      >
                        <div
                          className="absolute inset-0 rounded-[4px]"
                          data-node-id="I182:1016;165:2416;2024:4518"
                          data-name="Input · DS · Base"
                        >
                          <div
                            className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
                            data-node-id="I182:1016;165:2416;2024:4518;65:1262"
                            data-name="Base"
                          />
                        </div>
                        <div
                          className="relative shrink-0 size-[20px]"
                          data-node-id="I182:1016;165:2416;165:2391"
                          data-name="Search"
                        >
                          <img
                            alt=""
                            className="absolute block inset-0 max-w-none size-full"
                            src={imgSearch}
                          />
                        </div>
                        <DesignText
                          className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] h-full leading-[24px] min-w-px not-italic relative text-[#8e8e8e] text-[16px] text-left"
                          data-node-id="I182:1016;165:2416;165:2392"
                        >
                          Ej. PRE-2025-1731
                        </DesignText>
                      </DesignInput>
                    </div>
                    <button
                      className="content-stretch cursor-pointer flex items-center justify-center relative rounded-[8px] shrink-0"
                      data-node-id="I182:1016;7:1287"
                      data-name="Button · DS"
                    >
                      <div
                        className="aspect-[74/40] border border-[#007566] border-solid content-stretch flex items-center justify-center p-[10px] relative rounded-[8px] shrink-0"
                        data-node-id="I182:1016;2022:2882"
                        data-name="Buttons"
                      >
                        <DesignText
                          className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#007566] text-[14px] text-left whitespace-nowrap"
                          data-node-id="I182:1016;2022:2882;27:258"
                        >
                          Buscar préstamo
                        </DesignText>
                      </div>
                    </button>
                  </div>
                </div>
                <DynamicSlot
                  className="bg-[#fafafa] border border-[#e5e5e5] border-solid content-stretch flex flex-col h-[240px] items-center justify-center min-h-[240px] p-[32px] relative rounded-[12px] shrink-0 w-full"
                  data-node-id="192:2732"
                  data-name="search_loan"
                >
                  <div
                    className="content-stretch flex flex-col items-start pb-[12px] relative shrink-0"
                    data-node-id="I192:2732;185:2053"
                    data-name="Container:margin"
                  >
                    <div
                      className="bg-white border border-[#e1e1e1] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[20px] shrink-0 size-[40px]"
                      data-node-id="I192:2732;185:2054"
                      data-name="Icon Container"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[28px] not-italic relative shrink-0 text-[#1f1f1f] text-[20px] whitespace-nowrap"
                        data-node-id="I192:2732;185:2055"
                      >
                        —
                      </DesignText>
                    </div>
                  </div>
                  <DesignText
                    className="[word-break:break-word] font-['Poppins:Medium'] leading-[24px] not-italic relative shrink-0 text-[#171717] text-[16px] whitespace-nowrap"
                    data-node-id="I192:2732;185:2056"
                  >
                    Busca un préstamo
                  </DesignText>
                  <div
                    className="content-stretch flex flex-col items-start pt-[8px] relative shrink-0"
                    data-node-id="I192:2732;185:2057"
                    data-name="Paragraph:margin"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#525252] text-[14px] text-center w-[480px]"
                      data-node-id="I192:2732;185:2058"
                    >
                      La validación mostrará automáticamente la información del préstamo.
                    </DesignText>
                  </div>
                </DynamicSlot>
              </div>
            </div>
          </div>
        </div>
        <div
          className="bg-white border-[#cacaca] border-solid border-t-[0.667px] content-stretch flex h-[65.948px] items-start justify-between px-[32px] py-[24px] relative shrink-0 w-full"
          data-node-id="182:949"
          data-name="Footer"
        >
          <div
            className="content-stretch flex flex-col h-full items-start relative shrink-0"
            data-node-id="182:950"
            data-name="Text"
          >
            <DesignText
              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
              data-node-id="182:951"
            >
              Universidad Ducky · Sistema de Biblioteca
            </DesignText>
          </div>
        </div>
      </div>
    </div>
  );
}
