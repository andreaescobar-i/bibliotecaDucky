import { DesignInput, DesignSelect, DesignText, DynamicSlot } from "../design-controls";
const imgIdentidadBiblioteca = "/assets/e387d.png";
const imgSearch = "/assets/5ef97.svg";
const imgLucideChevronDown = "/assets/a5ac0.svg";
const imgSort = "/assets/53850.svg";
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
export default function CatalogoBibliotecario() {
    return (<div className="bg-[#6d3b15] content-stretch flex flex-col items-start relative size-full" data-node-id="272:2449" data-name="catálogo - bibliotecario">
      <div className="bg-[#fafafa] content-stretch flex flex-col items-start min-w-[320px] relative shrink-0 w-full" data-node-id="272:2450" data-name="AppShell">
        <div className="bg-white content-stretch flex flex-col items-start relative shrink-0 w-[1280px]" data-node-id="272:2451" data-name="header">
          <div className="backdrop-blur-[12px] bg-[rgba(255,255,255,0)] border-[#d4d4d4] border-b border-solid content-stretch flex gap-[12px] h-[76px] items-center px-[24px] relative shrink-0 w-full" data-node-id="I272:2451;247:3311" data-name="Header · Bibliotecario">
            <div className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex gap-[12px] h-[75px] items-center min-h-[40px] px-[14.4px] py-[8.8px] relative rounded-[6px] shrink-0 w-[183px]" data-node-id="I272:2451;247:3312" data-name="Identidad · Biblioteca">
              <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none rounded-[6px] size-full" src={imgIdentidadBiblioteca}/>
            </div>
            <div className="content-stretch cursor-pointer flex flex-[1_0_0] gap-[4px] h-[50px] items-center justify-center min-w-px px-[24px] relative" data-node-id="I272:2451;247:3320" data-name="Navigation">
              <button className="bg-[#00a99b] border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I272:2451;247:3321" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap" data-node-id="I272:2451;247:3321;144:1469">
                  Préstamos
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I272:2451;272:2415" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I272:2451;272:2415;144:1484">
                  Catálogo
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I272:2451;247:3322" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I272:2451;247:3322;144:1484">
                  Devolución
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I272:2451;247:3323" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I272:2451;247:3323;144:1484">
                  Renovación
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I272:2451;247:3324" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I272:2451;247:3324;144:1484">
                  Multas y pagos
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I272:2451;247:3325" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I272:2451;247:3325;144:1484">
                  Suspendidos
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I272:2451;247:3360" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I272:2451;247:3360;144:1484">
                  Gestión de libros
                </DesignText>
              </button>
            </div>
            <div className="content-stretch flex h-[75px] items-center justify-end overflow-clip relative shrink-0 w-[250px]" data-node-id="I272:2451;247:3332" data-name="Container">
              <div className="content-stretch flex gap-[9.6px] items-center relative shrink-0" data-node-id="I272:2451;247:3340" data-name="Container">
                <div className="bg-[#262626] grid grid-cols-[_32px] grid-rows-[_32px] relative rounded-[16px] shrink-0 size-[32px]" data-node-id="I272:2451;247:3341" data-name="Text">
                  <DesignText className="[word-break:break-word] col-1 font-['Poppins:Medium'] justify-self-center leading-[18px] not-italic relative row-1 self-center shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="I272:2451;247:3342">
                    ED
                  </DesignText>
                </div>
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-[89.641px]" data-node-id="I272:2451;247:3343" data-name="Container">
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="I272:2451;247:3344" data-name="Bold Text">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] whitespace-nowrap" data-node-id="I272:2451;247:3345">
                      Ernesto Díaz
                    </DesignText>
                  </div>
                  <button className="content-stretch cursor-pointer flex flex-col h-[18px] items-start max-w-[160px] overflow-clip relative shrink-0 w-full" data-node-id="I272:2451;247:3346" data-name="Small">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] text-left whitespace-nowrap" data-node-id="I272:2451;247:3347">
                      Alumno
                    </DesignText>
                  </button>
                </div>
              </div>
              <div className="content-stretch cursor-pointer flex items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="I272:2451;247:3348" data-name="Button · DS">
                <Buttons buttonText="Cerrar sesión" className="aspect-[74/40] border border-[#007566] border-solid content-stretch flex items-center justify-center p-[10px] relative rounded-[8px] shrink-0" size="medium" type="secondary"/>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#fafafa] content-stretch flex flex-col h-[1336px] items-center relative shrink-0 w-full" data-node-id="272:2452" data-name="Main Content:margin">
          <div className="content-stretch flex flex-col items-start min-h-[526px] pb-[80px] pt-[48px] relative shrink-0 w-[1232px]" data-node-id="272:2453" data-name="Main Content">
            <div className="content-stretch flex items-end justify-between relative shrink-0 w-full" data-node-id="272:2454" data-name="PageHeader">
              <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[700px]" data-node-id="272:2455" data-name="Container">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] whitespace-nowrap" data-node-id="272:2456">
                  Consulta pública
                </DesignText>
                <div className="content-stretch flex flex-col items-start pt-[6px] relative shrink-0 w-[700px]" data-node-id="272:2457" data-name="Heading">
                  <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[38px] not-italic relative shrink-0 text-[#1f1f1f] text-[30px] whitespace-nowrap" data-node-id="272:2458">
                    Catálogo de libros
                  </DesignText>
                </div>
                <div className="content-stretch flex flex-col items-start pt-[6px] relative shrink-0 w-[700px]" data-node-id="272:2459" data-name="Paragraph">
                  <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#8e8e8e] text-[14px] whitespace-nowrap" data-node-id="272:2460">
                    Encuentra libros, consulta su disponibilidad y revisa las condiciones de uso.
                  </DesignText>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[16px] items-start pt-[32px] relative shrink-0 w-full" data-node-id="272:2461" data-name="Panel:margin">
              <div className="content-stretch drop-shadow-[0px_1px_2px_rgba(0,0,0,0.06)] flex gap-[12px] items-end p-[20px] relative rounded-[12px] shrink-0 w-full" data-node-id="272:2462" data-name="Toolbar">
                <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px relative" data-node-id="272:2463" data-name="Field-search">
                  <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap" data-node-id="272:2464">
                    Buscar en el catálogo
                  </DesignText>
                  <DesignInput className="block cursor-pointer h-[40px] relative rounded-[4px] shrink-0 w-full" data-node-id="272:2465" data-name="Left icon" label="Buscar en el catálogo" initialValue="">
                    <div className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]" data-node-id="I272:2465;65:3042" data-name="Base"/>
                    <div className="-translate-y-1/2 absolute left-[12px] size-[18px] top-1/2" data-node-id="I272:2465;65:3043" data-name="Search">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSearch}/>
                    </div>
                    <DesignText className="[word-break:break-word] absolute font-['Poppins:Regular'] leading-[24px] left-[38px] not-italic right-[12px] text-[#cacaca] text-[16px] text-left top-[calc(50%-12px)]" data-node-id="I272:2465;65:3044">
                      ​
                    </DesignText>
                  </DesignInput>
                </div>
                <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-[200px]" data-node-id="272:2466" data-name="Field-criterio">
                  <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap" data-node-id="272:2467">
                    Criterio
                  </DesignText>
                  <DesignSelect className="bg-white border border-[#e1e1e1] border-solid content-stretch cursor-pointer flex flex-col gap-[2px] h-[40px] items-start overflow-clip relative rounded-[4px] shrink-0 w-full" data-node-id="272:2468" data-name="dropdown_criterio" label="Criterio" initialValue="Todos  Item  Item  Item  Item  Item  Item">
                    <div className="content-stretch flex gap-[10px] items-center justify-center overflow-clip p-[10px] relative rounded-[10px] shrink-0 w-full" data-node-id="I272:2468;124:3478" data-name="dropdown-input">
                      <DesignText className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[#cacaca] text-[12px] text-left" data-node-id="I272:2468;124:3479">
                        Todos
                      </DesignText>
                      <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[15px]" data-node-id="I272:2468;124:3480" data-name="Container">
                        <div className="relative shrink-0 size-[12px]" data-node-id="I272:2468;124:3480;7:710" data-name="lucide/chevron-down">
                          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLucideChevronDown}/>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-[#8e8e8e] border-solid content-stretch drop-shadow-[2px_4px_2px_rgba(0,0,0,0.25)] flex flex-col items-start relative rounded-[4px] shrink-0 w-full" data-node-id="I272:2468;124:3481" data-name="dropdown-menu">
                      <div className="bg-[#4b4b4b] content-stretch flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full" data-node-id="I272:2468;124:3481;7:752">
                        <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['Poppins:Medium'] h-full justify-center leading-[0] min-w-px not-italic relative text-[12px] text-left text-white">
                          <DesignText className="leading-[18px]">Item</DesignText>
                        </div>
                      </div>
                      <div className="bg-[#4b4b4b] content-stretch flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full" data-node-id="I272:2468;124:3481;7:755">
                        <DesignText className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[12px] text-left text-white" data-node-id="I272:2468;124:3481;7:755;7:740">
                          Item
                        </DesignText>
                      </div>
                      <div className="bg-[#4b4b4b] content-stretch flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full" data-node-id="I272:2468;124:3481;7:771">
                        <DesignText className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[12px] text-left text-white" data-node-id="I272:2468;124:3481;7:771;7:740">
                          Item
                        </DesignText>
                      </div>
                      <div className="bg-[#4b4b4b] content-stretch flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full" data-node-id="I272:2468;124:3481;7:774">
                        <DesignText className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[12px] text-left text-white" data-node-id="I272:2468;124:3481;7:774;7:740">
                          Item
                        </DesignText>
                      </div>
                      <div className="bg-[#4b4b4b] content-stretch flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full" data-node-id="I272:2468;124:3481;124:2846">
                        <DesignText className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[12px] text-left text-white" data-node-id="I272:2468;124:3481;124:2846;7:740">
                          Item
                        </DesignText>
                      </div>
                      <div className="bg-[#4b4b4b] content-stretch flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full" data-node-id="I272:2468;124:3481;124:2901">
                        <DesignText className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[12px] text-left text-white" data-node-id="I272:2468;124:3481;124:2901;7:740">
                          Item
                        </DesignText>
                      </div>
                    </div>
                  </DesignSelect>
                </div>
                <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-[140px]" data-node-id="272:2469" data-name="Field-sort">
                  <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap" data-node-id="272:2470">
                    Ordenar
                  </DesignText>
                  <button className="bg-white border border-[#cacaca] border-solid content-stretch cursor-pointer flex gap-[8px] h-[38px] items-center px-[12px] py-[9px] relative rounded-[8px] shrink-0 w-full" data-node-id="272:2471" data-name="Sort-btn">
                    <div className="relative shrink-0 size-[16px]" data-node-id="272:2472" data-name="Sort">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSort}/>
                    </div>
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#cacaca] text-[12px] text-left whitespace-nowrap" data-node-id="272:2473">
                      Relevancia
                    </DesignText>
                  </button>
                </div>
                <Buttons buttonText="Buscar" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
              </div>
              <div className="bg-white border border-[#e1e1e1] border-solid content-stretch drop-shadow-[0px_1px_2px_rgba(0,0,0,0.06)] flex flex-col items-start p-[24px] relative rounded-[14px] shrink-0 w-full" data-node-id="272:2475" data-name="Panel">
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="272:2476" data-name="Catalog:margin">
                  <div className="border-[#e1e1e1] border-b border-solid content-stretch flex items-center justify-between pb-[16px] relative shrink-0 w-full" data-node-id="272:2477" data-name="Catalog">
                    <div className="content-stretch flex items-center relative shrink-0" data-node-id="272:2478" data-name="results-left">
                      <div className="content-stretch flex flex-col items-start relative shrink-0" data-node-id="272:2479" data-name="Bold Text">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#1f1f1f] text-[14px] whitespace-nowrap" data-node-id="272:2480">
                          4 resultados
                        </DesignText>
                      </div>
                    </div>
                    <div className="content-stretch flex items-center relative shrink-0" data-node-id="272:2481" data-name="results-right">
                      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap" data-node-id="272:2482">
                        Ordenados por relevancia
                      </DesignText>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="272:2483" data-name="Catalog">
                  <DynamicSlot className="content-stretch flex flex-col h-[647px] items-start relative shrink-0 w-full" data-node-id="272:2484" data-name="catalog_results">
                    <div className="bg-white border-[#e5e5e5] border-b border-solid content-stretch flex gap-[48px] h-[132px] items-baseline py-[12px] relative shrink-0 w-full" data-node-id="I272:2484;229:1084" data-name="book-row">
                      <div className="border border-[#cacaca] border-solid content-stretch flex flex-col h-[91px] items-center justify-center relative shrink-0 w-[68px]" data-node-id="I272:2484;229:1084;52:528" data-name="Frame">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap" data-node-id="I272:2484;229:1084;52:529">
                          LIBRO
                        </DesignText>
                      </div>
                      <div className="-translate-y-1/2 absolute content-stretch flex gap-[48px] items-center justify-center left-[116px] top-1/2" data-node-id="I272:2484;229:1084;2021:3251">
                        <div className="content-stretch flex flex-col h-[81px] items-start justify-center relative shrink-0 w-[346px]" data-node-id="I272:2484;229:1084;52:530" data-name="Frame">
                          <button className="content-stretch cursor-pointer flex flex-col h-[28px] items-start relative shrink-0 w-full" data-node-id="I272:2484;229:1084;52:531" data-name="Frame">
                            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#171717] text-[14px] text-left whitespace-nowrap" data-node-id="I272:2484;229:1084;52:532">
                              Cien años de soledad
                            </DesignText>
                          </button>
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#525252] text-[14px] whitespace-nowrap" data-node-id="I272:2484;229:1084;52:533">
                            Gabriel García Márquez
                          </DesignText>
                          <div className="[word-break:break-word] content-stretch flex font-['Poppins:Medium'] gap-[16px] items-center leading-[18px] not-italic pt-[8px] relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap" data-node-id="I272:2484;229:1084;52:534" data-name="Frame">
                            <DesignText className="relative shrink-0" data-node-id="I272:2484;229:1084;52:535">
                              Diana
                            </DesignText>
                            <DesignText className="relative shrink-0" data-node-id="I272:2484;229:1084;52:536">
                              LIT-863.64-GAR
                            </DesignText>
                          </div>
                        </div>
                        <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[396px]" data-node-id="I272:2484;229:1084;52:537" data-name="Frame">
                          <Badge className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" label="Disponible"/>
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap" data-node-id="I272:2484;229:1084;52:540">
                            Préstamo externo
                          </DesignText>
                        </div>
                        <button className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" data-node-id="I272:2484;229:1084;27:1441" data-name="Buttons">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-left text-white whitespace-nowrap" data-node-id="I272:2484;229:1084;27:1441;27:180">
                            Ver detalle
                          </DesignText>
                        </button>
                      </div>
                    </div>
                    <div className="bg-white border-[#e5e5e5] border-b border-solid content-stretch flex gap-[48px] h-[132px] items-baseline py-[12px] relative shrink-0 w-full" data-node-id="I272:2484;229:1100" data-name="book-row">
                      <div className="border border-[#cacaca] border-solid content-stretch flex flex-col h-[91px] items-center justify-center relative shrink-0 w-[68px]" data-node-id="I272:2484;229:1100;52:528" data-name="Frame">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap" data-node-id="I272:2484;229:1100;52:529">
                          LIBRO
                        </DesignText>
                      </div>
                      <div className="-translate-y-1/2 absolute content-stretch flex gap-[48px] items-center justify-center left-[116px] top-1/2" data-node-id="I272:2484;229:1100;2021:3251">
                        <div className="content-stretch flex flex-col h-[81px] items-start relative shrink-0 w-[346px]" data-node-id="I272:2484;229:1100;52:530" data-name="Frame">
                          <button className="content-stretch cursor-pointer flex flex-col h-[28px] items-start relative shrink-0 w-full" data-node-id="I272:2484;229:1100;52:531" data-name="Frame">
                            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#171717] text-[14px] text-left whitespace-nowrap" data-node-id="I272:2484;229:1100;52:532">
                              Introducción a los algoritmos
                            </DesignText>
                          </button>
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#525252] text-[14px] whitespace-nowrap" data-node-id="I272:2484;229:1100;52:533">
                            Thomas H. Cormen
                          </DesignText>
                          <div className="[word-break:break-word] content-stretch flex font-['Poppins:Medium'] gap-[16px] items-center leading-[18px] not-italic pt-[8px] relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap" data-node-id="I272:2484;229:1100;52:534" data-name="Frame">
                            <DesignText className="relative shrink-0" data-node-id="I272:2484;229:1100;52:535">
                              MIT Press
                            </DesignText>
                            <DesignText className="relative shrink-0" data-node-id="I272:2484;229:1100;52:536">
                              COM-005.1-COR
                            </DesignText>
                          </div>
                        </div>
                        <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[396px]" data-node-id="I272:2484;229:1100;52:537" data-name="Frame">
                          <div className="bg-[#4b4b4b] border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" data-node-id="I272:2484;229:1100;143:1235" data-name="Badge">
                            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="I272:2484;229:1100;143:1235;141:4721">
                              Prestado
                            </DesignText>
                          </div>
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap" data-node-id="I272:2484;229:1100;52:540">
                            Préstamo externo
                          </DesignText>
                        </div>
                        <button className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" data-node-id="I272:2484;229:1100;27:1441" data-name="Buttons">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-left text-white whitespace-nowrap" data-node-id="I272:2484;229:1100;27:1441;27:180">
                            Ver detalle
                          </DesignText>
                        </button>
                      </div>
                    </div>
                    <div className="bg-white border-[#e5e5e5] border-b border-solid content-stretch flex gap-[48px] h-[132px] items-baseline py-[12px] relative shrink-0 w-full" data-node-id="I272:2484;229:1116" data-name="book-row">
                      <div className="border border-[#cacaca] border-solid content-stretch flex flex-col h-[91px] items-center justify-center relative shrink-0 w-[68px]" data-node-id="I272:2484;229:1116;52:528" data-name="Frame">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap" data-node-id="I272:2484;229:1116;52:529">
                          LIBRO
                        </DesignText>
                      </div>
                      <div className="-translate-y-1/2 absolute content-stretch flex gap-[48px] items-center justify-center left-[116px] top-1/2" data-node-id="I272:2484;229:1116;2021:3251">
                        <div className="content-stretch flex flex-col h-[81px] items-start relative shrink-0 w-[346px]" data-node-id="I272:2484;229:1116;52:530" data-name="Frame">
                          <button className="content-stretch cursor-pointer flex flex-col h-[28px] items-start relative shrink-0 w-full" data-node-id="I272:2484;229:1116;52:531" data-name="Frame">
                            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#171717] text-[14px] text-left whitespace-nowrap" data-node-id="I272:2484;229:1116;52:532">
                              Historia mínima de México
                            </DesignText>
                          </button>
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#525252] text-[14px] whitespace-nowrap" data-node-id="I272:2484;229:1116;52:533">
                            Pablo Escalante
                          </DesignText>
                          <div className="[word-break:break-word] content-stretch flex font-['Poppins:Medium'] gap-[16px] items-center leading-[18px] not-italic pt-[8px] relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap" data-node-id="I272:2484;229:1116;52:534" data-name="Frame">
                            <DesignText className="relative shrink-0" data-node-id="I272:2484;229:1116;52:535">
                              El Colegio de México
                            </DesignText>
                            <DesignText className="relative shrink-0" data-node-id="I272:2484;229:1116;52:536">
                              HIS-972-ESC
                            </DesignText>
                          </div>
                        </div>
                        <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[396px]" data-node-id="I272:2484;229:1116;52:537" data-name="Frame">
                          <div className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" data-node-id="I272:2484;229:1116;143:1235" data-name="Badge">
                            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#4b4b4b] text-[12px] whitespace-nowrap" data-node-id="I272:2484;229:1116;143:1235;137:4655">
                              No disponible
                            </DesignText>
                          </div>
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap" data-node-id="I272:2484;229:1116;52:540">
                            Consulta interna
                          </DesignText>
                        </div>
                        <button className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" data-node-id="I272:2484;229:1116;27:1441" data-name="Buttons">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-left text-white whitespace-nowrap" data-node-id="I272:2484;229:1116;27:1441;27:180">
                            Ver detalle
                          </DesignText>
                        </button>
                      </div>
                    </div>
                    <div className="bg-white border-[#e5e5e5] border-b border-solid content-stretch flex gap-[48px] h-[132px] items-baseline py-[12px] relative shrink-0 w-full" data-node-id="I272:2484;229:1132" data-name="book-row">
                      <div className="border border-[#cacaca] border-solid content-stretch flex flex-col h-[91px] items-center justify-center relative shrink-0 w-[68px]" data-node-id="I272:2484;229:1132;52:528" data-name="Frame">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap" data-node-id="I272:2484;229:1132;52:529">
                          LIBRO
                        </DesignText>
                      </div>
                      <div className="-translate-y-1/2 absolute content-stretch flex gap-[48px] items-center justify-center left-[116px] top-1/2" data-node-id="I272:2484;229:1132;2021:3251">
                        <div className="content-stretch flex flex-col h-[81px] items-start relative shrink-0 w-[346px]" data-node-id="I272:2484;229:1132;52:530" data-name="Frame">
                          <button className="content-stretch cursor-pointer flex flex-col h-[28px] items-start relative shrink-0 w-full" data-node-id="I272:2484;229:1132;52:531" data-name="Frame">
                            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#171717] text-[14px] text-left whitespace-nowrap" data-node-id="I272:2484;229:1132;52:532">
                              Cálculo de una variable
                            </DesignText>
                          </button>
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#525252] text-[14px] whitespace-nowrap" data-node-id="I272:2484;229:1132;52:533">
                            James Stewart
                          </DesignText>
                          <div className="[word-break:break-word] content-stretch flex font-['Poppins:Medium'] gap-[16px] items-center leading-[18px] not-italic pt-[8px] relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap" data-node-id="I272:2484;229:1132;52:534" data-name="Frame">
                            <DesignText className="relative shrink-0" data-node-id="I272:2484;229:1132;52:535">
                              Cengage
                            </DesignText>
                            <DesignText className="relative shrink-0" data-node-id="I272:2484;229:1132;52:536">
                              MAT-515-STE
                            </DesignText>
                          </div>
                        </div>
                        <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[396px]" data-node-id="I272:2484;229:1132;52:537" data-name="Frame">
                          <div className="bg-white border border-[#4b4b4b] border-dashed content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" data-node-id="I272:2484;229:1132;143:1235" data-name="Badge">
                            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#4b4b4b] text-[12px] whitespace-nowrap" data-node-id="I272:2484;229:1132;143:1235;141:4666">
                              Disponible
                            </DesignText>
                          </div>
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap" data-node-id="I272:2484;229:1132;52:540">
                            Reservado
                          </DesignText>
                        </div>
                        <button className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" data-node-id="I272:2484;229:1132;27:1441" data-name="Buttons">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-left text-white whitespace-nowrap" data-node-id="I272:2484;229:1132;27:1441;27:180">
                            Ver detalle
                          </DesignText>
                        </button>
                      </div>
                    </div>
                    <div className="bg-white border-[#e5e5e5] border-b border-solid content-stretch flex gap-[48px] h-[131px] items-baseline py-[12px] relative shrink-0 w-full" data-node-id="I272:2484;318:1710" data-name="book-row · Pedro Páramo">
                      <div className="border border-[#cacaca] border-solid content-stretch flex flex-col h-[91px] items-center justify-center relative shrink-0 w-[68px]" data-node-id="I272:2484;318:1710;52:528" data-name="Frame">
                        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap" data-node-id="I272:2484;318:1710;52:529">
                          LIBRO
                        </DesignText>
                      </div>
                      <div className="-translate-y-1/2 absolute content-stretch flex gap-[48px] items-center justify-center left-[116px] top-1/2" data-node-id="I272:2484;318:1710;2021:3251">
                        <div className="content-stretch flex flex-col h-[81px] items-start relative shrink-0 w-[346px]" data-node-id="I272:2484;318:1710;52:530" data-name="Frame">
                          <button className="content-stretch cursor-pointer flex flex-col h-[28px] items-start relative shrink-0 w-full" data-node-id="I272:2484;318:1710;52:531" data-name="Frame">
                            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#171717] text-[14px] text-left whitespace-nowrap" data-node-id="I272:2484;318:1710;52:532">
                              Pedro Páramo
                            </DesignText>
                          </button>
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#525252] text-[14px] whitespace-nowrap" data-node-id="I272:2484;318:1710;52:533">
                            Juan Rulfo
                          </DesignText>
                          <div className="[word-break:break-word] content-stretch flex font-['Poppins:Medium'] gap-[16px] items-center leading-[18px] not-italic pt-[8px] relative shrink-0 text-[#737373] text-[12px] whitespace-nowrap" data-node-id="I272:2484;318:1710;52:534" data-name="Frame">
                            <DesignText className="relative shrink-0" data-node-id="I272:2484;318:1710;52:535">
                              RM
                            </DesignText>
                            <DesignText className="relative shrink-0" data-node-id="I272:2484;318:1710;52:536">
                              LIT-863-RUL
                            </DesignText>
                          </div>
                        </div>
                        <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[396px]" data-node-id="I272:2484;318:1710;52:537" data-name="Frame">
                          <Badge className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" label="Disponible"/>
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#525252] text-[12px] whitespace-nowrap" data-node-id="I272:2484;318:1710;52:540">
                            Préstamo externo
                          </DesignText>
                        </div>
                        <button className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" data-node-id="I272:2484;318:1710;27:1441" data-name="Buttons">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-left text-white whitespace-nowrap" data-node-id="I272:2484;318:1710;27:1441;27:180">
                            Ver detalle
                          </DesignText>
                        </button>
                      </div>
                    </div>
                  </DynamicSlot>
                </div>
                <div className="content-stretch flex items-center justify-between pt-[20px] relative shrink-0 w-full" data-node-id="272:2491" data-name="Pagination">
                  <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap" data-node-id="272:2492">
                    Mostrando 1–4 de 4
                  </DesignText>
                  <div className="content-stretch cursor-pointer flex gap-[8px] items-center relative shrink-0" data-node-id="272:2493" data-name="Container">
                    <button className="aspect-[77/40] bg-[#eefcfa] content-stretch flex items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" data-node-id="272:2494" data-name="Buttons">
                      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-left whitespace-nowrap" data-node-id="I272:2494;27:274">
                        Anterior
                      </DesignText>
                    </button>
                    <Buttons buttonText="Siguiente" className="bg-[#00a99b] content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border-[#fafafa] border-solid border-t content-stretch flex items-start justify-between px-[32px] py-[20px] relative shrink-0 w-full" data-node-id="272:2496" data-name="Footer">
          <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-node-id="272:2497" data-name="Text">
            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap" data-node-id="272:2498">
              Universidad Ducky · Sistema de Biblioteca
            </DesignText>
          </div>
        </div>
      </div>
    </div>);
}
