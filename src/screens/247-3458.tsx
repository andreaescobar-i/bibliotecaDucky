import { DesignInput, DesignSelect, DesignText, DynamicSlot } from "../design-controls";
type ButtonsProps = {
    className?: string;
    buttonText?: string;
    icons?: "false";
    size?: "small";
    state?: "Default";
    type?: "primary" | "secondary";
};
function Buttons({ className, buttonText = "text", icons = "false", size = "small", state = "Default", type = "primary" }: ButtonsProps) {
    const isSecondary = type === "secondary";
    return (<button type="button" className={className || `content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] ${isSecondary ? "border border-[#007566] border-solid" : "bg-[#00a99b]"}`} id={isSecondary ? "node-27_255" : "node-27_182"}>
      {type === "primary" && (<p className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="27:180">
          {buttonText}
        </p>)}
      {isSecondary && (<p className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#007566] text-[12px] whitespace-nowrap" data-node-id="27:256">
          {buttonText}
        </p>)}
    </button>);
}
export default function OverlayGestionDeEjemplares() {
    return (<div className="bg-[var(--bg\/5,white)] border border-[var(--border\/2,#e5e6eb)] border-solid content-stretch flex flex-col gap-[20px] items-start overflow-clip p-[28px] relative rounded-[10px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.2)] size-full" data-node-id="247:3458" data-name="Overlay · Gestión de ejemplares">
      <DesignText className="[word-break:break-word] font-['Poppins:Regular'] leading-[28px] not-italic relative shrink-0 text-[20px] text-[color:var(--text\/1,#1d2129)] w-[576px]" data-node-id="247:3459">
        Ejemplares del libro
      </DesignText>
      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] min-w-full not-italic relative shrink-0 text-[14px] text-[color:var(--text\/1,#1d2129)] w-[min-content]" data-node-id="247:3510">
        Cien años de soledad
      </DesignText>
      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap" data-node-id="2114:2306">
        Ejemplares activos
      </DesignText>
      <DesignText className="[word-break:break-word] font-['Poppins:Regular'] leading-[22px] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap" data-node-id="2114:2307">
        4
      </DesignText>
      <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-[864px]" data-node-id="247:3511" data-name="Tabla · Ejemplares">
        <div className="[word-break:break-word] content-stretch flex font-['Poppins:Medium'] gap-[30px] items-center not-italic overflow-clip relative shrink-0 w-full" data-node-id="247:3512" data-name="Encabezado de ejemplares">
          <DesignText className="h-[24px] leading-[18px] relative shrink-0 text-[#1f1f1f] text-[12px] w-[125px]" data-node-id="247:3513">
            Ejemplar
          </DesignText>
          <DesignText className="h-[24px] leading-[18px] relative shrink-0 text-[#1f1f1f] text-[12px] w-[175px]" data-node-id="247:3514">
            Clasificación
          </DesignText>
          <DesignText className="h-[24px] leading-[18px] relative shrink-0 text-[#1f1f1f] text-[12px] w-[137px]" data-node-id="247:3515">
            Ubicación
          </DesignText>
          <DesignText className="h-[24px] leading-[18px] relative shrink-0 text-[#1f1f1f] text-[12px] w-[80px]" data-node-id="247:3516">
            Estado
          </DesignText>
          <DesignText className="h-[24px] leading-[22px] relative shrink-0 text-[14px] text-[color:var(--text\/1,#1d2129)] w-[217px]" data-node-id="247:3517">
            Acciones
          </DesignText>
        </div>
        <div className="border-[#e1e1e1] border-b border-solid content-stretch flex gap-[30px] h-[64px] items-center overflow-clip py-[12px] relative shrink-0 w-full" data-node-id="247:3518" data-name="Ejemplar 0">
          <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium'] justify-center leading-[0] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-[125px]" data-node-id="247:3519">
            <DesignText className="leading-[18px]">EJ-01083</DesignText>
          </div>
          <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium'] h-full justify-center leading-[0] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-[175px]" data-node-id="247:3520">
            <DesignText className="leading-[18px]">LIT-863.64-GAR</DesignText>
          </div>
          <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium'] h-full justify-center leading-[0] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-[137px]" data-node-id="247:3521">
            <DesignText className="leading-[18px]">Estante LIT · A1</DesignText>
          </div>
          <div className="content-stretch flex h-[40px] items-center overflow-clip relative shrink-0 w-[80px]" data-node-id="2121:2254" data-name="Estado · ancho de columna">
            <div className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" data-node-id="315:3621" data-name="Badge">
              <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#4b4b4b] text-[12px] whitespace-nowrap" data-node-id="I315:3621;137:4655">
                Activo
              </DesignText>
            </div>
          </div>
          <div className="content-stretch cursor-pointer flex gap-[8px] h-[40px] items-center overflow-clip relative shrink-0 w-[217px]" data-node-id="247:3523" data-name="Frame">
            <Buttons buttonText="Clasificar" className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
            <Buttons buttonText="Etiqueta" className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
            <Buttons buttonText="Baja" className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
          </div>
        </div>
        <div className="border-[#e1e1e1] border-b border-solid content-stretch flex gap-[30px] h-[64px] items-center overflow-clip py-[12px] relative shrink-0 w-full" data-node-id="247:3530" data-name="Ejemplar 1">
          <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium'] justify-center leading-[0] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-[125px]" data-node-id="247:3531">
            <DesignText className="leading-[18px]">EJ-01084</DesignText>
          </div>
          <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium'] h-full justify-center leading-[0] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-[175px]" data-node-id="247:3532">
            <DesignText className="leading-[18px]">LIT-863.64-GAR</DesignText>
          </div>
          <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium'] h-full justify-center leading-[0] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-[137px]" data-node-id="247:3533">
            <DesignText className="leading-[18px]">Estante LIT · A1</DesignText>
          </div>
          <div className="content-stretch flex h-[40px] items-center overflow-clip relative shrink-0 w-[80px]" data-node-id="2121:2255" data-name="Estado · ancho de columna">
            <div className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" data-node-id="315:3626" data-name="Badge">
              <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#4b4b4b] text-[12px] whitespace-nowrap" data-node-id="I315:3626;137:4655">
                Activo
              </DesignText>
            </div>
          </div>
          <div className="content-stretch cursor-pointer flex gap-[8px] h-[40px] items-center overflow-clip relative shrink-0 w-[217px]" data-node-id="247:3535" data-name="Frame">
            <Buttons buttonText="Clasificar" className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
            <Buttons buttonText="Etiqueta" className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
            <Buttons buttonText="Baja" className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
          </div>
        </div>
        <div className="border-[#e1e1e1] border-b border-solid content-stretch flex gap-[30px] h-[64px] items-center overflow-clip py-[12px] relative shrink-0 w-full" data-node-id="247:3542" data-name="Ejemplar 2">
          <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium'] justify-center leading-[0] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-[125px]" data-node-id="247:3543">
            <DesignText className="leading-[18px]">EJ-01085</DesignText>
          </div>
          <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium'] h-full justify-center leading-[0] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-[175px]" data-node-id="247:3544">
            <DesignText className="leading-[18px]">LIT-863.64-GAR</DesignText>
          </div>
          <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium'] h-full justify-center leading-[0] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-[137px]" data-node-id="247:3545">
            <DesignText className="leading-[18px]">Estante LIT · A1</DesignText>
          </div>
          <div className="content-stretch flex h-[40px] items-center overflow-clip relative shrink-0 w-[80px]" data-node-id="2121:2256" data-name="Estado · ancho de columna">
            <div className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" data-node-id="315:3632" data-name="Badge">
              <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#4b4b4b] text-[12px] whitespace-nowrap" data-node-id="I315:3632;137:4655">
                Activo
              </DesignText>
            </div>
          </div>
          <div className="content-stretch cursor-pointer flex gap-[8px] h-[40px] items-center overflow-clip relative shrink-0 w-[217px]" data-node-id="247:3547" data-name="Frame">
            <Buttons buttonText="Clasificar" className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
            <Buttons buttonText="Etiqueta" className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
            <Buttons buttonText="Baja" className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
          </div>
        </div>
        <div className="border-[#e1e1e1] border-b border-solid content-stretch flex gap-[30px] h-[64px] items-center overflow-clip py-[12px] relative shrink-0 w-full" data-node-id="247:3554" data-name="Ejemplar 3">
          <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium'] justify-center leading-[0] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-[125px]" data-node-id="247:3555">
            <DesignText className="leading-[18px]">EJ-01086</DesignText>
          </div>
          <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium'] h-full justify-center leading-[0] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-[175px]" data-node-id="247:3556">
            <DesignText className="leading-[18px]">LIT-863.64-GAR</DesignText>
          </div>
          <div className="[word-break:break-word] flex flex-col font-['Poppins:Medium'] h-full justify-center leading-[0] not-italic relative shrink-0 text-[#1f1f1f] text-[12px] w-[137px]" data-node-id="247:3557">
            <DesignText className="leading-[18px]">Estante LIT · A1</DesignText>
          </div>
          <div className="content-stretch flex h-[40px] items-center overflow-clip relative shrink-0 w-[80px]" data-node-id="2121:2257" data-name="Estado · ancho de columna">
            <div className="bg-white border border-[#4b4b4b] border-solid content-stretch flex items-center min-h-[24.799999237060547px] px-[8.8px] py-[3.2px] relative rounded-[999px] shrink-0" data-node-id="315:3635" data-name="Badge">
              <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#4b4b4b] text-[12px] whitespace-nowrap" data-node-id="I315:3635;137:4655">
                Activo
              </DesignText>
            </div>
          </div>
          <div className="content-stretch cursor-pointer flex gap-[8px] h-[40px] items-center overflow-clip relative shrink-0 w-[217px]" data-node-id="247:3559" data-name="Frame">
            <Buttons buttonText="Clasificar" className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
            <Buttons buttonText="Etiqueta" className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
            <Buttons buttonText="Baja" className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
          </div>
        </div>
      </div>
      <div className="content-stretch cursor-pointer flex items-center justify-between relative shrink-0 w-[854px]" data-node-id="2123:4334">
        <Buttons buttonText="Cerrar" className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
        <Buttons buttonText="Dar de baja libro completo" className="bg-[#00a99b] content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"/>
      </div>
    </div>);
}
