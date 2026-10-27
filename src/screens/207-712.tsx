import { DesignInput, DesignSelect, DesignText, DynamicSlot } from "../design-controls";
const imgIdentidadBiblioteca = "/assets/e387d.png";
const imgSearch = "/assets/5ef97.svg";
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
    state?: "terciary";
};
function Badge({ className, label = "Estado", state = "terciary" }: BadgeProps) {
    return (<div className={className || "bg-white border border-[#4b4b4b] border-dashed content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px]"} data-node-id="141:4665">
      <p className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#4b4b4b] text-[12px] whitespace-nowrap" data-node-id="141:4666">
        {label}
      </p>
    </div>);
}
export default function RenovacionBibliotecario() {
    return (<div className="bg-[#fafafa] content-stretch flex flex-col items-start relative size-full" data-node-id="207:712" data-name="renovación - bibliotecario">
      <div className="bg-[#fafafa] content-stretch flex flex-col items-start min-h-[422px] min-w-[320px] relative shrink-0 w-full" data-node-id="207:713" data-name="AppShell">
        <div className="bg-white content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="207:804" data-name="header">
          <div className="backdrop-blur-[12px] bg-[rgba(255,255,255,0)] border-[#d4d4d4] border-b border-solid content-stretch flex gap-[12px] h-[76px] items-center px-[24px] relative shrink-0 w-full" data-node-id="I207:804;247:3311" data-name="Header · Bibliotecario">
            <div className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex gap-[12px] h-[75px] items-center min-h-[40px] px-[14.4px] py-[8.8px] relative rounded-[6px] shrink-0 w-[183px]" data-node-id="I207:804;247:3312" data-name="Identidad · Biblioteca">
              <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none rounded-[6px] size-full" src={imgIdentidadBiblioteca}/>
            </div>
            <div className="content-stretch cursor-pointer flex flex-[1_0_0] gap-[4px] h-[50px] items-center justify-center min-w-px px-[24px] relative" data-node-id="I207:804;247:3320" data-name="Navigation">
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I207:804;247:3321" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I207:804;247:3321;144:1484">
                  Préstamos
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I207:804;272:2415" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I207:804;272:2415;144:1484">
                  Catálogo
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I207:804;247:3322" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I207:804;247:3322;144:1484">
                  Devolución
                </DesignText>
              </button>
              <button className="bg-[#00a99b] border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I207:804;247:3323" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap" data-node-id="I207:804;247:3323;144:1469">
                  Renovación
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I207:804;247:3324" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I207:804;247:3324;144:1484">
                  Multas y pagos
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I207:804;247:3325" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I207:804;247:3325;144:1484">
                  Suspendidos
                </DesignText>
              </button>
              <button className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0" data-node-id="I207:804;247:3360" data-name="nav">
                <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap" data-node-id="I207:804;247:3360;144:1484">
                  Gestión de libros
                </DesignText>
              </button>
            </div>
            <div className="content-stretch flex h-[75px] items-center justify-end overflow-clip relative shrink-0 w-[250px]" data-node-id="I207:804;247:3332" data-name="Container">
              <div className="content-stretch flex gap-[9.6px] items-center relative shrink-0" data-node-id="I207:804;247:3340" data-name="Container">
                <div className="bg-[#262626] grid grid-cols-[_32px] grid-rows-[_32px] relative rounded-[16px] shrink-0 size-[32px]" data-node-id="I207:804;247:3341" data-name="Text">
                  <DesignText className="[word-break:break-word] col-1 font-['Poppins:Medium'] justify-self-center leading-[18px] not-italic relative row-1 self-center shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="I207:804;247:3342">
                    ML
                  </DesignText>
                </div>
                <div className="content-stretch cursor-pointer flex flex-col items-start relative shrink-0 w-[89.641px]" data-node-id="I207:804;247:3343" data-name="Container">
                  <button className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="I207:804;247:3344" data-name="Bold Text">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] text-left whitespace-nowrap" data-node-id="I207:804;247:3345">
                      Mariana López
                    </DesignText>
                  </button>
                  <button className="content-stretch flex flex-col h-[18px] items-start max-w-[160px] overflow-clip relative shrink-0 w-full" data-node-id="I207:804;247:3346" data-name="Small">
                    <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] text-left whitespace-nowrap" data-node-id="I207:804;247:3347">
                      Alumno
                    </DesignText>
                  </button>
                </div>
              </div>
              <div className="content-stretch cursor-pointer flex items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0" data-node-id="I207:804;247:3348" data-name="Button · DS">
                <Buttons buttonText="Cerrar sesión" className="aspect-[74/40] border border-[#007566] border-solid content-stretch flex items-center justify-center p-[10px] relative rounded-[8px] shrink-0" size="medium" type="secondary"/>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-center px-[27px] relative shrink-0 w-full" data-node-id="207:734" data-name="Main Content:margin">
          <div className="content-stretch flex flex-col items-start min-h-[278px] pb-[80px] pt-[56px] relative shrink-0 w-full" data-node-id="207:735" data-name="Main Content">
            <div className="content-stretch flex h-[90px] items-end justify-between relative shrink-0 w-full" data-node-id="207:736" data-name="PageHeader">
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-[379.271px]" data-node-id="207:737" data-name="Container">
                <div className="content-stretch flex flex-col items-start min-h-[36px] relative shrink-0 w-full" data-node-id="207:738" data-name="Heading">
                  <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[32px] not-italic relative shrink-0 text-[#1f1f1f] text-[24px] whitespace-nowrap" data-node-id="207:739">
                    Renovar préstamo
                  </DesignText>
                </div>
                <div className="content-stretch flex flex-col gap-[8px] h-[34.8px] items-start max-w-[720px] pb-[12px] pt-[8.8px] relative shrink-0 w-[379.271px]" data-node-id="207:740" data-name="Paragraph">
                  <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[24px] not-italic relative shrink-0 text-[#4b4b4b] text-[16px] whitespace-nowrap" data-node-id="207:741">
                    Revisa el resultado de la validación antes de autorizar.
                  </DesignText>
                  <Buttons buttonText="Alumno · 5 días hábiles · máximo 2 renovaciones" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col items-start pb-[20px] pt-[57px] relative shrink-0 w-full" data-node-id="207:742" data-name="Panel:margin">
              <div className="bg-white border-[#e1e1e1] border-[0.667px] border-solid content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.06)] flex flex-col items-start p-[24px] relative rounded-[12px] shrink-0 w-full" data-node-id="207:743" data-name="Panel">
                <div className="bg-[#fafafa] border-[#eee] border-[0.667px] border-solid gap-x-[12px] gap-y-[12px] grid grid-cols-[__minmax(0,1fr)_261.56px] grid-rows-[_64.62px] p-[16px] relative rounded-[8px] shrink-0 w-full" data-node-id="207:744" data-name="Toolbar">
                  <div className="col-1 content-stretch flex flex-col gap-[6.4px] items-start justify-self-stretch relative row-1 self-end shrink-0" data-node-id="207:745" data-name="Field">
                    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="207:746" data-name="Text">
                      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap" data-node-id="207:747">
                        Folio de préstamo
                      </DesignText>
                    </div>
                    <div className="content-stretch flex h-[40px] items-center justify-center min-h-[40px] overflow-clip relative rounded-[6px] shrink-0 w-full" data-node-id="207:748" data-name="Input · DS">
                      <DesignInput className="block cursor-pointer flex-[1_0_0] h-[40px] min-w-px relative rounded-[4px]" data-node-id="207:749" data-name="Left icon" label="Folio de préstamo" initialValue="PRE-2025-1654">
                        <div className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]" data-node-id="I207:749;65:3203" data-name="Base"/>
                        <DesignText className="[word-break:break-word] absolute font-['Poppins:Regular'] leading-[24px] left-[38px] not-italic right-[12px] text-[#4b4b4b] text-[16px] text-left top-[calc(50%-12px)] whitespace-nowrap" data-node-id="I207:749;65:3204">
                          PRE-2025-1654
                        </DesignText>
                        <div className="-translate-y-1/2 absolute left-[12px] size-[18px] top-1/2" data-node-id="I207:749;65:3205" data-name="Search">
                          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSearch}/>
                        </div>
                      </DesignInput>
                    </div>
                  </div>
                  <div className="col-2 content-stretch flex h-[40px] items-center justify-center justify-self-stretch min-h-[40px] relative rounded-[6px] row-1 self-end shrink-0" data-node-id="207:750" data-name="Button · DS">
                    <Buttons buttonText="Consultar" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                  </div>
                </div>
                <div className="content-stretch flex flex-col items-start pt-[24px] relative shrink-0 w-full" data-node-id="207:752" data-name="Renewal:margin">
                  <div className="bg-white border-[#8e8e8e] border-[0.667px] border-solid content-stretch flex flex-col items-start p-[20px] relative rounded-[10px] shrink-0 w-full" data-node-id="207:753" data-name="Renewal">
                    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-node-id="207:754" data-name="Container">
                      <div className="content-stretch flex flex-col items-start relative shrink-0 w-[220.865px]" data-node-id="207:755" data-name="Container">
                        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="207:756" data-name="Text">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap" data-node-id="207:757">
                            PRE-2025-1654
                          </DesignText>
                        </div>
                        <div className="content-stretch flex flex-col h-[32px] items-start min-h-[30px] pt-[8px] relative shrink-0 w-[220.865px]" data-node-id="207:758" data-name="Heading">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[28px] not-italic relative shrink-0 text-[#1f1f1f] text-[20px] whitespace-nowrap" data-node-id="207:759">
                            Pedro Páramo
                          </DesignText>
                        </div>
                        <div className="content-stretch flex flex-col items-start pt-[5.6px] relative shrink-0 w-full" data-node-id="207:760" data-name="Paragraph:margin">
                          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="207:761" data-name="Paragraph">
                            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#4b4b4b] text-[12px] whitespace-nowrap" data-node-id="207:762">
                              Mariana López Hernández
                            </DesignText>
                          </div>
                          <div className="[word-break:break-word] content-stretch flex flex-col font-['Poppins:Medium'] gap-[2px] items-start leading-[18px] not-italic overflow-clip relative shrink-0 text-[#737373] text-[12px] w-full" data-node-id="348:1869" data-name="Estatus escolar del alumno">
                            <DesignText className="relative shrink-0 w-full" data-node-id="348:1870">
                              Estatus escolar
                            </DesignText>
                            <DesignText className="relative shrink-0 w-full" data-node-id="348:1871">
                              Inscrito
                            </DesignText>
                          </div>
                        </div>
                      </div>
                      <div className="content-stretch flex items-center justify-center min-h-[24.799999237060547px] relative rounded-[999px] shrink-0" data-node-id="207:763" data-name="Badge · DS">
                        <Badge className="bg-white border border-[#4b4b4b] border-dashed content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" label="1 de 2 renovaciones"/>
                      </div>
                    </div>
                    <div className="content-stretch flex flex-col items-start pt-[24px] relative shrink-0 w-full" data-node-id="207:765" data-name="Definition List:margin">
                      <div className="border-[#e1e1e1] border-b-[0.667px] border-solid border-t-[0.667px] gap-x-[16px] gap-y-[16px] grid grid-cols-[____188.17px_188.17px_188.17px_188.17px] grid-rows-[_42.22px] py-[16px] relative shrink-0 w-full" data-node-id="207:766" data-name="Definition List">
                        <div className="col-1 content-stretch flex flex-col items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-node-id="207:767" data-name="Container">
                          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="207:768" data-name="Definition Term">
                            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap" data-node-id="207:769">
                              Vencimiento actual
                            </DesignText>
                          </div>
                          <div className="content-stretch flex flex-col h-[25.8px] items-start pt-[4.8px] relative shrink-0 w-[188.167px]" data-node-id="207:770" data-name="Definition Description">
                            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#1f1f1f] text-[14px] whitespace-nowrap" data-node-id="207:771">
                              15 oct 2026
                            </DesignText>
                          </div>
                        </div>
                        <div className="col-2 content-stretch flex flex-col items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-node-id="207:772" data-name="Container">
                          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="207:773" data-name="Definition Term">
                            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap" data-node-id="207:774">
                              Nuevo vencimiento
                            </DesignText>
                          </div>
                          <div className="content-stretch flex flex-col h-[25.8px] items-start pt-[4.8px] relative shrink-0 w-[188.167px]" data-node-id="207:775" data-name="Definition Description">
                            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#1f1f1f] text-[14px] whitespace-nowrap" data-node-id="207:776">
                              22 oct 2026
                            </DesignText>
                          </div>
                        </div>
                        <div className="col-3 content-stretch flex flex-col items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-node-id="207:777" data-name="Container">
                          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="207:778" data-name="Definition Term">
                            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap" data-node-id="207:779">
                              Adeudos
                            </DesignText>
                          </div>
                          <div className="content-stretch flex flex-col h-[25.8px] items-start pt-[4.8px] relative shrink-0 w-[188.167px]" data-node-id="207:780" data-name="Definition Description">
                            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#1f1f1f] text-[14px] whitespace-nowrap" data-node-id="207:781">
                              $0.00
                            </DesignText>
                          </div>
                        </div>
                        <div className="col-4 content-stretch flex flex-col items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-node-id="207:782" data-name="Container">
                          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="207:783" data-name="Definition Term">
                            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap" data-node-id="207:784">
                              Reservas del libro
                            </DesignText>
                          </div>
                          <div className="content-stretch flex flex-col h-[25.8px] items-start pt-[4.8px] relative shrink-0 w-[188.167px]" data-node-id="207:785" data-name="Definition Description">
                            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#1f1f1f] text-[14px] whitespace-nowrap" data-node-id="207:786">
                              0
                            </DesignText>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="content-stretch flex flex-col items-start pt-[24px] relative shrink-0 w-full" data-node-id="207:787" data-name="Container:margin">
                      <div className="bg-[#fafafa] border-[#8e8e8e] border-[0.667px] border-dashed content-stretch flex flex-col gap-[4px] items-start px-[16px] py-[12.8px] relative rounded-[6px] shrink-0 w-full" data-node-id="207:788" data-name="Container">
                        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="207:789" data-name="Bold Text">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] whitespace-nowrap" data-node-id="207:790">
                            Validación favorable
                          </DesignText>
                        </div>
                        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="207:791" data-name="Text">
                          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#4b4b4b] text-[12px] whitespace-nowrap" data-node-id="207:792">
                            El usuario no tiene adeudos, préstamos vencidos ni ha agotado sus renovaciones.
                          </DesignText>
                        </div>
                      </div>
                    </div>
                    <div className="content-stretch flex flex-col items-start pt-[24px] relative shrink-0 w-full" data-node-id="207:793" data-name="Container:margin">
                      <div className="border-[#e1e1e1] border-solid border-t-[0.667px] content-stretch flex gap-[9.6px] h-[56.667px] items-start justify-end pt-[16px] relative shrink-0 w-full" data-node-id="207:794" data-name="Container">
                        <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[91.133px]" data-node-id="207:795" data-name="Button · DS">
                          <Buttons buttonText="Rechazar" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
                        </div>
                        <div className="content-stretch flex h-full items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0 w-[167px]" data-node-id="207:797" data-name="Button · DS">
                          <Buttons buttonText="Autorizar renovación" className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border-[#cacaca] border-solid border-t-[0.667px] content-stretch flex h-[65.948px] items-start justify-between px-[32px] py-[24px] relative shrink-0 w-full" data-node-id="207:799" data-name="Footer">
          <div className="content-stretch flex flex-col h-full items-start relative shrink-0" data-node-id="207:800" data-name="Text">
            <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap" data-node-id="207:801">
              Universidad Ducky · Sistema de Biblioteca
            </DesignText>
          </div>
        </div>
      </div>
    </div>);
}
