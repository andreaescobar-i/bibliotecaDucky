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
export default function RegistrarPrestamoBibliotecario() {
  return (
    <div
      className="bg-[#fafafa] content-stretch flex flex-col items-start relative size-full"
      data-node-id="174:3080"
      data-name="registrar prestamo - bibliotecario"
    >
      <div
        className="bg-[#fafafa] content-stretch flex flex-col items-start min-w-[320px] relative shrink-0 w-full"
        data-node-id="174:3081"
        data-name="AppShell"
      >
        <div
          className="bg-white content-stretch flex flex-col items-start relative shrink-0 w-[1280px]"
          data-node-id="185:1769"
          data-name="header"
        >
          <div
            className="backdrop-blur-[12px] bg-[rgba(255,255,255,0)] border-[#d4d4d4] border-b border-solid content-stretch flex gap-[12px] h-[76px] items-center px-[24px] relative shrink-0 w-full"
            data-node-id="I185:1769;247:3311"
            data-name="Header · Bibliotecario"
          >
            <div
              className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex gap-[12px] h-[75px] items-center min-h-[40px] px-[14.4px] py-[8.8px] relative rounded-[6px] shrink-0 w-[183px]"
              data-node-id="I185:1769;247:3312"
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
              data-node-id="I185:1769;247:3320"
              data-name="Navigation"
            >
              <button
                className="bg-[#00a99b] border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I185:1769;247:3321"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap"
                  data-node-id="I185:1769;247:3321;144:1469"
                >
                  Préstamos
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I185:1769;272:2415"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I185:1769;272:2415;144:1484"
                >
                  Catálogo
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I185:1769;247:3322"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I185:1769;247:3322;144:1484"
                >
                  Devolución
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I185:1769;247:3323"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I185:1769;247:3323;144:1484"
                >
                  Renovación
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I185:1769;247:3324"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I185:1769;247:3324;144:1484"
                >
                  Multas y pagos
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I185:1769;247:3325"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I185:1769;247:3325;144:1484"
                >
                  Suspendidos
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I185:1769;247:3360"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I185:1769;247:3360;144:1484"
                >
                  Gestión de libros
                </DesignText>
              </button>
            </div>
            <div
              className="content-stretch flex h-[75px] items-center justify-end overflow-clip relative shrink-0 w-[250px]"
              data-node-id="I185:1769;247:3332"
              data-name="Container"
            >
              <div
                className="content-stretch flex gap-[9.6px] items-center relative shrink-0"
                data-node-id="I185:1769;247:3340"
                data-name="Container"
              >
                <div
                  className="bg-[#262626] grid grid-cols-[_32px] grid-rows-[_32px] relative rounded-[16px] shrink-0 size-[32px]"
                  data-node-id="I185:1769;247:3341"
                  data-name="Text"
                >
                  <DesignText
                    className="[word-break:break-word] col-1 font-['Poppins:Medium'] justify-self-center leading-[18px] not-italic relative row-1 self-center shrink-0 text-[12px] text-white whitespace-nowrap"
                    data-node-id="I185:1769;247:3342"
                  >
                    ML
                  </DesignText>
                </div>
                <div
                  className="content-stretch cursor-pointer flex flex-col items-start relative shrink-0 w-[89.641px]"
                  data-node-id="I185:1769;247:3343"
                  data-name="Container"
                >
                  <button
                    className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                    data-node-id="I185:1769;247:3344"
                    data-name="Bold Text"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] text-left whitespace-nowrap"
                      data-node-id="I185:1769;247:3345"
                    >
                      Mariana López
                    </DesignText>
                  </button>
                  <button
                    className="content-stretch flex flex-col h-[18px] items-start max-w-[160px] overflow-clip relative shrink-0 w-full"
                    data-node-id="I185:1769;247:3346"
                    data-name="Small"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] text-left whitespace-nowrap"
                      data-node-id="I185:1769;247:3347"
                    >
                      Alumno
                    </DesignText>
                  </button>
                </div>
              </div>
              <div
                className="content-stretch cursor-pointer flex items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                data-node-id="I185:1769;247:3348"
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
          data-node-id="174:3246"
          data-name="Main Content:margin"
        >
          <div
            className="content-stretch flex flex-col items-start min-h-[526px] pb-[80px] pt-[56px] relative shrink-0 w-[1232px]"
            data-node-id="174:3147"
            data-name="Main Content"
          >
            <div
              className="content-stretch flex items-end justify-between relative shrink-0 w-full"
              data-node-id="174:3148"
              data-name="PageHeader"
            >
              <div
                className="content-stretch flex flex-col items-start relative shrink-0 w-[463.07px]"
                data-node-id="174:3149"
                data-name="Container"
              >
                <div
                  className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                  data-node-id="174:3150"
                  data-name="Heading"
                >
                  <DesignText
                    className="[word-break:break-word] font-['Poppins:Medium'] leading-[38px] not-italic relative shrink-0 text-[#171717] text-[30px] whitespace-nowrap"
                    data-node-id="174:3151"
                  >
                    Registrar préstamo
                  </DesignText>
                </div>
                <div
                  className="content-stretch flex flex-col h-[34.8px] items-start max-w-[720px] pt-[8.8px] relative shrink-0 w-[463.07px]"
                  data-node-id="174:3153"
                  data-name="Paragraph"
                >
                  <DesignText
                    className="[word-break:break-word] font-['Poppins:Medium'] leading-[24px] not-italic relative shrink-0 text-[#525252] text-[16px] whitespace-nowrap"
                    data-node-id="174:3154"
                  >
                    Valida al usuario y el ejemplar antes de confirmar el movimiento.
                  </DesignText>
                </div>
              </div>
            </div>
            <div
              className="content-stretch flex flex-col items-start pt-[32px] relative shrink-0 w-full"
              data-node-id="174:3236"
              data-name="Steps:margin"
            >
              <div
                className="content-stretch flex flex-col items-start pt-[32px] relative shrink-0 w-[1228px]"
                data-node-id="174:3284"
                data-name="Steps:margin"
              >
                <div
                  className="content-stretch flex items-center justify-between relative shrink-0 w-full"
                  data-node-id="I174:3284;7:1254"
                  data-name="Steps"
                >
                  <div
                    className="bg-[#e4f2ff] border border-[#93c8ff] border-solid content-stretch flex gap-[12px] h-[60px] items-center p-[16px] relative rounded-[4px] shrink-0 w-[350px]"
                    data-node-id="I174:3284;165:2488"
                    data-name="steps"
                  >
                    <div
                      className="bg-[#3a70e2] content-stretch flex flex-col items-center justify-center relative rounded-[14px] shrink-0 size-[28px]"
                      data-node-id="I174:3284;165:2488;165:2465"
                      data-name="Step Badge"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap"
                        data-node-id="I174:3284;165:2488;165:2466"
                      >
                        1
                      </DesignText>
                    </div>
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap"
                      data-node-id="I174:3284;165:2488;165:2467"
                    >
                      Validar usuario
                    </DesignText>
                  </div>
                  <div
                    className="bg-[#e4f2ff] border border-[#93c8ff] border-solid content-stretch flex gap-[12px] h-[60px] items-center p-[16px] relative rounded-[4px] shrink-0 w-[350px]"
                    data-node-id="I174:3284;165:2493"
                    data-name="steps"
                  >
                    <div
                      className="bg-[#3a70e2] content-stretch flex flex-col items-center justify-center relative rounded-[14px] shrink-0 size-[28px]"
                      data-node-id="I174:3284;165:2493;165:2465"
                      data-name="Step Badge"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap"
                        data-node-id="I174:3284;165:2493;165:2466"
                      >
                        2
                      </DesignText>
                    </div>
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap"
                      data-node-id="I174:3284;165:2493;165:2467"
                    >
                      Validar libro
                    </DesignText>
                  </div>
                  <div
                    className="bg-[#e4f2ff] border border-[#93c8ff] border-solid content-stretch flex gap-[12px] h-[60px] items-center p-[16px] relative rounded-[4px] shrink-0 w-[350px]"
                    data-node-id="I174:3284;165:2501"
                    data-name="steps"
                  >
                    <div
                      className="bg-[#3a70e2] content-stretch flex flex-col items-center justify-center relative rounded-[14px] shrink-0 size-[28px]"
                      data-node-id="I174:3284;165:2501;165:2465"
                      data-name="Step Badge"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap"
                        data-node-id="I174:3284;165:2501;165:2466"
                      >
                        3
                      </DesignText>
                    </div>
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap"
                      data-node-id="I174:3284;165:2501;165:2467"
                    >
                      Confirmar préstamo
                    </DesignText>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="content-stretch flex flex-col items-start pt-[20px] relative shrink-0 w-full"
              data-node-id="174:3237"
              data-name="Panel:margin"
            >
              <div
                className="bg-[var(--bg\/5,white)] border border-[#d4d4d4] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col items-start p-[24px] relative rounded-[14px] shrink-0 w-full"
                data-node-id="174:3179"
                data-name="Panel"
              >
                <div
                  className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                  data-node-id="174:3180"
                  data-name="Heading"
                >
                  <DesignText
                    className="[word-break:break-word] font-['Poppins:Medium'] leading-[28px] not-italic relative shrink-0 text-[#171717] text-[20px] whitespace-nowrap"
                    data-node-id="174:3181"
                  >
                    3. Confirmar préstamo
                  </DesignText>
                </div>
                <div
                  className="content-stretch flex flex-col items-start pt-[20px] relative shrink-0 w-full"
                  data-node-id="174:3230"
                  data-name="LoanRegistration:margin"
                >
                  <div
                    className="content-stretch flex gap-[92px] items-start relative shrink-0 w-full"
                    data-node-id="174:3183"
                    data-name="LoanRegistration"
                  >
                    <div
                      className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px relative self-stretch"
                      data-node-id="174:3184"
                      data-name="Definition List"
                    >
                      <div
                        className="border-[#e5e5e5] border-b border-solid content-stretch flex flex-col items-start pb-[12.8px] relative shrink-0 w-full"
                        data-node-id="174:3185"
                        data-name="Container"
                      >
                        <div
                          className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                          data-node-id="174:3186"
                          data-name="Definition Term"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap"
                            data-node-id="174:3187"
                          >
                            Usuario
                          </DesignText>
                        </div>
                        <div
                          className="content-stretch flex flex-col h-[25.8px] items-start pt-[4.8px] relative shrink-0 w-[484.5px]"
                          data-node-id="174:3189"
                          data-name="Definition Description"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap"
                            data-node-id="174:3190"
                          >
                            Mariana López Hernández
                          </DesignText>
                        </div>
                        <div
                          className="[word-break:break-word] content-stretch flex flex-col font-['Poppins:Medium'] gap-[2px] items-start leading-[18px] not-italic overflow-clip relative shrink-0 text-[#737373] text-[12px] w-full"
                          data-node-id="348:1863"
                          data-name="Estatus escolar del alumno"
                        >
                          <DesignText className="relative shrink-0 w-full" data-node-id="348:1864">
                            Estatus escolar
                          </DesignText>
                          <DesignText className="relative shrink-0 w-full" data-node-id="348:1865">
                            Inscrito
                          </DesignText>
                        </div>
                      </div>
                      <div
                        className="border-[#e5e5e5] border-b border-solid content-stretch flex flex-col items-start pb-[12.8px] relative shrink-0 w-full"
                        data-node-id="174:3193"
                        data-name="Container"
                      >
                        <div
                          className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                          data-node-id="174:3194"
                          data-name="Definition Term"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap"
                            data-node-id="174:3195"
                          >
                            Libro
                          </DesignText>
                        </div>
                        <div
                          className="content-stretch flex flex-col h-[25.8px] items-start pt-[4.8px] relative shrink-0 w-[484.5px]"
                          data-node-id="174:3197"
                          data-name="Definition Description"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap"
                            data-node-id="174:3198"
                          >
                            Pedro Páramo
                          </DesignText>
                        </div>
                      </div>
                      <div
                        className="border-[#e5e5e5] border-b border-solid content-stretch flex flex-col items-start pb-[12.8px] relative shrink-0 w-full"
                        data-node-id="174:3201"
                        data-name="Container"
                      >
                        <div
                          className="content-stretch flex flex-col items-start relative shrink-0 w-full"
                          data-node-id="174:3202"
                          data-name="Definition Term"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap"
                            data-node-id="174:3203"
                          >
                            Ejemplar
                          </DesignText>
                        </div>
                        <div
                          className="content-stretch flex flex-col h-[25.8px] items-start pt-[4.8px] relative shrink-0 w-[484.5px]"
                          data-node-id="174:3205"
                          data-name="Definition Description"
                        >
                          <DesignText
                            className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap"
                            data-node-id="174:3206"
                          >
                            EJ-01082
                          </DesignText>
                        </div>
                      </div>
                    </div>
                    <div
                      className="border-2 border-[#171717] border-solid content-stretch flex flex-[1_0_0] flex-col items-center justify-center min-w-px p-[32px] relative rounded-[10px] self-stretch"
                      data-node-id="174:3209"
                      data-name="Container"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] text-center whitespace-nowrap"
                        data-node-id="174:3211"
                      >
                        Fecha de vencimiento calculada
                      </DesignText>
                      <div
                        className="content-stretch flex flex-col items-start py-[8px] relative shrink-0"
                        data-node-id="174:3219"
                        data-name="Bold Text:margin"
                      >
                        <DesignText
                          className="[word-break:break-word] font-['Poppins:Medium'] leading-[32px] not-italic relative shrink-0 text-[#171717] text-[24px] text-center whitespace-nowrap"
                          data-node-id="174:3214"
                        >
                          15 oct 2026
                        </DesignText>
                      </div>
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] text-center whitespace-nowrap"
                        data-node-id="174:3217"
                      >
                        5 días hábiles
                      </DesignText>
                    </div>
                  </div>
                </div>
                <div
                  className="content-stretch flex flex-col items-start pt-[20px] relative shrink-0 w-full"
                  data-node-id="174:3231"
                  data-name="LoanRegistration:margin"
                >
                  <div
                    className="bg-[#fafafa] border border-[#737373] border-solid content-stretch flex flex-col items-start px-[16px] py-[12.8px] relative rounded-[6px] shrink-0 w-full"
                    data-node-id="174:3220"
                    data-name="LoanRegistration"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] whitespace-nowrap"
                      data-node-id="174:3221"
                    >
                      Al confirmar, el ejemplar cambiará su estado a “Prestado” y se generará el
                      recibo.
                    </DesignText>
                  </div>
                </div>
                <div
                  className="content-stretch flex flex-col items-start pt-[24px] relative shrink-0 w-full"
                  data-node-id="174:3232"
                  data-name="LoanRegistration:margin"
                >
                  <div
                    className="border-[#e5e5e5] border-solid border-t content-stretch cursor-pointer flex gap-[9.6px] h-[57px] items-start justify-end pt-[16px] relative shrink-0 w-full"
                    data-node-id="174:3223"
                    data-name="LoanRegistration"
                  >
                    <button
                      className="aspect-[84/40] bg-[#eefcfa] content-stretch flex items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                      data-node-id="174:3304"
                      data-name="Buttons"
                    >
                      <DesignText
                        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-left whitespace-nowrap"
                        data-node-id="I174:3304;27:274"
                      >
                        Regresar
                      </DesignText>
                    </button>
                    <Buttons
                      buttonText="Confirmar y generar recibo"
                      className="bg-[#00a99b] content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="content-stretch flex flex-col items-start pt-[20px] relative shrink-0 w-full"
              data-node-id="174:3238"
              data-name="LoanRegistration:margin"
            >
              <div
                className="bg-[#f5f5f5] border-[#171717] border-l-3 border-solid content-stretch flex flex-col h-[45.6px] items-start px-[16px] py-[12.8px] relative shrink-0 w-full"
                data-node-id="174:3233"
                data-name="LoanRegistration"
              />
            </div>
          </div>
        </div>
        <div
          className="bg-[var(--bg\/5,white)] border-[#d4d4d4] border-solid border-t content-stretch flex h-[66.281px] items-start justify-between px-[32px] py-[24px] relative shrink-0 w-full"
          data-node-id="174:3239"
          data-name="Footer"
        >
          <div
            className="content-stretch flex flex-col h-full items-start relative shrink-0"
            data-node-id="174:3240"
            data-name="Text"
          >
            <DesignText
              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap"
              data-node-id="174:3241"
            >
              Universidad Ducky · Sistema de Biblioteca
            </DesignText>
          </div>
        </div>
      </div>
    </div>
  );
}
