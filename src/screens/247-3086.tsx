import { DesignInput, DesignSelect, DesignText, DynamicSlot } from "../design-controls";
const imgIdentidadBiblioteca = "/assets/e387d.png";
const imgSearch = "/assets/5ef97.svg";
const imgLucideChevronDown = "/assets/b1c28.svg";
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
type BadgeProps = {
    className?: string;
    label?: string;
    state?: "Default";
};
function Badge({ className, label = "Estado", state = "Default" }: BadgeProps) {
    return (<div className={className || "bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px]"} data-node-id="137:4657">
      <p className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#4b4b4b] text-[12px] whitespace-nowrap" data-node-id="137:4655">
        {label}
      </p>
    </div>);
}
export default function GestionDeLibrosBibliotecario() {
    return (<div className="bg-[#fafafa] content-stretch flex flex-col items-start relative size-full" data-node-id="247:3086" data-name="gestión de libros - bibliotecario">
      <div className="bg-[#fafafa] content-stretch flex flex-col items-start min-h-[422px] min-w-[320px] relative shrink-0 w-full" data-node-id="247:3087" data-name="AppShell">
        <div className="bg-white content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="247:3404" data-name="header">
          <div className="backdrop-blur-[12px] bg-[rgba(255,255,255,0)] border-[#d4d4d4] border-b border-solid content-stretch flex gap-[12px] h-[76px] items-center px-[24px] relative shrink-0 w-full" data-node-id="I247:3404;247:3311" data-name="Header · Bibliotecario">
            <div className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex gap-[12px] h-[75px] items-center min-h-[40px] px-[14.4px] py-[8.8px] relative rounded-[6px] shrink-0 w-[183px]" data-node-id="I247:3404;247:3312" data-name="Identidad · Biblioteca">
              <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none rounded-[6px] size-full" src={imgIdentidadBiblioteca}/>
            </div>
            <div className="content-stretch cursor-pointer flex flex-[1_0_0] gap-[4px] h-[50px] items-center justify-center min-w-px px-[24px] relative" data-node-id="I247:3404;247:3320" data-name="Navigation">
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I247:3404;247:3321" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I247:3404;247:3321;144:1484">
                  Préstamos
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I247:3404;272:2415" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I247:3404;272:2415;144:1484">
                  Catálogo
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I247:3404;247:3322" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I247:3404;247:3322;144:1484">
                  Devolución
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I247:3404;247:3323" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I247:3404;247:3323;144:1484">
                  Renovación
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I247:3404;247:3324" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I247:3404;247:3324;144:1484">
                  Multas y pagos
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I247:3404;247:3325" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I247:3404;247:3325;144:1484">
                  Suspendidos
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I247:3404;247:3360" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I247:3404;247:3360;144:1484">
                  Gestión de libros
                </DesignText>
              </button>
            </div>
            <div className="content-stretch flex h-[75px] items-center justify-end overflow-clip relative shrink-0 w-[250px]" data-node-id="I247:3404;247:3332" data-name="Container">
              <div className="content-stretch flex gap-[9.6px] items-center relative shrink-0" data-node-id="I247:3404;247:3340" data-name="Container">
                <div className="bg-[#262626] grid grid-cols-[_32px] grid-rows-[_32px] relative rounded-[16px] shrink-0 size-[32px]" data-node-id="I247:3404;247:3341" data-name="Text">
                  <DesignText className="[word-break:break-word] col-1 font-['Poppins:Medium'] justify-self-center leading-[18px] not-italic relative row-1 self-center shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="I247:3404;247:3342">
                    ML
                  </DesignText>
                </div>
                <div className="content-stretch cursor-pointer flex flex-col items-start relative shrink-0 w-[89.641px]" data-node-id="I247:3404;247:3343" data-name="Container">
                  <button className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="I247:3404;247:3344" data-name="Bold Text">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] text-left whitespace-nowrap" data-node-id="I247:3404;247:3345">
                      Mariana López
                    </DesignText>
                  </button>
                  <button className="content-stretch flex flex-col h-[18px] items-start max-w-[160px] overflow-clip relative shrink-0 w-full" data-node-id="I247:3404;247:3346" data-name="Small">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] text-left whitespace-nowrap" data-node-id="I247:3404;247:3347">
                      Alumno
                    </DesignText>
                  </button>
                </div>
              </div>
              <div className="content-stretch cursor-pointer flex items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="I247:3404;247:3348" data-name="Button · DS">
                <Buttons buttonText="Cerrar sesión" className="aspect-[74/40] border border-[#007566] border-solid content-stretch flex items-center justify-center p-[10px] relative rounded-[8px] shrink-0" size="medium" type="secondary"/>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-center px-[27px] relative shrink-0 w-full" data-node-id="247:3089" data-name="Main Content:margin">
          <div className="content-stretch flex flex-col items-start min-h-[278px] pb-[80px] pt-[56px] relative shrink-0 w-full" data-node-id="247:3090" data-name="Main Content">
            <div className="content-stretch flex h-[90px] items-end justify-between relative shrink-0 w-full" data-node-id="247:3091" data-name="PageHeader">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-[388.625px]" data-node-id="247:3092" data-name="Container">
                <div className="content-stretch flex flex-col items-start min-h-[36px] relative shrink-0 w-full" data-node-id="247:3093" data-name="Heading">
                  <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[32px] not-italic relative shrink-0 text-[#1f1f1f] text-[24px] whitespace-nowrap" data-node-id="247:3094">
                    Gestión de libros
                  </DesignText>
                </div>
                <div className="content-stretch flex flex-col h-[34.8px] items-start max-w-[720px] pt-[8.8px] relative shrink-0 w-[388.625px]" data-node-id="247:3095" data-name="Paragraph">
                  <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[24px] not-italic relative shrink-0 text-[#4b4b4b] text-[16px] whitespace-nowrap" data-node-id="247:3096">
                    Agrega y edita libros, clasifica ejemplares y registra bajas conservando el historial.
                  </DesignText>
                </div>
              </div>
              <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="2190:3990">
                <div className="col-1 content-stretch flex h-[40px] items-center justify-center min-h-[40px] ml-0 mt-0 relative rounded-[6px] row-1 w-[65.077px]" data-node-id="247:3097" data-name="Button · DS">
                  <Buttons buttonText="+ Agregar libro" className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"/>
                </div>
                <Buttons buttonText="Recibidos de compras" className="border border-[#007566] border-solid col-1 content-stretch cursor-pointer flex h-[40px] items-center justify-center ml-[126px] mt-0 px-[10px] py-[5px] relative rounded-[8px] row-1" type="secondary"/>
              </div>
            </div>
            <div className="content-stretch flex flex-col items-start pb-[20px] pt-[32px] relative shrink-0 w-full" data-node-id="247:3099" data-name="Panel:margin">
              <div className="bg-white border-[#e1e1e1] border-[0.667px] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col items-start p-[24px] relative rounded-[12px] shrink-0 w-full" data-node-id="247:3100" data-name="Panel">
                <div className="bg-[#fafafa] border-[#eee] border-[0.667px] border-solid gap-x-[12px] gap-y-[12px] grid grid-cols-[___minmax(0,1fr)_237.94px_70.84px] grid-rows-[_64.62px] p-[16px] relative rounded-[8px] shrink-0 w-[1178px]" data-node-id="247:3101" data-name="Toolbar">
                  <div className="col-1 content-stretch flex flex-col gap-[6.4px] items-start justify-self-stretch relative row-1 self-end shrink-0" data-node-id="247:3102" data-name="Field">
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="247:3103" data-name="Text">
                      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap" data-node-id="247:3104">
                        Buscar en el catálogo
                      </DesignText>
                    </div>
                    <div className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] overflow-clip relative rounded-[6px] shrink-0 w-full" data-node-id="247:3105" data-name="Input · DS">
                      <DesignInput className="block cursor-pointer flex-[1_0_0] h-[40px] min-w-px relative rounded-[4px]" data-node-id="247:3106" data-name="Left icon" label="Buscar en el catálogo" initialValue="">
                        <div className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]" data-node-id="I247:3106;65:3042" data-name="Base"/>
                        <div className="-translate-y-1/2 absolute left-[12px] size-[18px] top-1/2" data-node-id="I247:3106;65:3043" data-name="Search">
                          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSearch}/>
                        </div>
                        <DesignText className="[word-break:break-word] absolute font-['Poppins:Regular'] leading-[24px] left-[38px] not-italic right-[12px] text-[#cacaca] text-[16px] text-left top-[calc(50%-12px)] whitespace-nowrap" data-node-id="I247:3106;65:3044">
                          ​
                        </DesignText>
                      </DesignInput>
                    </div>
                  </div>
                  <div className="col-2 content-stretch flex flex-col gap-[6.4px] items-start justify-self-stretch relative row-1 self-end shrink-0" data-node-id="247:3107" data-name="Field">
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="247:3108" data-name="Text">
                      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap" data-node-id="247:3109">
                        Tipo de uso
                      </DesignText>
                    </div>
                    <div className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] overflow-clip relative rounded-[6px] shrink-0 w-[237.938px]" data-node-id="247:3110" data-name="Select · DS">
                      <DesignSelect className="border border-[#cacaca] border-solid content-stretch cursor-pointer flex flex-col gap-[2px] h-[32px] items-start overflow-clip relative rounded-[10px] shrink-0 w-[237.938px]" data-node-id="247:3111" data-name="dropdown" label="Tipo de uso" initialValue="Todos">
                        <div className="content-stretch flex gap-[10px] h-[32px] items-center justify-center overflow-clip p-[10px] relative rounded-[10px] shrink-0 w-full" data-node-id="I247:3111;7:1352" data-name="dropdown-input">
                          <DesignText className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[#4b4b4b] text-[12px] text-left" data-node-id="I247:3111;7:1353">
                            Todos
                          </DesignText>
                          <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[15px]" data-node-id="I247:3111;7:1354" data-name="Container">
                            <div className="relative shrink-0 size-[12px]" data-node-id="I247:3111;7:1354;7:710" data-name="lucide/chevron-down">
                              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLucideChevronDown}/>
                            </div>
                          </div>
                        </div>
                      </DesignSelect>
                    </div>
                  </div>
                  <div className="col-3 content-stretch flex h-[40px] items-center justify-center justify-self-stretch min-h-[40px] relative rounded-[6px] row-1 self-end shrink-0" data-node-id="247:3112" data-name="Button · DS">
                    <Buttons buttonText="Buscar" className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"/>
                  </div>
                </div>
                <div className="content-stretch flex flex-col items-start pt-[24px] relative shrink-0 w-full" data-node-id="247:3114" data-name="Table:margin">
                  <DynamicSlot className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="247:3115" data-name="Table">
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="247:3116" data-name="Table">
                      <div className="content-stretch flex h-[39px] items-start overflow-clip relative shrink-0 w-full" data-node-id="428:6079" data-name="Frame">
                        <div className="border-[#8e8e8e] border-b-[0.667px] border-solid content-stretch flex flex-col h-[39px] items-start justify-center px-[12px] py-[11.2px] relative shrink-0 w-[129.368px]" data-node-id="247:3117" data-name="Header Cell">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="247:3118">
                            Clave
                          </DesignText>
                        </div>
                        <div className="border-[#8e8e8e] border-b-[0.667px] border-solid content-stretch flex flex-col h-[39px] items-start justify-center px-[12px] py-[11.2px] relative shrink-0 w-[341.097px]" data-node-id="247:3119" data-name="Header Cell">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="247:3120">
                            Título y autor
                          </DesignText>
                        </div>
                        <div className="border-[#8e8e8e] border-b-[0.667px] border-solid content-stretch flex flex-col h-[39px] items-start justify-center px-[12px] py-[11.2px] relative shrink-0 w-[107.398px]" data-node-id="247:3121" data-name="Header Cell">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="247:3122">
                            Ejemplares
                          </DesignText>
                        </div>
                        <div className="border-[#8e8e8e] border-b-[0.667px] border-solid content-stretch flex flex-col h-[39px] items-start justify-center px-[12px] py-[11.2px] relative shrink-0 w-[157.284px]" data-node-id="247:3123" data-name="Header Cell">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="247:3124">
                            Tipo de uso
                          </DesignText>
                        </div>
                        <div className="border-[#8e8e8e] border-b-[0.667px] border-solid content-stretch flex flex-col h-[39px] items-start justify-center px-[12px] py-[11.2px] relative shrink-0 w-[77.683px]" data-node-id="247:3125" data-name="Header Cell">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="247:3126">
                            Estado
                          </DesignText>
                        </div>
                        <div className="border-[#8e8e8e] border-b-[0.667px] border-solid content-stretch flex flex-col h-[39px] items-start justify-center px-[12px] py-[11.2px] relative shrink-0 w-[363.837px]" data-node-id="247:3127" data-name="Header Cell">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="247:3128">
                            Acciones
                          </DesignText>
                        </div>
                      </div>
                      <div className="content-stretch flex h-[74px] items-start overflow-clip relative shrink-0 w-full" data-node-id="428:6080" data-name="Libro · 0">
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[129.368px]" data-node-id="428:6081" data-name="Table Cell">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="428:6082">
                            LIT-863.64-GAR
                          </DesignText>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[341.097px]" data-node-id="428:6083" data-name="Table Cell">
                          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="428:6084" data-name="CatalogManagement">
                            <div className="h-[18.717px] relative shrink-0 w-full" data-node-id="428:6085" data-name="Container">
                              <DesignText className="[word-break:break-word] absolute font-['Poppins:Medium'] leading-[18px] left-0 not-italic text-[#1f1f1f] text-[12px] top-[-1.33px] whitespace-nowrap" data-node-id="428:6086">
                                Cien años de soledad
                              </DesignText>
                            </div>
                            <div className="content-stretch flex flex-col items-start pt-[3.2px] relative shrink-0 w-full" data-node-id="428:6087" data-name="Small:margin">
                              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="428:6088" data-name="Small">
                                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="428:6089">
                                  Gabriel García Márquez
                                </DesignText>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[107.398px]" data-node-id="428:6090" data-name="Table Cell">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="428:6091">
                            4
                          </DesignText>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[157.284px]" data-node-id="428:6092" data-name="Table Cell">
                          <div className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0" data-node-id="428:6093" data-name="Badge · DS">
                            <Badge className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" label="Préstamo externo"/>
                          </div>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[77.683px]" data-node-id="428:6095" data-name="Table Cell">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="428:6096">
                            Activo
                          </DesignText>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[363.837px]" data-node-id="428:6097" data-name="Table Cell">
                          <div className="content-stretch flex gap-[1.6px] h-[40px] items-start relative shrink-0 w-full" data-node-id="428:6098" data-name="CatalogManagement">
                            <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="428:6099" data-name="Button · DS">
                              <Buttons buttonText="Editar" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                            </div>
                            <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="428:6101" data-name="Button · DS">
                              <Buttons buttonText="Ejemplares" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                            </div>
                            <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="428:6103" data-name="Button · DS">
                              <Buttons buttonText="Historial" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="content-stretch flex h-[74px] items-start overflow-clip relative shrink-0 w-full" data-node-id="428:6111" data-name="Libro · 1">
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[129.368px]" data-node-id="428:6112" data-name="Table Cell">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="428:6113">
                            COM-005.1-COR
                          </DesignText>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[341.097px]" data-node-id="428:6114" data-name="Table Cell">
                          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="428:6115" data-name="CatalogManagement">
                            <div className="h-[18.717px] relative shrink-0 w-full" data-node-id="428:6116" data-name="Container">
                              <DesignText className="[word-break:break-word] absolute font-['Poppins:Medium'] leading-[18px] left-0 not-italic text-[#1f1f1f] text-[12px] top-[-1.33px] whitespace-nowrap" data-node-id="428:6117">
                                Introducción a los algoritmos
                              </DesignText>
                            </div>
                            <div className="content-stretch flex flex-col items-start pt-[3.2px] relative shrink-0 w-full" data-node-id="428:6118" data-name="Small:margin">
                              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="428:6119" data-name="Small">
                                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="428:6120">
                                  Thomas H. Cormen
                                </DesignText>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[107.398px]" data-node-id="428:6121" data-name="Table Cell">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="428:6122">
                            —
                          </DesignText>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[157.284px]" data-node-id="428:6123" data-name="Table Cell">
                          <div className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0" data-node-id="428:6124" data-name="Badge · DS">
                            <Badge className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" label="Préstamo externo"/>
                          </div>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[77.683px]" data-node-id="428:6126" data-name="Table Cell">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="428:6127">
                            Activo
                          </DesignText>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[363.837px]" data-node-id="428:6128" data-name="Table Cell">
                          <div className="content-stretch flex gap-[1.6px] h-[40px] items-start relative shrink-0 w-full" data-node-id="428:6129" data-name="CatalogManagement">
                            <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="428:6130" data-name="Button · DS">
                              <Buttons buttonText="Editar" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                            </div>
                            <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="428:6132" data-name="Button · DS">
                              <Buttons buttonText="Ejemplares" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                            </div>
                            <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="428:6134" data-name="Button · DS">
                              <Buttons buttonText="Historial" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="content-stretch flex h-[74px] items-start overflow-clip relative shrink-0 w-full" data-node-id="428:6142" data-name="Libro · 2">
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[129.368px]" data-node-id="428:6143" data-name="Table Cell">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="428:6144">
                            HIS-972-ESC
                          </DesignText>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[341.097px]" data-node-id="428:6145" data-name="Table Cell">
                          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="428:6146" data-name="CatalogManagement">
                            <div className="h-[18.717px] relative shrink-0 w-full" data-node-id="428:6147" data-name="Container">
                              <DesignText className="[word-break:break-word] absolute font-['Poppins:Medium'] leading-[18px] left-0 not-italic text-[#1f1f1f] text-[12px] top-[-1.33px] whitespace-nowrap" data-node-id="428:6148">
                                Historia mínima de México
                              </DesignText>
                            </div>
                            <div className="content-stretch flex flex-col items-start pt-[3.2px] relative shrink-0 w-full" data-node-id="428:6149" data-name="Small:margin">
                              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="428:6150" data-name="Small">
                                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="428:6151">
                                  Pablo Escalante
                                </DesignText>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[107.398px]" data-node-id="428:6152" data-name="Table Cell">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="428:6153">
                            2
                          </DesignText>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[157.284px]" data-node-id="428:6154" data-name="Table Cell">
                          <div className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0" data-node-id="428:6155" data-name="Badge · DS">
                            <Badge className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" label="Consulta interna"/>
                          </div>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[77.683px]" data-node-id="428:6157" data-name="Table Cell">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="428:6158">
                            Activo
                          </DesignText>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[363.837px]" data-node-id="428:6159" data-name="Table Cell">
                          <div className="content-stretch flex gap-[1.6px] h-[40px] items-start relative shrink-0 w-full" data-node-id="428:6160" data-name="CatalogManagement">
                            <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="428:6161" data-name="Button · DS">
                              <Buttons buttonText="Editar" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                            </div>
                            <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="428:6163" data-name="Button · DS">
                              <Buttons buttonText="Ejemplares" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                            </div>
                            <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="428:6165" data-name="Button · DS">
                              <Buttons buttonText="Historial" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="content-stretch flex h-[74px] items-start overflow-clip relative shrink-0 w-full" data-node-id="428:6173" data-name="Libro · 3">
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[129.368px]" data-node-id="428:6174" data-name="Table Cell">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="428:6175">
                            MAT-515-STE
                          </DesignText>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[341.097px]" data-node-id="428:6176" data-name="Table Cell">
                          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="428:6177" data-name="CatalogManagement">
                            <div className="h-[18.717px] relative shrink-0 w-full" data-node-id="428:6178" data-name="Container">
                              <DesignText className="[word-break:break-word] absolute font-['Poppins:Medium'] leading-[18px] left-0 not-italic text-[#1f1f1f] text-[12px] top-[-1.33px] whitespace-nowrap" data-node-id="428:6179">
                                Cálculo de una variable
                              </DesignText>
                            </div>
                            <div className="content-stretch flex flex-col items-start pt-[3.2px] relative shrink-0 w-full" data-node-id="428:6180" data-name="Small:margin">
                              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="428:6181" data-name="Small">
                                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="428:6182">
                                  James Stewart
                                </DesignText>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[107.398px]" data-node-id="428:6183" data-name="Table Cell">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="428:6184">
                            6
                          </DesignText>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[157.284px]" data-node-id="428:6185" data-name="Table Cell">
                          <div className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0" data-node-id="428:6186" data-name="Badge · DS">
                            <Badge className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" label="Reservado"/>
                          </div>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[77.683px]" data-node-id="428:6188" data-name="Table Cell">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="428:6189">
                            Activo
                          </DesignText>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[363.837px]" data-node-id="428:6190" data-name="Table Cell">
                          <div className="content-stretch flex gap-[1.6px] h-[40px] items-start relative shrink-0 w-full" data-node-id="428:6191" data-name="CatalogManagement">
                            <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="428:6192" data-name="Button · DS">
                              <Buttons buttonText="Editar" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                            </div>
                            <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="428:6194" data-name="Button · DS">
                              <Buttons buttonText="Ejemplares" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                            </div>
                            <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="428:6196" data-name="Button · DS">
                              <Buttons buttonText="Historial" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="content-stretch flex h-[74px] items-start overflow-clip relative shrink-0 w-full" data-node-id="428:6204" data-name="Libro · 4">
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[129.368px]" data-node-id="428:6205" data-name="Table Cell">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="428:6206">
                            LIT-863-RUL
                          </DesignText>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[341.097px]" data-node-id="428:6207" data-name="Table Cell">
                          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="428:6208" data-name="CatalogManagement">
                            <div className="h-[18.717px] relative shrink-0 w-full" data-node-id="428:6209" data-name="Container">
                              <DesignText className="[word-break:break-word] absolute font-['Poppins:Medium'] leading-[18px] left-0 not-italic text-[#1f1f1f] text-[12px] top-[-1.33px] whitespace-nowrap" data-node-id="428:6210">
                                Pedro Páramo
                              </DesignText>
                            </div>
                            <div className="content-stretch flex flex-col items-start pt-[3.2px] relative shrink-0 w-full" data-node-id="428:6211" data-name="Small:margin">
                              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="428:6212" data-name="Small">
                                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="428:6213">
                                  Juan Rulfo
                                </DesignText>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[107.398px]" data-node-id="428:6214" data-name="Table Cell">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="428:6215">
                            —
                          </DesignText>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[157.284px]" data-node-id="428:6216" data-name="Table Cell">
                          <div className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0" data-node-id="428:6217" data-name="Badge · DS">
                            <Badge className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" label="Préstamo externo"/>
                          </div>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[77.683px]" data-node-id="428:6219" data-name="Table Cell">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="428:6220">
                            Activo
                          </DesignText>
                        </div>
                        <div className="border-[#e1e1e1] border-b-[0.667px] border-solid content-stretch flex flex-col h-[74px] items-start justify-center px-[12px] py-[13.6px] relative shrink-0 w-[363.837px]" data-node-id="428:6221" data-name="Table Cell">
                          <div className="content-stretch flex gap-[1.6px] h-[40px] items-start relative shrink-0 w-full" data-node-id="428:6222" data-name="CatalogManagement">
                            <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="428:6223" data-name="Button · DS">
                              <Buttons buttonText="Editar" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                            </div>
                            <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="428:6225" data-name="Button · DS">
                              <Buttons buttonText="Ejemplares" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                            </div>
                            <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="428:6227" data-name="Button · DS">
                              <Buttons buttonText="Historial" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="content-stretch cursor-pointer flex gap-[12px] items-start overflow-clip relative shrink-0" data-node-id="428:6700" data-name="Paginación de gestión">
                      <Buttons buttonText="Anterior" className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                      <Buttons buttonText="Siguiente" className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                    </div>
                  </DynamicSlot>
                </div>
                <div className="content-stretch flex items-center justify-between pt-[20px] relative shrink-0 w-full" data-node-id="247:3225" data-name="Pagination">
                  <div className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="247:3226" data-name="Text">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap" data-node-id="247:3227">
                      Página 1 · 10 libros
                    </DesignText>
                  </div>
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="247:3228" data-name="Container">
                    <div className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[83.133px]" data-node-id="247:3229" data-name="Button · DS"/>
                    <div className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[91.133px]" data-node-id="247:3231" data-name="Button · DS"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border-[#cacaca] border-solid border-t-[0.667px] content-stretch flex h-[65.948px] items-start justify-between px-[32px] py-[24px] relative shrink-0 w-full" data-node-id="247:3233" data-name="Footer">
          <div className="content-stretch flex flex-col h-full items-start relative shrink-0" data-node-id="247:3234" data-name="Text">
            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap" data-node-id="247:3235">
              Universidad Ducky · Sistema de Biblioteca
            </DesignText>
          </div>
          <div className="h-full relative shrink-0 w-[157px]" data-node-id="247:3236" data-name="Button · DS"/>
        </div>
      </div>
    </div>);
}
