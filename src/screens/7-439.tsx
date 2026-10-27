import { DesignInput, DesignSelect, DesignText, DynamicSlot } from "../design-controls";
const imgButton = "/assets/e387d.png";
type ButtonsProps = {
    className?: string;
    buttonText?: string;
    icons?: "false";
    size?: "small";
    state?: "Default";
    type?: "secondary";
};
function Buttons({ className, buttonText = "text", icons = "false", size = "small", state = "Default", type = "secondary" }: ButtonsProps) {
    return (<button type="button" className={className || "border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px]"} data-node-id="27:255">
      <p className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#007566] text-[12px] whitespace-nowrap" data-node-id="27:256">
        {buttonText}
      </p>
    </button>);
}
type BadgeProps = {
    className?: string;
    label?: string;
    state?: "Default" | "secondary" | "terciary";
};
function Badge({ className, label = "Estado", state = "Default" }: BadgeProps) {
    const isSecondary = state === "secondary";
    const isTerciary = state === "terciary";
    return (<div className={className || `border content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] ${isSecondary ? "bg-[#e1e1e1] border-[#737373] border-solid" : isTerciary ? "bg-white border-[#4b4b4b] border-dashed" : "bg-white border-[#4b4b4b] border-solid"}`} id={isSecondary ? "node-137_4663" : isTerciary ? "node-141_4665" : "node-137_4657"}>
      {["Default", "terciary"].includes(state) && (<p className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#4b4b4b] text-[12px] whitespace-nowrap" data-node-id="137:4655">
          {label}
        </p>)}
      {isSecondary && (<p className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap" data-node-id="137:4664">
          {label}
        </p>)}
    </div>);
}
export default function CuentaUsuarios() {
    return (<div className="bg-[#fafafa] content-stretch flex flex-col items-start relative size-full" data-node-id="7:439" data-name="cuenta - usuarios">
      <div className="bg-[#fafafa] content-stretch flex flex-col items-start min-w-[320px] relative shrink-0 w-full" data-node-id="7:440" data-name="AppShell">
        <div className="content-stretch flex items-start relative shrink-0" data-node-id="185:1593" data-name="header">
          <div className="bg-white content-stretch flex flex-col h-[76px] items-start px-[330px] py-[17px] relative shrink-0 w-[1280px]" data-node-id="I185:1593;182:1029" data-name="header">
            <div className="absolute backdrop-blur-[12px] bg-[rgba(255,255,255,0)] border-[#d4d4d4] border-b border-solid content-stretch flex gap-[20px] h-[76px] items-center left-0 pl-[48px] pr-[32px] top-0 w-[1280px]" data-node-id="I185:1593;182:1029;62:561" data-name="Header">
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch cursor-pointer flex gap-[12px] h-[75px] items-center min-h-[40px] px-[14.4px] py-[8.8px] relative rounded-[6px] shrink-0 w-[182.914px]" data-node-id="I185:1593;182:1029;62:562" data-name="Button">
                <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none rounded-[6px] size-full" src={imgButton}/>
              </button>
              <div className="content-stretch flex flex-[1_0_0] gap-[12px] h-[50px] items-center justify-center min-w-px px-[24px] relative" data-node-id="I185:1593;182:1029;62:570" data-name="Navigation">
                <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch cursor-pointer flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I185:1593;182:1029;144:1485" data-name="nav">
                  <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I185:1593;182:1029;144:1485;144:1484">
                    Catálogo
                  </DesignText>
                </button>
                <button className="bg-[#00a99b] border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I185:1593;182:1029;144:1506" data-name="nav">
                  <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap" data-node-id="I185:1593;182:1029;144:1506;144:1469">
                    Mi cuenta
                  </DesignText>
                </button>
              </div>
              <div className="content-stretch flex h-[75px] items-center justify-between overflow-clip relative shrink-0 w-[274.041px]" data-node-id="I185:1593;182:1029;62:576" data-name="Container">
                <div className="content-stretch flex gap-[9.6px] items-center relative shrink-0" data-node-id="I185:1593;182:1029;62:584" data-name="Container">
                  <div className="bg-[#262626] grid grid-cols-[_32px] grid-rows-[_32px] relative rounded-[16px] shrink-0 size-[32px]" data-node-id="I185:1593;182:1029;62:585" data-name="Text">
                    <DesignText className="[word-break:break-word] col-1 font-['Poppins:Medium'] justify-self-center leading-[18px] not-italic relative row-1 self-center shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="I185:1593;182:1029;62:586">
                      ML
                    </DesignText>
                  </div>
                  <div className="content-stretch cursor-pointer flex flex-col items-start relative shrink-0" data-node-id="I185:1593;182:1029;62:587" data-name="Container">
                    <button className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="I185:1593;182:1029;62:588" data-name="Bold Text">
                      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] text-left whitespace-nowrap" data-node-id="I185:1593;182:1029;62:589">
                        Mariana López
                      </DesignText>
                    </button>
                    <button className="content-stretch flex flex-col h-[15.844px] items-start max-w-[160px] overflow-clip relative shrink-0" data-node-id="I185:1593;182:1029;62:590" data-name="Small">
                      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] text-left whitespace-nowrap" data-node-id="I185:1593;182:1029;62:591">
                        Alumno
                      </DesignText>
                    </button>
                  </div>
                </div>
                <button className="border border-[#007566] border-solid content-stretch cursor-pointer flex flex-col items-center justify-center min-h-[40px] px-[14.4px] py-[8.8px] relative rounded-[6px] shrink-0" data-node-id="I185:1593;182:1029;62:592" data-name="Button">
                  <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[14px] text-[transparent] text-center whitespace-nowrap" data-node-id="I185:1593;182:1029;62:593">
                    Cerrar sesión
                  </DesignText>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-node-id="7:652" data-name="Main Content:margin">
          <div className="content-stretch flex flex-col items-start min-h-[524px] pb-[80px] pt-[56px] relative shrink-0 w-[1230px]" data-node-id="7:494" data-name="Main Content">
            <div className="content-stretch flex items-end justify-between relative shrink-0 w-full" data-node-id="7:495" data-name="PageHeader">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-[637px]" data-node-id="7:496" data-name="Container">
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="7:497" data-name="Heading">
                  <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[38px] not-italic relative shrink-0 text-[#171717] text-[30px] whitespace-nowrap" data-node-id="7:498">
                    Mariana López
                  </DesignText>
                </div>
                <div className="content-stretch flex flex-col h-[35px] items-start max-w-[720px] pt-[8.8px] relative shrink-0 w-full" data-node-id="7:500" data-name="Paragraph">
                  <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[24px] not-italic relative shrink-0 text-[#525252] text-[16px] w-full" data-node-id="7:501">
                    Consulta tus préstamos, fechas de vencimiento y adeudos.
                  </DesignText>
                </div>
                <div className="[word-break:break-word] content-stretch flex flex-col font-['Poppins:Medium'] gap-[2px] items-start leading-[18px] not-italic overflow-clip relative shrink-0 text-[#737373] text-[12px] w-full" data-node-id="348:1842" data-name="Estatus escolar del alumno">
                  <DesignText className="relative shrink-0 w-full" data-node-id="348:1843">
                    Estatus escolar
                  </DesignText>
                  <DesignText className="relative shrink-0 w-full" data-node-id="348:1844">
                    Inscrito
                  </DesignText>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col items-center pt-[32px] relative shrink-0 w-full" data-node-id="7:642" data-name="Account:margin">
              <div className="border-2 border-[#0c9d61] border-solid content-stretch flex items-center justify-between px-[32px] py-[24px] relative rounded-[14px] shrink-0 w-full" data-node-id="7:504" data-name="Account">
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-[164.18px]" data-node-id="7:505" data-name="Container">
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="7:506" data-name="Text">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap" data-node-id="7:507">
                      Estatus de la cuenta
                    </DesignText>
                  </div>
                  <div className="content-stretch flex flex-col h-[32px] items-start pt-[8px] relative shrink-0 w-[164.18px]" data-node-id="7:509" data-name="Heading">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[28px] not-italic relative shrink-0 text-[#0c9d61] text-[20px] whitespace-nowrap" data-node-id="7:510">
                      Autorizado
                    </DesignText>
                  </div>
                </div>
                <Badge className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" label="Sin restricciones"/>
              </div>
            </div>
            <div className="content-stretch flex flex-col h-[185.2px] items-start pt-[20px] relative shrink-0 w-full" data-node-id="7:643" data-name="Account:margin">
              <div className="-translate-x-1/2 absolute content-stretch flex items-start justify-center left-1/2 top-[20px] w-[1230px]" data-node-id="7:516" data-name="Account">
                <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px pb-[20px] relative self-stretch" data-node-id="7:547" data-name="Panel:margin">
                  <div className="-translate-x-1/2 absolute bg-white border border-[#d4d4d4] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col gap-[5.6px] items-center justify-center left-[calc(50%-8.5px)] p-[24px] rounded-[14px] top-[0.2px] w-[395px]" data-node-id="7:517" data-name="Panel">
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="7:518" data-name="Account">
                      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap" data-node-id="7:519">
                        Préstamos activos
                      </DesignText>
                    </div>
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="7:521" data-name="Account">
                      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[38px] not-italic relative shrink-0 text-[#171717] text-[30px] whitespace-nowrap" data-node-id="7:522">
                        2
                      </DesignText>
                    </div>
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="7:524" data-name="Account">
                      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap" data-node-id="7:525">
                        Límite: 2 ejemplares
                      </DesignText>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px pb-[20px] relative self-stretch" data-node-id="7:548" data-name="Panel:margin">
                  <div className="-translate-x-1/2 absolute bg-white border border-[#d4d4d4] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col gap-[5.6px] items-start left-[calc(50%-0.5px)] p-[24px] rounded-[14px] top-[0.2px] w-[393px]" data-node-id="7:527" data-name="Panel">
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="7:528" data-name="Account">
                      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap" data-node-id="7:529">
                        Próximo vencimiento
                      </DesignText>
                    </div>
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="7:531" data-name="Account">
                      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[38px] not-italic relative shrink-0 text-[#171717] text-[30px] whitespace-nowrap" data-node-id="7:532">
                        18 OCT
                      </DesignText>
                    </div>
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="7:534" data-name="Account">
                      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap" data-node-id="7:535">
                        Faltan 6 días
                      </DesignText>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px pb-[20px] relative self-stretch" data-node-id="7:549" data-name="Panel:margin">
                  <div className="-translate-x-1/2 absolute bg-white border border-[#d4d4d4] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col gap-[5.6px] items-start left-[calc(50%+8px)] p-[24px] rounded-[14px] top-[0.2px] w-[394px]" data-node-id="7:537" data-name="Panel">
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="7:538" data-name="Account">
                      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap" data-node-id="7:539">
                        Multas pendientes
                      </DesignText>
                    </div>
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="7:541" data-name="Account">
                      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[38px] not-italic relative shrink-0 text-[#171717] text-[30px] whitespace-nowrap" data-node-id="7:542">
                        $0.00
                      </DesignText>
                    </div>
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="7:544" data-name="Account">
                      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap" data-node-id="7:545">
                        Sin adeudos
                      </DesignText>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#d4d4d4] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col items-start p-[24px] relative rounded-[14px] shrink-0 w-full" data-node-id="7:550" data-name="Panel">
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-node-id="7:551" data-name="Account">
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-[415.789px]" data-node-id="7:552" data-name="Container">
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="7:553" data-name="Heading">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[28px] not-italic relative shrink-0 text-[#171717] text-[20px] whitespace-nowrap" data-node-id="7:554">
                      Préstamos activos
                    </DesignText>
                  </div>
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="7:556" data-name="Paragraph">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[24px] not-italic relative shrink-0 text-[#525252] text-[16px] w-full" data-node-id="7:557">
                      Renueva tus préstamos antes de la fecha de vencimiento.
                    </DesignText>
                  </div>
                </div>
              </div>
              <DynamicSlot className="content-stretch flex flex-col h-[196px] items-start overflow-clip pt-[20px] relative shrink-0 w-[1182px]" data-node-id="7:559" data-name="Table">
                <div className="grid grid-cols-[repeat(6,minmax(0,1fr))] grid-rows-[repeat(3,minmax(0,1fr))] h-[175.844px] relative shrink-0 w-full" data-node-id="7:560" data-name="Table">
                  <div className="border-[#737373] border-b border-solid content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative self-stretch shrink-0" data-node-id="7:563" data-name="Header Cell">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap" data-node-id="7:564">
                      Libro
                    </DesignText>
                  </div>
                  <div className="border-[#737373] border-b border-solid content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative self-stretch shrink-0" data-node-id="7:566" data-name="Header Cell">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap" data-node-id="7:567">
                      Fecha de préstamo
                    </DesignText>
                  </div>
                  <div className="border-[#737373] border-b border-solid content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative self-stretch shrink-0" data-node-id="7:569" data-name="Header Cell">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap" data-node-id="7:570">
                      Vencimiento
                    </DesignText>
                  </div>
                  <div className="border-[#737373] border-b border-solid content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative self-stretch shrink-0" data-node-id="7:572" data-name="Header Cell">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap" data-node-id="7:573">
                      Renovaciones
                    </DesignText>
                  </div>
                  <div className="border-[#737373] border-b border-solid content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative self-stretch shrink-0" data-node-id="7:575" data-name="Header Cell">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap" data-node-id="7:576">
                      Estado
                    </DesignText>
                  </div>
                  <div className="border-[#737373] border-b border-solid content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative self-stretch shrink-0" data-node-id="7:578" data-name="Header Cell">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap" data-node-id="7:579">
                      Acción
                    </DesignText>
                  </div>
                  <div className="border-[#e5e5e5] border-b border-solid content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative self-stretch shrink-0" data-node-id="7:583" data-name="Table Cell">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] whitespace-nowrap" data-node-id="7:584">
                      Introducción a los algoritmos
                    </DesignText>
                  </div>
                  <div className="border-[#e5e5e5] border-b border-solid content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative self-stretch shrink-0" data-node-id="7:586" data-name="Table Cell">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] whitespace-nowrap" data-node-id="7:587">
                      04 oct 2025
                    </DesignText>
                  </div>
                  <div className="border-[#e5e5e5] border-b border-solid content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative self-stretch shrink-0" data-node-id="7:589" data-name="Table Cell">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] whitespace-nowrap" data-node-id="7:590">
                      18 oct 2025
                    </DesignText>
                  </div>
                  <div className="border-[#e5e5e5] border-b border-solid content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative self-stretch shrink-0" data-node-id="7:592" data-name="Table Cell">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] whitespace-nowrap" data-node-id="7:593">
                      1 de 2
                    </DesignText>
                  </div>
                  <div className="border-[#e5e5e5] border-b border-solid content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative self-stretch shrink-0" data-node-id="7:595" data-name="Table Cell">
                    <div className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0 w-[83.6px]" data-node-id="7:596" data-name="Badge · DS">
                      <Badge className="bg-white border border-[#4b4b4b] border-dashed content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" label="Por vencer" state="terciary"/>
                    </div>
                  </div>
                  <div className="border-[#e5e5e5] border-b border-solid content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative self-stretch shrink-0" data-node-id="7:599" data-name="Table Cell">
                    <Buttons buttonText="Solicitar renovación" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"/>
                  </div>
                  <div className="border-[#e5e5e5] border-b border-solid content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative self-stretch shrink-0" data-node-id="7:604" data-name="Table Cell">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] whitespace-nowrap" data-node-id="7:605">
                      Pedro Páramo
                    </DesignText>
                  </div>
                  <div className="border-[#e5e5e5] border-b border-solid content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative self-stretch shrink-0" data-node-id="7:607" data-name="Table Cell">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] whitespace-nowrap" data-node-id="7:608">
                      07 oct 2025
                    </DesignText>
                  </div>
                  <div className="border-[#e5e5e5] border-b border-solid content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative self-stretch shrink-0" data-node-id="7:610" data-name="Table Cell">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] whitespace-nowrap" data-node-id="7:611">
                      21 oct 2025
                    </DesignText>
                  </div>
                  <div className="border-[#e5e5e5] border-b border-solid content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative self-stretch shrink-0" data-node-id="7:613" data-name="Table Cell">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] whitespace-nowrap" data-node-id="7:614">
                      0 de 2
                    </DesignText>
                  </div>
                  <div className="border-[#e5e5e5] border-b border-solid content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative self-stretch shrink-0" data-node-id="7:616" data-name="Table Cell">
                    <div className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0 w-[80.6px]" data-node-id="7:617" data-name="Badge · DS">
                      <Badge className="bg-[#e1e1e1] border border-[#737373] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" label="En tiempo" state="secondary"/>
                    </div>
                  </div>
                  <div className="border-[#e5e5e5] border-b border-solid content-stretch flex flex-col items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative self-stretch shrink-0" data-node-id="7:620" data-name="Table Cell">
                    <Buttons buttonText="Solicitar renovación" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"/>
                  </div>
                </div>
              </DynamicSlot>
            </div>
            <div className="content-stretch flex flex-col items-start py-[20px] relative shrink-0 w-full" data-node-id="7:644" data-name="Panel:margin">
              <div className="bg-white border border-[#d4d4d4] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col items-start p-[24px] relative rounded-[14px] shrink-0 w-full" data-node-id="7:625" data-name="Panel">
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="7:626" data-name="Heading">
                  <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[28px] not-italic relative shrink-0 text-[#171717] text-[20px] whitespace-nowrap" data-node-id="7:627">
                    Multas y movimientos
                  </DesignText>
                </div>
                <div className="content-stretch flex flex-col h-[260px] items-center justify-center min-h-[240px] pb-[32px] pt-[52px] px-[32px] relative shrink-0 w-[1180px]" data-node-id="7:629" data-name="StateMessage">
                  <div className="content-stretch flex flex-col items-start pb-[12.8px] relative shrink-0" data-node-id="7:639" data-name="Container:margin">
                    <div className="border border-[#737373] border-solid grid grid-cols-[_38px] grid-rows-[_38px] relative rounded-[20px] shrink-0 size-[40px]" data-node-id="7:630" data-name="Container">
                      <DesignText className="[word-break:break-word] col-1 font-['Poppins:Medium'] justify-self-center leading-[24px] not-italic relative row-1 self-center shrink-0 text-[#171717] text-[16px] text-center whitespace-nowrap" data-node-id="7:631">
                        —
                      </DesignText>
                    </div>
                  </div>
                  <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[24px] not-italic relative shrink-0 text-[#171717] text-[16px] text-center whitespace-nowrap" data-node-id="7:634">
                    No tienes multas pendientes
                  </DesignText>
                  <div className="content-stretch flex flex-col items-start pb-[16px] pt-[7.2px] relative shrink-0" data-node-id="7:640" data-name="Paragraph:margin">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[24px] not-italic relative shrink-0 text-[#525252] text-[16px] text-center whitespace-nowrap" data-node-id="7:637">
                      Tus pagos y movimientos aparecerán en esta sección.
                    </DesignText>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white border-[#d4d4d4] border-solid border-t content-stretch flex h-[66.281px] items-start justify-between px-[32px] py-[24px] relative shrink-0 w-full" data-node-id="7:645" data-name="Footer">
            <div className="content-stretch flex flex-col h-full items-start relative shrink-0" data-node-id="7:646" data-name="Text">
              <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap" data-node-id="7:647">
                Universidad Ducky · Sistema de Biblioteca
              </DesignText>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
