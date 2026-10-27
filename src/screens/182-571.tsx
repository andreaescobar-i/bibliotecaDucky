import { DesignInput, DesignSelect, DesignText, DynamicSlot } from '../design-controls';
const imgIdentidadBiblioteca = '/assets/e387d.png';
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
export default function RegistrarPrestamoReciboBibliotecario() {
  return (
    <div
      className="bg-[#fafafa] content-stretch flex flex-col items-start relative size-full"
      data-node-id="182:571"
      data-name="registrar prestamo/recibo - bibliotecario"
    >
      <div
        className="bg-[#fafafa] content-stretch flex flex-col h-[966px] items-start min-w-[320px] relative shrink-0 w-full"
        data-node-id="182:572"
        data-name="AppShell"
      >
        <div
          className="bg-white content-stretch flex flex-col items-start relative shrink-0 w-[1280px]"
          data-node-id="185:1839"
          data-name="header"
        >
          <div
            className="backdrop-blur-[12px] bg-[rgba(255,255,255,0)] border-[#d4d4d4] border-b border-solid content-stretch flex gap-[12px] h-[76px] items-center px-[24px] relative shrink-0 w-full"
            data-node-id="I185:1839;247:3311"
            data-name="Header · Bibliotecario"
          >
            <div
              className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex gap-[12px] h-[75px] items-center min-h-[40px] px-[14.4px] py-[8.8px] relative rounded-[6px] shrink-0 w-[183px]"
              data-node-id="I185:1839;247:3312"
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
              data-node-id="I185:1839;247:3320"
              data-name="Navigation"
            >
              <button
                className="bg-[#00a99b] border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I185:1839;247:3321"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap"
                  data-node-id="I185:1839;247:3321;144:1469"
                >
                  Préstamos
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I185:1839;272:2415"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I185:1839;272:2415;144:1484"
                >
                  Catálogo
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I185:1839;247:3322"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I185:1839;247:3322;144:1484"
                >
                  Devolución
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I185:1839;247:3323"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I185:1839;247:3323;144:1484"
                >
                  Renovación
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I185:1839;247:3324"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I185:1839;247:3324;144:1484"
                >
                  Multas y pagos
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I185:1839;247:3325"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I185:1839;247:3325;144:1484"
                >
                  Suspendidos
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I185:1839;247:3360"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I185:1839;247:3360;144:1484"
                >
                  Gestión de libros
                </DesignText>
              </button>
            </div>
            <div
              className="content-stretch flex h-[75px] items-center justify-end overflow-clip relative shrink-0 w-[250px]"
              data-node-id="I185:1839;247:3332"
              data-name="Container"
            >
              <div
                className="content-stretch flex gap-[9.6px] items-center relative shrink-0"
                data-node-id="I185:1839;247:3340"
                data-name="Container"
              >
                <div
                  className="bg-[#262626] grid grid-cols-[_32px] grid-rows-[_32px] relative rounded-[16px] shrink-0 size-[32px]"
                  data-node-id="I185:1839;247:3341"
                  data-name="Text"
                >
                  <DesignText
                    className="[word-break:break-word] col-1 font-['Poppins:Medium'] justify-self-center leading-[18px] not-italic relative row-1 self-center shrink-0 text-[12px] text-white whitespace-nowrap"
                    data-node-id="I185:1839;247:3342"
                  >
                    ML
                  </DesignText>
                </div>
                <div
                  className="content-stretch cursor-pointer flex flex-col items-start relative shrink-0 w-[89.641px]"
                  data-node-id="I185:1839;247:3343"
                  data-name="Container"
                >
                  <button
                    className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                    data-node-id="I185:1839;247:3344"
                    data-name="Bold Text"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] text-left whitespace-nowrap"
                      data-node-id="I185:1839;247:3345"
                    >
                      Mariana López
                    </DesignText>
                  </button>
                  <button
                    className="content-stretch flex flex-col h-[18px] items-start max-w-[160px] overflow-clip relative shrink-0 w-full"
                    data-node-id="I185:1839;247:3346"
                    data-name="Small"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] text-left whitespace-nowrap"
                      data-node-id="I185:1839;247:3347"
                    >
                      Alumno
                    </DesignText>
                  </button>
                </div>
              </div>
              <div
                className="content-stretch cursor-pointer flex items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                data-node-id="I185:1839;247:3348"
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
          className="content-stretch flex flex-col items-center relative shrink-0 w-full"
          data-node-id="182:736"
          data-name="Main Content:margin"
        >
          <div
            className="content-stretch flex flex-col items-start min-h-[524px] pb-[80px] pt-[56px] relative shrink-0 w-[1051px]"
            data-node-id="182:638"
            data-name="Main Content"
          >
            <div
              className="content-stretch flex items-end justify-between relative shrink-0 w-full"
              data-node-id="182:639"
              data-name="PageHeader"
            >
              <div
                className="content-stretch flex flex-col items-start relative shrink-0 w-[290.258px]"
                data-node-id="182:640"
                data-name="Container"
              >
                <div
                  className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                  data-node-id="182:641"
                  data-name="Container"
                >
                  <DesignText
                    className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap"
                    data-node-id="182:642"
                  >
                    Préstamo registrado
                  </DesignText>
                </div>
                <div
                  className="content-stretch flex flex-col h-[48px] items-start pt-[8px] relative shrink-0 w-[290.258px]"
                  data-node-id="182:644"
                  data-name="Heading"
                >
                  <DesignText
                    className="[word-break:break-word] font-['Poppins:Medium'] leading-[38px] not-italic relative shrink-0 text-[#171717] text-[30px] whitespace-nowrap"
                    data-node-id="182:645"
                  >
                    Recibo de préstamo
                  </DesignText>
                </div>
                <div
                  className="content-stretch flex flex-col h-[34.8px] items-start max-w-[720px] pt-[8.8px] relative shrink-0 w-[290.258px]"
                  data-node-id="182:647"
                  data-name="Paragraph"
                >
                  <DesignText
                    className="[word-break:break-word] font-['Poppins:Medium'] leading-[24px] not-italic relative shrink-0 text-[#525252] text-[16px] whitespace-nowrap"
                    data-node-id="182:648"
                  >
                    Operación completada correctamente.
                  </DesignText>
                </div>
              </div>
            </div>
            <div
              className="content-stretch flex flex-col items-center pt-[32px] relative shrink-0 w-full"
              data-node-id="182:727"
              data-name="Panel:margin"
            >
              <div
                className="bg-[var(--bg\/5,white)] border border-[#d4d4d4] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col items-start p-[32px] relative rounded-[14px] shrink-0 w-[656px]"
                data-node-id="182:652"
                data-name="Panel"
              >
                <div
                  className="border-[#171717] border-b-2 border-solid content-stretch flex gap-[16px] items-center pb-[24px] relative shrink-0 w-full"
                  data-node-id="182:653"
                  data-name="LoanRegistration"
                >
                  <div
                    className="border-[#171717] border-[1.5px] border-solid grid grid-cols-[_33.80px] grid-rows-[_33.80px] relative rounded-[18.398px] shrink-0 size-[36.797px]"
                    data-node-id="182:654"
                    data-name="Container"
                  >
                    <DesignText
                      className="[word-break:break-word] col-1 font-['Poppins:Medium'] justify-self-center leading-[18px] not-italic relative row-1 self-center shrink-0 text-[#171717] text-[12px] whitespace-nowrap"
                      data-node-id="182:655"
                    >
                      UD
                    </DesignText>
                  </div>
                  <div
                    className="content-stretch flex flex-col items-start relative shrink-0 w-[421px]"
                    data-node-id="182:657"
                    data-name="Container"
                  >
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="182:658"
                      data-name="Heading"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[28px] not-italic relative shrink-0 text-[#171717] text-[20px] whitespace-nowrap"
                        data-node-id="182:659"
                      >
                        PRE-2026-1843
                      </DesignText>
                    </div>
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[24px] not-italic relative shrink-0 text-[#171717] text-[16px] w-full"
                      data-node-id="182:661"
                    >
                      8 oct 2026
                    </DesignText>
                  </div>
                </div>
                <div
                  className="gap-x-[20px] gap-y-[20px] grid grid-cols-[__325px_325px] grid-rows-[___90px_42.23px_42.23px] h-[310.469px] py-[24px] relative shrink-0 w-full"
                  data-node-id="182:664"
                  data-name="LoanRegistration"
                >
                  <div
                    className="col-1 content-stretch flex flex-col items-start justify-self-stretch relative row-1 self-stretch shrink-0"
                    data-node-id="182:665"
                    data-name="Container"
                  >
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="182:666"
                      data-name="Definition Term"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap"
                        data-node-id="182:667"
                      >
                        Usuario
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex flex-col h-[25.8px] items-start pt-[4.8px] relative shrink-0 w-[325px]"
                      data-node-id="182:669"
                      data-name="Definition Description"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap"
                        data-node-id="182:670"
                      >
                        Mariana López Hernández
                      </DesignText>
                    </div>
                    <div
                      className="[word-break:break-word] content-stretch flex flex-col font-['Poppins:Medium'] gap-[2px] items-start leading-[18px] not-italic overflow-clip relative shrink-0 text-[#737373] text-[12px] w-full"
                      data-node-id="348:1866"
                      data-name="Estatus escolar del alumno"
                    >
                      <DesignText className="relative shrink-0 w-full" data-node-id="348:1867">
                        Estatus escolar
                      </DesignText>
                      <DesignText className="relative shrink-0 w-full" data-node-id="348:1868">
                        Inscrito
                      </DesignText>
                    </div>
                  </div>
                  <div
                    className="col-2 content-stretch flex flex-col items-start justify-self-stretch relative row-1 self-stretch shrink-0"
                    data-node-id="182:673"
                    data-name="Container"
                  >
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="182:674"
                      data-name="Definition Term"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap"
                        data-node-id="182:675"
                      >
                        Matrícula
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex flex-col h-[25.8px] items-start pt-[4.8px] relative shrink-0 w-[325px]"
                      data-node-id="182:677"
                      data-name="Definition Description"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap"
                        data-node-id="182:678"
                      >
                        A01234567
                      </DesignText>
                    </div>
                  </div>
                  <div
                    className="col-1 content-stretch flex flex-col items-start justify-self-stretch relative row-2 self-stretch shrink-0"
                    data-node-id="182:681"
                    data-name="Container"
                  >
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="182:682"
                      data-name="Definition Term"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap"
                        data-node-id="182:683"
                      >
                        Libro
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex flex-col h-[25.8px] items-start pt-[4.8px] relative shrink-0 w-[325px]"
                      data-node-id="182:685"
                      data-name="Definition Description"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap"
                        data-node-id="182:686"
                      >
                        Pedro Páramo
                      </DesignText>
                    </div>
                  </div>
                  <div
                    className="col-2 content-stretch flex flex-col items-start justify-self-stretch relative row-2 self-stretch shrink-0"
                    data-node-id="182:689"
                    data-name="Container"
                  >
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="182:690"
                      data-name="Definition Term"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap"
                        data-node-id="182:691"
                      >
                        Ejemplar
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex flex-col h-[25.8px] items-start pt-[4.8px] relative shrink-0 w-[325px]"
                      data-node-id="182:693"
                      data-name="Definition Description"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap"
                        data-node-id="182:694"
                      >
                        EJ-01082
                      </DesignText>
                    </div>
                  </div>
                  <div
                    className="col-1 content-stretch flex flex-col items-start justify-self-stretch relative row-3 self-stretch shrink-0"
                    data-node-id="182:697"
                    data-name="Container"
                  >
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="182:698"
                      data-name="Definition Term"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap"
                        data-node-id="182:699"
                      >
                        Fecha de préstamo
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex flex-col h-[25.8px] items-start pt-[4.8px] relative shrink-0 w-[325px]"
                      data-node-id="182:701"
                      data-name="Definition Description"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap"
                        data-node-id="182:702"
                      >
                        8 oct 2026
                      </DesignText>
                    </div>
                  </div>
                  <div
                    className="col-2 content-stretch flex flex-col items-start justify-self-stretch relative row-3 self-stretch shrink-0"
                    data-node-id="182:705"
                    data-name="Container"
                  >
                    <div
                      className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                      data-node-id="182:706"
                      data-name="Definition Term"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap"
                        data-node-id="182:707"
                      >
                        Fecha de vencimiento
                      </DesignText>
                    </div>
                    <div
                      className="content-stretch flex flex-col h-[25.8px] items-start pt-[4.8px] relative shrink-0 w-[325px]"
                      data-node-id="182:709"
                      data-name="Definition Description"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap"
                        data-node-id="182:710"
                      >
                        15 oct 2026
                      </DesignText>
                    </div>
                  </div>
                </div>
                <div
                  className="border border-[#737373] border-dashed content-stretch flex flex-col items-center p-[16px] relative shrink-0 w-full"
                  data-node-id="182:713"
                  data-name="LoanRegistration"
                >
                  <DesignText
                    className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] text-center whitespace-nowrap"
                    data-node-id="182:714"
                  >
                    Máximo 2 renovaciones; sujeto a validación.
                  </DesignText>
                </div>
                <div
                  className="content-stretch flex flex-col items-start pt-[24px] relative shrink-0 w-full"
                  data-node-id="182:723"
                  data-name="LoanRegistration:margin"
                >
                  <div
                    className="border-[#e5e5e5] border-solid border-t content-stretch cursor-pointer flex gap-[9.6px] h-[57px] items-start justify-end pt-[16px] relative shrink-0 w-full"
                    data-node-id="182:716"
                    data-name="LoanRegistration"
                  >
                    <Buttons
                      buttonText="Imprimir recibo"
                      className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                      type="secondary"
                    />
                    <Buttons
                      buttonText="Registrar otro préstamo"
                      className="bg-[#00a99b] content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="content-stretch flex flex-col items-start pt-[20px] relative shrink-0 w-full"
              data-node-id="182:728"
              data-name="LoanRegistration:margin"
            >
              <div
                className="bg-[#f5f5f5] border-[#171717] border-l-3 border-solid content-stretch flex flex-col h-[45.6px] items-start px-[16px] py-[12.8px] relative shrink-0 w-full"
                data-node-id="182:724"
                data-name="LoanRegistration"
              />
            </div>
          </div>
        </div>
        <div
          className="bg-[var(--bg\/5,white)] border-[#d4d4d4] border-solid border-t content-stretch flex h-[66.281px] items-start justify-between px-[32px] py-[24px] relative shrink-0 w-full"
          data-node-id="182:729"
          data-name="Footer"
        >
          <div
            className="content-stretch flex flex-col h-full items-start relative shrink-0"
            data-node-id="182:730"
            data-name="Text"
          >
            <DesignText
              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap"
              data-node-id="182:731"
            >
              Universidad Ducky · Sistema de Biblioteca
            </DesignText>
          </div>
        </div>
      </div>
    </div>
  );
}
