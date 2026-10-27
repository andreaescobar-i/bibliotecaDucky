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
export default function GestionDeUsuariosAdministrador() {
    return (<div className="bg-[#fafafa] content-stretch flex flex-col items-start relative size-full" data-node-id="241:3397" data-name="gestión de usuarios - administrador">
      <div className="bg-[#fafafa] content-stretch flex flex-col items-start min-h-[422px] min-w-[320px] relative shrink-0 w-full" data-node-id="241:3398" data-name="AppShell">
        <div className="bg-white content-stretch flex flex-col h-[76px] items-start relative shrink-0 w-full" data-node-id="241:3622" data-name="header">
          <div className="absolute backdrop-blur-[12px] bg-[rgba(255,255,255,0)] border-[#d4d4d4] border-b border-solid content-stretch flex gap-[20px] h-[76px] items-center left-0 pl-[48px] pr-[32px] top-0 w-[1280px]" data-node-id="I241:3622;62:561" data-name="Header">
            <div className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex gap-[12px] h-[75px] items-center min-h-[40px] px-[14.4px] py-[8.8px] relative rounded-[6px] shrink-0 w-[182.914px]" data-node-id="I241:3622;62:562" data-name="Identidad · Biblioteca">
              <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none rounded-[6px] size-full" src={imgIdentidadBiblioteca}/>
            </div>
            <div className="content-stretch flex gap-[8px] h-[50px] items-center justify-center px-[24px] relative shrink-0 w-[645px]" data-node-id="I241:3622;62:570" data-name="Navigation">
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch cursor-pointer flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I241:3622;207:651" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I241:3622;207:651;144:1484">
                  Reportes
                </DesignText>
              </button>
              <button className="bg-[#00a99b] border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I241:3622;207:652" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap" data-node-id="I241:3622;207:652;144:1469">
                  Usuarios
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch cursor-pointer flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I241:3622;207:653" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] font-medium leading-[18px] relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I241:3622;207:653;144:1484" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
                  Libros ▾
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch cursor-pointer flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I241:3622;207:654" data-name="Operaciones">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] font-medium leading-[18px] relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I241:3622;207:654;144:1484" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
                  Administración ▾
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch cursor-pointer flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I241:3622;207:655" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I241:3622;207:655;144:1484">
                  Operaciones ▾
                </DesignText>
              </button>
            </div>
            <div className="content-stretch flex h-[75px] items-center justify-between overflow-clip relative shrink-0 w-[332px]" data-node-id="I241:3622;62:576" data-name="Container">
              <div className="content-stretch flex gap-[9.6px] items-center relative shrink-0" data-node-id="I241:3622;62:584" data-name="Container">
                <div className="bg-[#262626] grid grid-cols-[_32px] grid-rows-[_32px] relative rounded-[16px] shrink-0 size-[32px]" data-node-id="I241:3622;62:585" data-name="Text">
                  <DesignText className="[word-break:break-word] col-1 font-['Poppins:Regular'] justify-self-center leading-[18px] not-italic relative row-1 self-center shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="I241:3622;62:586">
                    AC
                  </DesignText>
                </div>
                <div className="content-stretch cursor-pointer flex flex-col items-start relative shrink-0 w-[89.641px]" data-node-id="I241:3622;62:587" data-name="Container">
                  <button className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="I241:3622;62:588" data-name="Bold Text">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] text-left whitespace-nowrap" data-node-id="I241:3622;62:589">
                      Alfonso Chapa
                    </DesignText>
                  </button>
                  <button className="content-stretch flex flex-col h-[18px] items-start max-w-[160px] overflow-clip relative shrink-0" data-node-id="I241:3622;62:590" data-name="Small">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] text-left whitespace-nowrap" data-node-id="I241:3622;62:591">
                      Admin
                    </DesignText>
                  </button>
                </div>
              </div>
              <div className="content-stretch cursor-pointer flex items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="I241:3622;62:592" data-name="Button · DS">
                <Buttons buttonText="Cerrar sesión" className="aspect-[74/40] border border-[#007566] border-solid content-stretch flex items-center justify-center p-[10px] relative rounded-[8px] shrink-0" size="medium" type="secondary"/>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-center px-[27px] relative shrink-0 w-full" data-node-id="241:3400" data-name="Main Content:margin">
          <div className="content-stretch flex flex-col items-start min-h-[278px] pb-[80px] pt-[56px] relative shrink-0 w-full" data-node-id="241:3401" data-name="Main Content">
            <div className="content-stretch flex h-[90px] items-end justify-between relative shrink-0 w-full" data-node-id="241:3402" data-name="PageHeader">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-[388.625px]" data-node-id="241:3403" data-name="Container">
                <div className="content-stretch flex flex-col items-start min-h-[36px] relative shrink-0 w-full" data-node-id="241:3404" data-name="Heading">
                  <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[32px] not-italic relative shrink-0 text-[#1f1f1f] text-[24px] whitespace-nowrap" data-node-id="241:3405">
                    Gestión de usuarios
                  </DesignText>
                </div>
                <div className="content-stretch flex flex-col h-[34.8px] items-start max-w-[720px] pt-[8.8px] relative shrink-0 w-[388.625px]" data-node-id="241:3406" data-name="Paragraph">
                  <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[24px] not-italic relative shrink-0 text-[#4b4b4b] text-[16px] whitespace-nowrap" data-node-id="241:3407">
                    Administra usuarios, actualiza sus datos y asigna permisos por rol.
                  </DesignText>
                </div>
              </div>
              <div className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[216px]" data-node-id="241:3408" data-name="Button · DS">
                <Buttons buttonText="+ Alta de usuario" className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[141px]"/>
              </div>
            </div>
            <div className="content-stretch flex flex-col items-start pb-[20px] pt-[32px] relative shrink-0 w-full" data-node-id="241:3410" data-name="Panel:margin">
              <div className="bg-white border-[#e1e1e1] border-[0.667px] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col items-start p-[24px] relative rounded-[12px] shrink-0 w-full" data-node-id="241:3411" data-name="Panel">
                <div className="bg-[#fafafa] border-[#eee] border-[0.667px] border-solid content-stretch flex gap-[16px] items-end p-[16px] relative rounded-[8px] shrink-0 w-full" data-node-id="241:3412" data-name="Toolbar">
                  <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6.4px] items-start min-w-px relative" data-node-id="241:3413" data-name="Field">
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="241:3414" data-name="Text">
                      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap" data-node-id="241:3415">
                        Buscar usuario
                      </DesignText>
                    </div>
                    <div className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] overflow-clip relative rounded-[6px] shrink-0 w-full" data-node-id="241:3416" data-name="Input · DS">
                      <DesignInput className="block cursor-pointer flex-[1_0_0] h-[40px] min-w-px relative rounded-[4px]" data-node-id="241:3417" data-name="Left icon" label="Buscar usuario" initialValue="">
                        <div className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]" data-node-id="I241:3417;65:3042" data-name="Base"/>
                        <div className="-translate-y-1/2 absolute left-[12px] size-[18px] top-1/2" data-node-id="I241:3417;65:3043" data-name="Search">
                          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSearch}/>
                        </div>
                        <DesignText className="[word-break:break-word] absolute font-['Poppins:Regular'] leading-[24px] left-[38px] not-italic right-[12px] text-[#cacaca] text-[16px] text-left top-[calc(50%-12px)] whitespace-nowrap" data-node-id="I241:3417;65:3044">
                          ​
                        </DesignText>
                      </DesignInput>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col gap-[6.4px] items-start relative shrink-0 w-[270px]" data-node-id="241:3418" data-name="Field">
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="241:3419" data-name="Text">
                      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap" data-node-id="241:3420">
                        Rol
                      </DesignText>
                    </div>
                    <div className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] overflow-clip relative rounded-[6px] shrink-0 w-full" data-node-id="241:3421" data-name="Select · DS">
                      <DesignSelect className="border border-[#cacaca] border-solid content-stretch cursor-pointer flex flex-[1_0_0] flex-col gap-[2px] h-[32px] items-start min-w-px overflow-clip relative rounded-[10px]" data-node-id="241:3422" data-name="dropdown" label="Rol" initialValue="Todos los roles">
                        <div className="content-stretch flex gap-[10px] h-[32px] items-center justify-center overflow-clip p-[10px] relative rounded-[10px] shrink-0 w-full" data-node-id="I241:3422;7:1352" data-name="dropdown-input">
                          <DesignText className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[#4b4b4b] text-[12px] text-left" data-node-id="I241:3422;7:1353">
                            Todos los roles
                          </DesignText>
                          <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[15px]" data-node-id="I241:3422;7:1354" data-name="Container">
                            <div className="relative shrink-0 size-[12px]" data-node-id="I241:3422;7:1354;7:710" data-name="lucide/chevron-down">
                              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLucideChevronDown}/>
                            </div>
                          </div>
                        </div>
                      </DesignSelect>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col gap-[6.4px] items-start relative shrink-0 w-[150px]" data-node-id="241:3871" data-name="Field">
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="241:3872" data-name="Text">
                      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap" data-node-id="241:3873">
                        Estado
                      </DesignText>
                    </div>
                    <div className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] overflow-clip relative rounded-[6px] shrink-0 w-full" data-node-id="241:3874" data-name="Select · DS">
                      <DesignSelect className="border border-[#cacaca] border-solid content-stretch cursor-pointer flex flex-[1_0_0] flex-col gap-[2px] h-[32px] items-start min-w-px overflow-clip relative rounded-[10px]" data-node-id="241:3875" data-name="dropdown" label="Estado" initialValue="Todos">
                        <div className="content-stretch flex gap-[10px] h-[32px] items-center justify-center overflow-clip p-[10px] relative rounded-[10px] shrink-0 w-full" data-node-id="I241:3875;7:1352" data-name="dropdown-input">
                          <DesignText className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[#4b4b4b] text-[12px] text-left" data-node-id="I241:3875;7:1353">
                            Todos
                          </DesignText>
                          <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[15px]" data-node-id="I241:3875;7:1354" data-name="Container">
                            <div className="relative shrink-0 size-[12px]" data-node-id="I241:3875;7:1354;7:710" data-name="lucide/chevron-down">
                              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLucideChevronDown}/>
                            </div>
                          </div>
                        </div>
                      </DesignSelect>
                    </div>
                  </div>
                  <div className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="241:3423" data-name="Button · DS">
                    <Buttons buttonText="Buscar" className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"/>
                  </div>
                </div>
                <div className="content-stretch flex flex-col items-start pt-[24px] relative shrink-0 w-full" data-node-id="241:3425" data-name="Table:margin">
                  <DynamicSlot className="content-stretch flex flex-col h-[242.698px] items-start overflow-x-clip overflow-y-auto relative shrink-0 w-full" data-node-id="241:3426" data-name="Table">
                    <div className="grid grid-cols-[______minmax(0,145fr)_minmax(0,185fr)_minmax(0,265fr)_minmax(0,200fr)_minmax(0,90fr)_minmax(0,265fr)] grid-rows-[_____38.80px_67.85px_67.85px_67.85px_68px] h-[242.698px] relative shrink-0 w-full" data-node-id="241:3427" data-name="Table">
                      <div className="border-[#8e8e8e] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0" data-node-id="241:3428" data-name="Header Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="241:3429">
                          ID / matrícula
                        </DesignText>
                      </div>
                      <div className="border-[#8e8e8e] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0" data-node-id="241:3430" data-name="Header Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="241:3431">
                          Nombre
                        </DesignText>
                      </div>
                      <div className="border-[#8e8e8e] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0" data-node-id="241:3432" data-name="Header Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="241:3433">
                          Correo institucional
                        </DesignText>
                      </div>
                      <div className="border-[#8e8e8e] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0" data-node-id="241:3434" data-name="Header Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="241:3435">
                          Rol
                        </DesignText>
                      </div>
                      <div className="border-[#8e8e8e] border-b-[0.667px] border-solid col-5 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0" data-node-id="241:3436" data-name="Header Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="241:3437">
                          Estado
                        </DesignText>
                      </div>
                      <div className="border-[#8e8e8e] border-b-[0.667px] border-solid col-6 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0" data-node-id="241:3438" data-name="Header Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="241:3439">
                          Acciones
                        </DesignText>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 shrink-0" data-node-id="241:3440" data-name="Table Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="241:3441">
                          A01234567
                        </DesignText>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 shrink-0" data-node-id="241:3442" data-name="Table Cell">
                        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="241:3443" data-name="CatalogManagement">
                          <div className="h-[18.717px] relative shrink-0 w-full" data-node-id="241:3444" data-name="Container">
                            <DesignText className="[word-break:break-word] absolute font-['Poppins:Medium'] leading-[18px] left-0 not-italic text-[#1f1f1f] text-[12px] top-[-1.33px] w-[165.29px]" data-node-id="241:3445">
                              Mariana López
                            </DesignText>
                          </div>
                        </div>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 shrink-0" data-node-id="241:3449" data-name="Table Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="241:3450">
                          mariana.lopez@ducky.edu.mx
                        </DesignText>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 shrink-0" data-node-id="241:3451" data-name="Table Cell">
                        <div className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0" data-node-id="241:3452" data-name="Badge · DS">
                          <Badge className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" label="Alumno"/>
                        </div>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-5 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 shrink-0" data-node-id="241:3454" data-name="Table Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="241:3455">
                          Activo
                        </DesignText>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-6 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 shrink-0" data-node-id="241:3456" data-name="Table Cell">
                        <div className="content-stretch flex gap-[1.6px] h-[40px] items-start relative shrink-0 w-[247px]" data-node-id="241:3457" data-name="CatalogManagement">
                          <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="241:3458" data-name="Button · DS">
                            <Buttons buttonText="Editar" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[63px]" type="secondary"/>
                          </div>
                          <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="241:3460" data-name="Button · DS">
                            <Buttons buttonText="Roles" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[60px]" type="secondary"/>
                          </div>
                          <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="241:3462" data-name="Button · DS">
                            <Buttons buttonText="Baja" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                          </div>
                        </div>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 shrink-0" data-node-id="241:3464" data-name="Table Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="241:3465">
                          B000104
                        </DesignText>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 shrink-0" data-node-id="241:3466" data-name="Table Cell">
                        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="241:3467" data-name="CatalogManagement">
                          <div className="h-[18.717px] relative shrink-0 w-full" data-node-id="241:3468" data-name="Container">
                            <DesignText className="[word-break:break-word] absolute font-['Poppins:Medium'] leading-[18px] left-0 not-italic text-[#1f1f1f] text-[12px] top-[-1.33px] w-[165.29px]" data-node-id="241:3469">
                              Ernesto Díaz
                            </DesignText>
                          </div>
                        </div>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 shrink-0" data-node-id="241:3473" data-name="Table Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="241:3474">
                          ernesto.diaz@ducky.edu.mx
                        </DesignText>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 shrink-0" data-node-id="241:3475" data-name="Table Cell">
                        <div className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0" data-node-id="241:3476" data-name="Badge · DS">
                          <Badge className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" label="Bibliotecario"/>
                        </div>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-5 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 shrink-0" data-node-id="241:3478" data-name="Table Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="241:3479">
                          Activo
                        </DesignText>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-6 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 shrink-0" data-node-id="241:3480" data-name="Table Cell">
                        <div className="content-stretch flex gap-[1.6px] h-[40px] items-start relative shrink-0 w-[247px]" data-node-id="241:3481" data-name="CatalogManagement">
                          <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="241:3482" data-name="Button · DS">
                            <Buttons buttonText="Editar" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[63px]" type="secondary"/>
                          </div>
                          <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="241:3484" data-name="Button · DS">
                            <Buttons buttonText="Roles" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[60px]" type="secondary"/>
                          </div>
                          <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="241:3486" data-name="Button · DS">
                            <Buttons buttonText="Baja" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                          </div>
                        </div>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0" data-node-id="241:3488" data-name="Table Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="241:3489">
                          A01678234
                        </DesignText>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0" data-node-id="241:3490" data-name="Table Cell">
                        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="241:3491" data-name="CatalogManagement">
                          <div className="h-[18.717px] relative shrink-0 w-full" data-node-id="241:3492" data-name="Container">
                            <DesignText className="[word-break:break-word] absolute font-['Poppins:Medium'] leading-[18px] left-0 not-italic text-[#1f1f1f] text-[12px] top-[-1.33px] w-[165.29px]" data-node-id="241:3493">
                              Ana Torres Ruiz
                            </DesignText>
                          </div>
                        </div>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0" data-node-id="241:3497" data-name="Table Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="241:3498">
                          ana.torres@ducky.edu.mx
                        </DesignText>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0" data-node-id="241:3499" data-name="Table Cell">
                        <div className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0" data-node-id="241:3500" data-name="Badge · DS">
                          <Badge className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" label="Alumno"/>
                        </div>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-5 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0" data-node-id="241:3502" data-name="Table Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="241:3503">
                          Inactivo
                        </DesignText>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-6 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0" data-node-id="241:3504" data-name="Table Cell">
                        <div className="content-stretch flex gap-[1.6px] h-[40px] items-start relative shrink-0 w-[247px]" data-node-id="241:3505" data-name="CatalogManagement">
                          <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="241:3506" data-name="Button · DS">
                            <Buttons buttonText="Editar" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[63px]" type="secondary"/>
                          </div>
                          <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="241:3508" data-name="Button · DS">
                            <Buttons buttonText="Roles" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[60px]" type="secondary"/>
                          </div>
                          <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="241:3510" data-name="Button · DS">
                            <Buttons buttonText="Reactivar" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DynamicSlot>
                </div>
                <div className="content-stretch flex items-center justify-between pt-[20px] relative shrink-0 w-full" data-node-id="241:3536" data-name="Pagination">
                  <div className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="241:3537" data-name="Text">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap" data-node-id="241:3538">
                      3 usuarios registrados
                    </DesignText>
                  </div>
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="241:3539" data-name="Container">
                    <div className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[83.133px]" data-node-id="241:3540" data-name="Button · DS"/>
                    <div className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[91.133px]" data-node-id="241:3542" data-name="Button · DS"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border-[#cacaca] border-solid border-t-[0.667px] content-stretch flex h-[65.948px] items-start justify-between px-[32px] py-[24px] relative shrink-0 w-full" data-node-id="241:3544" data-name="Footer">
          <div className="content-stretch flex flex-col h-full items-start relative shrink-0" data-node-id="241:3545" data-name="Text">
            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap" data-node-id="241:3546">
              Universidad Ducky · Sistema de Biblioteca
            </DesignText>
          </div>
        </div>
      </div>
    </div>);
}
