import { DesignInput, DesignSelect, DesignText, DynamicSlot } from "../design-controls";
const imgPlus = "/assets/da8fb.svg";
const imgPlus1 = "/assets/320b3.svg";
const imgIdentidadBiblioteca = "/assets/e387d.png";
const imgSearch = "/assets/5ef97.svg";
const imgLucideChevronDown = "/assets/b1c28.svg";
type ButtonsProps = {
    className?: string;
    buttonText?: string;
    icons?: boolean;
    showLeftIcon?: boolean;
    showRightIcon?: boolean;
    size?: "small" | "medium";
    state?: "Default";
    type?: "primary" | "secondary";
};
function Buttons({ className, buttonText = "text", icons = false, showLeftIcon = true, showRightIcon = true, size = "small", state = "Default", type = "primary" }: ButtonsProps) {
    const isMediumAndSecondaryAndNotIcons = size === "medium" && type === "secondary" && !icons;
    const isSmallAndPrimaryAndIcons = size === "small" && type === "primary" && icons;
    const isSmallAndSecondaryAndNotIcons = size === "small" && type === "secondary" && !icons;
    return (<button type="button" className={className || `content-stretch flex items-center justify-center relative rounded-[8px] ${isMediumAndSecondaryAndNotIcons ? "border border-[#007566] border-solid h-[45px] p-[10px]" : isSmallAndSecondaryAndNotIcons ? "border border-[#007566] border-solid h-[40px] px-[10px] py-[5px]" : isSmallAndPrimaryAndIcons ? "bg-[#00a99b] gap-[10px] h-[40px] px-[10px] py-[5px]" : "bg-[#00a99b] h-[40px] px-[10px] py-[5px]"}`} id={isMediumAndSecondaryAndNotIcons ? "node-27_257" : isSmallAndSecondaryAndNotIcons ? "node-27_255" : isSmallAndPrimaryAndIcons ? "node-27_285" : "node-27_182"}>
      {size === "small" && type === "primary" && !icons && (<p className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="27:180">
          {buttonText}
        </p>)}
      {isSmallAndPrimaryAndIcons && showLeftIcon && (<div className="relative shrink-0 size-[12px]" data-node-id="27:333" data-name="Plus">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPlus}/>
        </div>)}
      {isSmallAndPrimaryAndIcons && (<p className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap" data-node-id="27:286">
          {buttonText}
        </p>)}
      {isSmallAndPrimaryAndIcons && showRightIcon && (<div className="relative shrink-0 size-[12px]" data-node-id="27:336" data-name="Plus">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgPlus1}/>
        </div>)}
      {isSmallAndSecondaryAndNotIcons && (<p className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#007566] text-[12px] whitespace-nowrap" data-node-id="27:256">
          {buttonText}
        </p>)}
      {isMediumAndSecondaryAndNotIcons && (<p className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#007566] text-[14px] whitespace-nowrap" data-node-id="27:258">
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
export default function GestionCatalogoAdministrador() {
    return (<div className="bg-[#fafafa] content-stretch flex flex-col items-start relative size-full" data-node-id="207:1228" data-name="gestión catálogo - administrador">
      <div className="bg-[#fafafa] content-stretch flex flex-col items-start min-h-[422px] min-w-[320px] relative shrink-0 w-full" data-node-id="207:1229" data-name="AppShell">
        <div className="bg-white content-stretch flex flex-col h-[76px] items-start relative shrink-0 w-full" data-node-id="207:1375" data-name="header">
          <div className="absolute backdrop-blur-[12px] bg-[rgba(255,255,255,0)] border-[#d4d4d4] border-b border-solid content-stretch flex gap-[20px] h-[76px] items-center left-0 pl-[48px] pr-[32px] top-0 w-[1280px]" data-node-id="I207:1375;62:561" data-name="Header">
            <div className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex gap-[12px] h-[75px] items-center min-h-[40px] px-[14.4px] py-[8.8px] relative rounded-[6px] shrink-0 w-[182.914px]" data-node-id="I207:1375;62:562" data-name="Identidad · Biblioteca">
              <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none rounded-[6px] size-full" src={imgIdentidadBiblioteca}/>
            </div>
            <div className="content-stretch cursor-pointer flex gap-[8px] h-[50px] items-center justify-center px-[24px] relative shrink-0 w-[645px]" data-node-id="I207:1375;62:570" data-name="Navigation">
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I207:1375;207:651" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I207:1375;207:651;144:1484">
                  Reportes
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I207:1375;207:652" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I207:1375;207:652;144:1484">
                  Usuarios
                </DesignText>
              </button>
              <button className="bg-[#00a99b] border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I207:1375;207:653" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] font-medium leading-[18px] relative shrink-0 text-[12px] text-center text-white whitespace-nowrap" data-node-id="I207:1375;207:653;144:1469" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
                  Libros ▾
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I207:1375;207:654" data-name="Operaciones">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] font-medium leading-[18px] relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I207:1375;207:654;144:1484" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
                  Administración ▾
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I207:1375;207:655" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I207:1375;207:655;144:1484">
                  Operaciones ▾
                </DesignText>
              </button>
            </div>
            <div className="content-stretch flex h-[75px] items-center justify-between overflow-clip relative shrink-0 w-[332px]" data-node-id="I207:1375;62:576" data-name="Container">
              <div className="content-stretch flex gap-[9.6px] items-center relative shrink-0" data-node-id="I207:1375;62:584" data-name="Container">
                <div className="bg-[#262626] grid grid-cols-[_32px] grid-rows-[_32px] relative rounded-[16px] shrink-0 size-[32px]" data-node-id="I207:1375;62:585" data-name="Text">
                  <DesignText className="[word-break:break-word] col-1 font-['Poppins:Regular'] justify-self-center leading-[18px] not-italic relative row-1 self-center shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="I207:1375;62:586">
                    AC
                  </DesignText>
                </div>
                <div className="content-stretch cursor-pointer flex flex-col items-start relative shrink-0" data-node-id="I207:1375;62:587" data-name="Container">
                  <button className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="I207:1375;62:588" data-name="Bold Text">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] text-left whitespace-nowrap" data-node-id="I207:1375;62:589">
                      Alfonso Chapa
                    </DesignText>
                  </button>
                  <button className="content-stretch flex flex-col h-[18px] items-start max-w-[160px] overflow-clip relative shrink-0" data-node-id="I207:1375;62:590" data-name="Small">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] text-left whitespace-nowrap" data-node-id="I207:1375;62:591">
                      Admin
                    </DesignText>
                  </button>
                </div>
              </div>
              <div className="content-stretch cursor-pointer flex items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="I207:1375;62:592" data-name="Button · DS">
                <Buttons buttonText="Cerrar sesión" className="aspect-[74/40] border border-[#007566] border-solid content-stretch flex items-center justify-center p-[10px] relative rounded-[8px] shrink-0" size="medium" type="secondary"/>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-center px-[27px] relative shrink-0 w-full" data-node-id="207:1250" data-name="Main Content:margin">
          <div className="content-stretch flex flex-col items-start min-h-[278px] pb-[80px] pt-[56px] relative shrink-0 w-full" data-node-id="207:1251" data-name="Main Content">
            <div className="content-stretch flex h-[90px] items-end justify-between relative shrink-0 w-full" data-node-id="207:1252" data-name="PageHeader">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-[388.625px]" data-node-id="207:1253" data-name="Container">
                <div className="content-stretch flex flex-col items-start min-h-[36px] relative shrink-0 w-full" data-node-id="207:1254" data-name="Heading">
                  <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[32px] not-italic relative shrink-0 text-[#1f1f1f] text-[24px] whitespace-nowrap" data-node-id="207:1255">
                    Gestión de catálogo
                  </DesignText>
                </div>
                <div className="content-stretch flex flex-col h-[34.8px] items-start max-w-[720px] pt-[8.8px] relative shrink-0 w-[388.625px]" data-node-id="207:1256" data-name="Paragraph">
                  <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[24px] not-italic relative shrink-0 text-[#4b4b4b] text-[16px] whitespace-nowrap" data-node-id="207:1257">
                    Administra fichas bibliográficas, ejemplares y etiquetas.
                  </DesignText>
                </div>
              </div>
              <div className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[216px]" data-node-id="207:1258" data-name="Button · DS">
                <Buttons buttonText="Alta de ficha bibliográfica" className="bg-[#00a99b] content-stretch cursor-pointer flex gap-[10px] h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" icons showRightIcon={false}/>
              </div>
            </div>
            <div className="content-stretch flex flex-col items-start pb-[20px] pt-[32px] relative shrink-0 w-full" data-node-id="207:1260" data-name="Panel:margin">
              <div className="bg-white border-[#e1e1e1] border-[0.667px] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col items-start p-[24px] relative rounded-[12px] shrink-0 w-full" data-node-id="207:1261" data-name="Panel">
                <div className="bg-[#fafafa] border-[#eee] border-[0.667px] border-solid content-stretch flex items-end justify-between p-[17px] relative rounded-[8px] shrink-0 w-[1176px]" data-node-id="207:1262" data-name="Toolbar">
                  <div className="content-stretch flex flex-col gap-[6.4px] h-[66.4px] items-start relative shrink-0 w-[380.889px]" data-node-id="207:1263" data-name="Field">
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="207:1264" data-name="Text">
                      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap" data-node-id="207:1265">
                        Buscar en el catálogo
                      </DesignText>
                    </div>
                    <div className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] overflow-clip relative rounded-[6px] shrink-0 w-[475.885px]" data-node-id="207:1266" data-name="Input · DS">
                      <DesignInput className="block cursor-pointer h-[40px] relative rounded-[4px] shrink-0 w-[475.885px]" data-node-id="207:1267" data-name="Left icon" label="Buscar en el catálogo" initialValue="">
                        <div className="absolute bg-white border border-[#3a70e2] border-solid inset-0 rounded-[4px] shadow-[0px_0px_1px_1px_rgba(21,197,206,0.16)]" data-node-id="I207:1267;65:3086" data-name="Base"/>
                        <DesignText className="[word-break:break-word] absolute font-['Poppins:Regular'] leading-[24px] left-[38px] not-italic right-[12px] text-[#1f1f1f] text-[16px] text-left top-[calc(50%-12px)] whitespace-nowrap" data-node-id="I207:1267;65:3087">
                          ​
                        </DesignText>
                        <div className="-translate-y-1/2 absolute left-[12px] size-[18px] top-1/2" data-node-id="I207:1267;65:3088" data-name="Search">
                          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSearch}/>
                        </div>
                      </DesignInput>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col gap-[6.4px] h-[66.4px] items-start relative shrink-0 w-[380.889px]" data-node-id="207:1268" data-name="Field">
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="207:1269" data-name="Text">
                      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap" data-node-id="207:1270">
                        Tipo de uso
                      </DesignText>
                    </div>
                    <div className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] overflow-clip relative rounded-[6px] shrink-0 w-full" data-node-id="207:1271" data-name="Select · DS">
                      <DesignSelect className="border border-[#cacaca] border-solid content-stretch cursor-pointer flex flex-[1_0_0] flex-col gap-[2px] h-[32px] items-start justify-center min-w-px overflow-clip relative rounded-[10px]" data-node-id="207:1272" data-name="dropdown" label="Tipo de uso" initialValue="Todos">
                        <div className="content-stretch flex gap-[10px] h-[32px] items-center overflow-clip p-[10px] relative rounded-[10px] shrink-0 w-full" data-node-id="I207:1272;7:1352" data-name="dropdown-input">
                          <DesignText className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[#4b4b4b] text-[12px] text-left" data-node-id="I207:1272;7:1353">
                            Todos
                          </DesignText>
                          <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[15px]" data-node-id="I207:1272;7:1354" data-name="Container">
                            <div className="relative shrink-0 size-[12px]" data-node-id="I207:1272;7:1354;7:710" data-name="lucide/chevron-down">
                              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLucideChevronDown}/>
                            </div>
                          </div>
                        </div>
                      </DesignSelect>
                    </div>
                  </div>
                  <div className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[111px]" data-node-id="207:1273" data-name="Button · DS">
                    <Buttons buttonText="Buscar" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                  </div>
                </div>
                <div className="content-stretch flex flex-col items-start pt-[24px] relative shrink-0 w-full" data-node-id="207:1275" data-name="Table:margin">
                  <DynamicSlot className="content-stretch flex flex-col h-[242.698px] items-start overflow-clip relative shrink-0 w-full" data-node-id="207:1276" data-name="Table">
                    <div className="grid grid-cols-[______minmax(0,113.78fr)_minmax(0,188.12fr)_minmax(0,94.46fr)_minmax(0,138.33fr)_minmax(0,68.32fr)_minmax(0,238.98fr)] grid-rows-[_____38.80px_67.85px_67.85px_67.85px_68px] h-[242.698px] relative shrink-0 w-full" data-node-id="207:1277" data-name="Table">
                      <div className="border-[#8e8e8e] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0" data-node-id="207:1278" data-name="Header Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="207:1279">
                          Clave
                        </DesignText>
                      </div>
                      <div className="border-[#8e8e8e] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0" data-node-id="207:1280" data-name="Header Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="207:1281">
                          Título y autor
                        </DesignText>
                      </div>
                      <div className="border-[#8e8e8e] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0" data-node-id="207:1282" data-name="Header Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="207:1283">
                          Ejemplares
                        </DesignText>
                      </div>
                      <div className="border-[#8e8e8e] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0" data-node-id="207:1284" data-name="Header Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="207:1285">
                          Tipo de uso
                        </DesignText>
                      </div>
                      <div className="border-[#8e8e8e] border-b-[0.667px] border-solid col-5 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0" data-node-id="207:1286" data-name="Header Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="207:1287">
                          Estado
                        </DesignText>
                      </div>
                      <div className="border-[#8e8e8e] border-b-[0.667px] border-solid col-6 content-stretch flex flex-col h-[38.802px] items-start justify-center justify-self-stretch px-[12px] py-[11.2px] relative row-1 shrink-0" data-node-id="207:1288" data-name="Header Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="207:1289">
                          Acciones
                        </DesignText>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 shrink-0" data-node-id="207:1290" data-name="Table Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="207:1291">
                          LIT-863.64-GAR
                        </DesignText>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 shrink-0" data-node-id="207:1292" data-name="Table Cell">
                        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="207:1293" data-name="CatalogManagement">
                          <div className="h-[18.717px] relative shrink-0 w-full" data-node-id="207:1294" data-name="Container">
                            <DesignText className="[word-break:break-word] absolute font-['Poppins:Medium'] leading-[18px] left-0 not-italic text-[#1f1f1f] text-[12px] top-[-1.33px] whitespace-nowrap" data-node-id="207:1295">
                              Cien años de soledad
                            </DesignText>
                          </div>
                          <div className="content-stretch flex flex-col items-start pt-[3.2px] relative shrink-0 w-full" data-node-id="207:1296" data-name="Small:margin">
                            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="207:1297" data-name="Small">
                              <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="207:1298">
                                Gabriel García Márquez
                              </DesignText>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 shrink-0" data-node-id="207:1299" data-name="Table Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="207:1300">
                          4
                        </DesignText>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 shrink-0" data-node-id="207:1301" data-name="Table Cell">
                        <div className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0" data-node-id="207:1302" data-name="Badge · DS">
                          <Badge className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" label="Préstamo externo"/>
                        </div>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-5 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 shrink-0" data-node-id="207:1304" data-name="Table Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="207:1305">
                          Activo
                        </DesignText>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-6 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-2 shrink-0" data-node-id="207:1306" data-name="Table Cell">
                        <div className="content-stretch flex gap-[5px] h-[40px] items-start relative shrink-0 w-full" data-node-id="207:1307" data-name="CatalogManagement">
                          <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[68.133px]" data-node-id="207:1308" data-name="Button · DS">
                            <Buttons buttonText="Editar" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                          </div>
                          <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[84.133px]" data-node-id="207:1310" data-name="Button · DS">
                            <Buttons buttonText="Etiqueta" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                          </div>
                          <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[58.133px]" data-node-id="207:1312" data-name="Button · DS">
                            <Buttons buttonText="Baja" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                          </div>
                        </div>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 shrink-0" data-node-id="207:1314" data-name="Table Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="207:1315">
                          HIS-972-ESC
                        </DesignText>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 shrink-0" data-node-id="207:1316" data-name="Table Cell">
                        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="207:1317" data-name="CatalogManagement">
                          <div className="h-[18.717px] relative shrink-0 w-full" data-node-id="207:1318" data-name="Container">
                            <DesignText className="[word-break:break-word] absolute font-['Poppins:Medium'] leading-[18px] left-0 not-italic text-[#1f1f1f] text-[12px] top-[-1.33px] whitespace-nowrap" data-node-id="207:1319">
                              Historia mínima de México
                            </DesignText>
                          </div>
                          <div className="content-stretch flex flex-col items-start pt-[3.2px] relative shrink-0 w-full" data-node-id="207:1320" data-name="Small:margin">
                            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="207:1321" data-name="Small">
                              <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="207:1322">
                                Pablo Escalante
                              </DesignText>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 shrink-0" data-node-id="207:1323" data-name="Table Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="207:1324">
                          2
                        </DesignText>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 shrink-0" data-node-id="207:1325" data-name="Table Cell">
                        <div className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0" data-node-id="207:1326" data-name="Badge · DS">
                          <Badge className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" label="Consulta interna"/>
                        </div>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-5 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 shrink-0" data-node-id="207:1328" data-name="Table Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="207:1329">
                          Activo
                        </DesignText>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-6 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-3 shrink-0" data-node-id="207:1330" data-name="Table Cell">
                        <div className="content-stretch flex gap-[5px] h-[40px] items-start relative shrink-0 w-full" data-node-id="207:1331" data-name="CatalogManagement">
                          <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[68.133px]" data-node-id="207:1332" data-name="Button · DS">
                            <Buttons buttonText="Editar" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                          </div>
                          <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[84.133px]" data-node-id="207:1334" data-name="Button · DS">
                            <Buttons buttonText="Etiqueta" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                          </div>
                          <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[58.133px]" data-node-id="207:1336" data-name="Button · DS">
                            <Buttons buttonText="Baja" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                          </div>
                        </div>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-1 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0" data-node-id="207:1338" data-name="Table Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="207:1339">
                          MAT-515-STE
                        </DesignText>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-2 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0" data-node-id="207:1340" data-name="Table Cell">
                        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="207:1341" data-name="CatalogManagement">
                          <div className="h-[18.717px] relative shrink-0 w-full" data-node-id="207:1342" data-name="Container">
                            <DesignText className="[word-break:break-word] absolute font-['Poppins:Medium'] leading-[18px] left-0 not-italic text-[#1f1f1f] text-[12px] top-[-1.33px] whitespace-nowrap" data-node-id="207:1343">
                              Cálculo de una variable
                            </DesignText>
                          </div>
                          <div className="content-stretch flex flex-col items-start pt-[3.2px] relative shrink-0 w-full" data-node-id="207:1344" data-name="Small:margin">
                            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="207:1345" data-name="Small">
                              <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-full" data-node-id="207:1346">
                                James Stewart
                              </DesignText>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-3 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0" data-node-id="207:1347" data-name="Table Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="207:1348">
                          6
                        </DesignText>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-4 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0" data-node-id="207:1349" data-name="Table Cell">
                        <div className="content-stretch flex h-[24.8px] items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0" data-node-id="207:1350" data-name="Badge · DS">
                          <Badge className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" label="Reservado"/>
                        </div>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-5 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0" data-node-id="207:1352" data-name="Table Cell">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-full" data-node-id="207:1353">
                          Activo
                        </DesignText>
                      </div>
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid col-6 content-stretch flex flex-col h-[67.854px] items-start justify-center justify-self-stretch px-[12px] py-[13.6px] relative row-4 shrink-0" data-node-id="207:1354" data-name="Table Cell">
                        <div className="content-stretch flex gap-[5px] h-[40px] items-start relative shrink-0 w-full" data-node-id="207:1355" data-name="CatalogManagement">
                          <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[68.133px]" data-node-id="207:1356" data-name="Button · DS">
                            <Buttons buttonText="Editar" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                          </div>
                          <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[84.133px]" data-node-id="207:1358" data-name="Button · DS">
                            <Buttons buttonText="Etiqueta" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                          </div>
                          <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[58.133px]" data-node-id="207:1360" data-name="Button · DS">
                            <Buttons buttonText="Baja" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DynamicSlot>
                </div>
                <div className="content-stretch flex items-center justify-between pt-[20px] relative shrink-0 w-full" data-node-id="207:1362" data-name="Pagination">
                  <div className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="207:1363" data-name="Text">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap" data-node-id="207:1364">
                      Mostrando 1–3 de 3
                    </DesignText>
                  </div>
                  <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-node-id="207:1365" data-name="Container">
                    <div className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[83.133px]" data-node-id="207:1366" data-name="Button · DS">
                      <button className="bg-[#eefcfa] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[69px]" data-node-id="207:1367" data-name="Buttons">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-left whitespace-nowrap" data-node-id="I207:1367;27:274">
                          Anterior
                        </DesignText>
                      </button>
                    </div>
                    <div className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[91.133px]" data-node-id="207:1368" data-name="Button · DS">
                      <Buttons buttonText="Siguiente" className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border-[#cacaca] border-solid border-t-[0.667px] content-stretch flex h-[65.948px] items-start justify-between px-[32px] py-[24px] relative shrink-0 w-full" data-node-id="207:1370" data-name="Footer">
          <div className="content-stretch flex flex-col h-full items-start relative shrink-0" data-node-id="207:1371" data-name="Text">
            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap" data-node-id="207:1372">
              Universidad Ducky · Sistema de Biblioteca
            </DesignText>
          </div>
        </div>
      </div>
    </div>);
}
