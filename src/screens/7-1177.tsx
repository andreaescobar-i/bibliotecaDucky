import { DesignInput, DesignSelect, DesignText, DynamicSlot } from "../design-controls";
const imgSearch = "/assets/7c10f.svg";
const imgIdentidadBiblioteca = "/assets/e387d.png";
type ButtonsProps = {
    className?: string;
    buttonText?: string;
    icons?: "false";
    size?: "small" | "medium";
    state?: "Default";
    type?: "primary" | "secondary";
};
function Buttons({ className, buttonText = "text", icons = "false", size = "small", state = "Default", type = "primary" }: ButtonsProps) {
    const isMediumAndSecondary = size === "medium" && type === "secondary";
    const isSmallAndSecondary = size === "small" && type === "secondary";
    return (<button type="button" className={className || `content-stretch flex items-center justify-center relative rounded-[8px] ${isMediumAndSecondary ? "border border-[#007566] border-solid h-[45px] p-[10px]" : isSmallAndSecondary ? "border border-[#007566] border-solid h-[40px] px-[10px] py-[5px]" : "bg-[#00a99b] h-[40px] px-[10px] py-[5px]"}`} id={isMediumAndSecondary ? "node-27_257" : isSmallAndSecondary ? "node-27_255" : "node-27_182"}>
      {size === "small" && type === "primary" && (<p className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="27:180">
          {buttonText}
        </p>)}
      {isSmallAndSecondary && (<p className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#007566] text-[12px] whitespace-nowrap" data-node-id="27:256">
          {buttonText}
        </p>)}
      {isMediumAndSecondary && (<p className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#007566] text-[14px] whitespace-nowrap" data-node-id="27:258">
          {buttonText}
        </p>)}
    </button>);
}
function Toolbar({ className }: {
    className?: string;
}) {
    return (<div className={className || "bg-[#fafafa] border border-[#e5e5e5] border-solid content-stretch flex gap-[12px] items-center p-[16px] relative rounded-[10px] w-[1180px]"} data-node-id="174:2996" data-name="Toolbar">
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative" data-node-id="7:1281" data-name="Field">
        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] whitespace-nowrap" data-node-id="7:1283">
          Matrícula o nombre
        </DesignText>
        <DesignInput className="content-stretch cursor-pointer flex gap-[10px] h-[44px] items-center px-[14px] py-[10px] relative rounded-[8px] shrink-0 w-[997px]" data-node-id="165:2416" data-name="Input · Interactivo" label="Matrícula o nombre" initialValue="Ej. A01234567 o Mariana López">
          <div className="absolute inset-0 rounded-[4px]" data-node-id="I165:2416;2024:4518" data-name="Input · DS · Base">
            <div className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]" data-node-id="I165:2416;2024:4518;65:1262" data-name="Base"/>
          </div>
          <div className="relative shrink-0 size-[20px]" data-node-id="I165:2416;165:2391" data-name="Search">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSearch}/>
          </div>
          <DesignText className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] h-full leading-[22px] min-w-px not-italic relative text-[#8e8e8e] text-[14px] text-left" data-node-id="I165:2416;165:2392">
            Ej. A01234567 o Mariana López
          </DesignText>
        </DesignInput>
      </div>
      <div className="content-stretch cursor-pointer flex items-center justify-center relative rounded-[8px] shrink-0" data-node-id="7:1287" data-name="Button · DS">
        <Buttons buttonText="Buscar usuario" className="aspect-[74/40] border border-[#007566] border-solid content-stretch flex items-center justify-center p-[10px] relative rounded-[8px] shrink-0" size="medium" type="secondary"/>
      </div>
    </div>);
}
function StepsMargin({ className }: {
    className?: string;
}) {
    return (<div className={className || "content-stretch flex flex-col items-start pt-[32px] relative w-[1228px]"} data-node-id="165:2507" data-name="Steps:margin">
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="7:1254" data-name="Steps">
        <div className="bg-[#e4f2ff] border border-[#93c8ff] border-solid content-stretch flex gap-[12px] h-[60px] items-center p-[16px] relative rounded-[4px] shrink-0 w-[350px]" data-node-id="165:2488" data-name="steps">
          <div className="bg-[#3a70e2] content-stretch flex flex-col items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-node-id="I165:2488;165:2465" data-name="Step Badge">
            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="I165:2488;165:2466">
              1
            </DesignText>
          </div>
          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#171717] text-[14px] whitespace-nowrap" data-node-id="I165:2488;165:2467">
            Validar usuario
          </DesignText>
        </div>
        <div className="bg-white border border-[#8e8e8e] border-solid content-stretch flex gap-[12px] h-[60px] items-center p-[16px] relative rounded-[4px] shrink-0 w-[350px]" data-node-id="165:2493" data-name="steps">
          <div className="bg-[#8e8e8e] content-stretch flex flex-col items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-node-id="I165:2493;165:2472" data-name="Step Badge">
            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="I165:2493;165:2473">
              2
            </DesignText>
          </div>
          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#8e8e8e] text-[14px] whitespace-nowrap" data-node-id="I165:2493;165:2474">
            Validar libro
          </DesignText>
        </div>
        <div className="bg-white border border-[#8e8e8e] border-solid content-stretch flex gap-[12px] h-[60px] items-center p-[16px] relative rounded-[4px] shrink-0 w-[350px]" data-node-id="165:2501" data-name="steps">
          <div className="bg-[#8e8e8e] content-stretch flex flex-col items-center justify-center relative rounded-[14px] shrink-0 size-[28px]" data-node-id="I165:2501;165:2472" data-name="Step Badge">
            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="I165:2501;165:2473">
              3
            </DesignText>
          </div>
          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#8e8e8e] text-[14px] whitespace-nowrap" data-node-id="I165:2501;165:2474">
            Confirmar préstamo
          </DesignText>
        </div>
      </div>
    </div>);
}
export default function RegistrarPrestamoValidarUsuarioBibliotecario() {
    return (<div className="bg-[#fafafa] content-stretch flex flex-col items-start relative size-full" data-node-id="7:1177" data-name="registrar prestamo/validar usuario - bibliotecario">
      <div className="bg-[#fafafa] content-stretch flex flex-col items-start min-w-[320px] relative shrink-0 w-full" data-node-id="7:1178" data-name="AppShell">
        <div className="bg-white content-stretch flex flex-col items-start relative shrink-0 w-[1280px]" data-node-id="185:1629" data-name="header">
          <div className="backdrop-blur-[12px] bg-[rgba(255,255,255,0)] border-[#d4d4d4] border-b border-solid content-stretch flex gap-[12px] h-[76px] items-center px-[24px] relative shrink-0 w-full" data-node-id="I185:1629;247:3311" data-name="Header · Bibliotecario">
            <div className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex gap-[12px] h-[75px] items-center min-h-[40px] px-[14.4px] py-[8.8px] relative rounded-[6px] shrink-0 w-[183px]" data-node-id="I185:1629;247:3312" data-name="Identidad · Biblioteca">
              <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none rounded-[6px] size-full" src={imgIdentidadBiblioteca}/>
            </div>
            <div className="content-stretch cursor-pointer flex flex-[1_0_0] gap-[4px] h-[50px] items-center justify-center min-w-px px-[24px] relative" data-node-id="I185:1629;247:3320" data-name="Navigation">
              <button className="bg-[#00a99b] border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I185:1629;247:3321" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap" data-node-id="I185:1629;247:3321;144:1469">
                  Préstamos
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I185:1629;272:2415" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I185:1629;272:2415;144:1484">
                  Catálogo
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I185:1629;247:3322" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I185:1629;247:3322;144:1484">
                  Devolución
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I185:1629;247:3323" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I185:1629;247:3323;144:1484">
                  Renovación
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I185:1629;247:3324" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I185:1629;247:3324;144:1484">
                  Multas y pagos
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I185:1629;247:3325" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I185:1629;247:3325;144:1484">
                  Suspendidos
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I185:1629;247:3360" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I185:1629;247:3360;144:1484">
                  Gestión de libros
                </DesignText>
              </button>
            </div>
            <div className="content-stretch flex h-[75px] items-center justify-end overflow-clip relative shrink-0 w-[250px]" data-node-id="I185:1629;247:3332" data-name="Container">
              <div className="content-stretch flex gap-[9.6px] items-center relative shrink-0" data-node-id="I185:1629;247:3340" data-name="Container">
                <div className="bg-[#262626] grid grid-cols-[_32px] grid-rows-[_32px] relative rounded-[16px] shrink-0 size-[32px]" data-node-id="I185:1629;247:3341" data-name="Text">
                  <DesignText className="[word-break:break-word] col-1 font-['Poppins:Medium'] justify-self-center leading-[18px] not-italic relative row-1 self-center shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="I185:1629;247:3342">
                    ML
                  </DesignText>
                </div>
                <div className="content-stretch cursor-pointer flex flex-col items-start relative shrink-0 w-[89.641px]" data-node-id="I185:1629;247:3343" data-name="Container">
                  <button className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="I185:1629;247:3344" data-name="Bold Text">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] text-left whitespace-nowrap" data-node-id="I185:1629;247:3345">
                      Mariana López
                    </DesignText>
                  </button>
                  <button className="content-stretch flex flex-col h-[18px] items-start max-w-[160px] overflow-clip relative shrink-0 w-full" data-node-id="I185:1629;247:3346" data-name="Small">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] text-left whitespace-nowrap" data-node-id="I185:1629;247:3347">
                      Alumno
                    </DesignText>
                  </button>
                </div>
              </div>
              <div className="content-stretch cursor-pointer flex items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="I185:1629;247:3348" data-name="Button · DS">
                <Buttons buttonText="Cerrar sesión" className="aspect-[74/40] border border-[#007566] border-solid content-stretch flex items-center justify-center p-[10px] relative rounded-[8px] shrink-0" size="medium" type="secondary"/>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-node-id="7:1317" data-name="Main Content:margin">
          <div className="content-stretch flex flex-col items-start min-h-[524px] pb-[80px] pt-[56px] relative shrink-0 w-[1228px]" data-node-id="7:1244" data-name="Main Content">
            <div className="[word-break:break-word] content-stretch flex flex-col font-['Poppins:Medium'] gap-[8px] items-start not-italic relative shrink-0 w-full" data-node-id="7:1245" data-name="PageHeader">
              <DesignText className="leading-[38px] relative shrink-0 text-[#171717] text-[30px] whitespace-nowrap" data-node-id="7:1248">
                Registrar préstamo
              </DesignText>
              <DesignText className="leading-[24px] min-w-full relative shrink-0 text-[#525252] text-[16px] w-[min-content]" data-node-id="7:1251">
                Valida al usuario y el ejemplar antes de confirmar el movimiento.
              </DesignText>
            </div>
            <StepsMargin className="content-stretch flex flex-col items-start pt-[32px] relative shrink-0 w-full"/>
            <div className="content-stretch flex flex-col items-start pt-[20px] relative shrink-0 w-full" data-node-id="7:1308" data-name="Panel:margin">
              <div className="bg-white border border-[#d4d4d4] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col gap-[20px] items-start p-[24px] relative rounded-[14px] shrink-0 w-full" data-node-id="7:1276" data-name="Panel">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[28px] not-italic relative shrink-0 text-[#171717] text-[20px] whitespace-nowrap" data-node-id="7:1278">
                  1. Buscar alumno o maestro
                </DesignText>
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="7:1302" data-name="Toolbar:margin">
                  <Toolbar className="bg-[#fafafa] border border-[#e5e5e5] border-solid content-stretch flex gap-[12px] items-center p-[16px] relative rounded-[10px] shrink-0 w-full"/>
                </div>
                <DynamicSlot className="bg-[#fafafa] border border-[#e5e5e5] border-solid content-stretch flex flex-col h-[240px] items-center justify-center min-h-[240px] p-[32px] relative rounded-[12px] shrink-0 w-full" data-node-id="144:2196" data-name="search_user">
                  <div className="content-stretch flex flex-col items-start pb-[12px] relative shrink-0" data-node-id="I144:2196;144:2056" data-name="Container:margin">
                    <div className="bg-white border border-[#d4d4d4] border-solid content-stretch flex flex-col items-center justify-center relative rounded-[20px] shrink-0 size-[40px]" data-node-id="I144:2196;144:2057" data-name="Icon Container">
                      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[28px] not-italic relative shrink-0 text-[#171717] text-[20px] whitespace-nowrap" data-node-id="I144:2196;144:2058">
                        —
                      </DesignText>
                    </div>
                  </div>
                  <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[24px] not-italic relative shrink-0 text-[#171717] text-[16px] whitespace-nowrap" data-node-id="I144:2196;144:2059">
                    Busca un usuario para comenzar
                  </DesignText>
                  <div className="content-stretch flex flex-col items-start pt-[8px] relative shrink-0" data-node-id="I144:2196;144:2060" data-name="Paragraph:margin">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#525252] text-[14px] text-center w-[480px]" data-node-id="I144:2196;144:2061">
                      La validación mostrará automáticamente si puede solicitar un préstamo.
                    </DesignText>
                  </div>
                </DynamicSlot>
                <Buttons buttonText="Alumno · 5 días hábiles · máximo 2 renovaciones" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border-[#d4d4d4] border-solid border-t content-stretch flex h-[66.281px] items-center px-[32px] py-[24px] relative shrink-0 w-full" data-node-id="7:1310" data-name="Footer">
          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap" data-node-id="7:1312">
            Universidad Ducky · Sistema de Biblioteca
          </DesignText>
        </div>
      </div>
    </div>);
}
