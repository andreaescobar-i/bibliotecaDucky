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
export default function OverlayReportarLibroPerdido() {
    return (<div className="bg-[var(--bg\/5,white)] border border-[var(--border\/2,#e5e6eb)] border-solid content-stretch flex flex-col gap-[20px] items-start overflow-clip p-[28px] relative rounded-[10px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.2)] size-full" data-node-id="211:1005" data-name="Overlay · Reportar libro perdido">
      <DesignText className="[word-break:break-word] font-['Poppins:Regular'] leading-[28px] not-italic relative shrink-0 text-[20px] text-[color:var(--text\/1,#1d2129)] w-[576px]" data-node-id="211:1006">
        Reportar libro perdido
      </DesignText>
      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[14px] text-[color:var(--text\/2,#4e5969)] w-[576px]" data-node-id="211:1007">
        Reposición requerida · COM-005.1-COR / EJ-00481
      </DesignText>
      <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full" data-node-id="211:1008" data-name="Precio última compra (USD)">
        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)] w-[576px]" data-node-id="211:1009">
          Precio última compra (USD)
        </DesignText>
        <DesignInput className="content-stretch cursor-pointer flex gap-[10px] h-[44px] items-center px-[14px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-node-id="211:1010" data-name="Input · Interactivo" label="Precio última compra (USD)" initialValue="68.00">
          <div className="absolute inset-0 rounded-[4px]" data-node-id="I211:1010;2024:4518" data-name="Input · DS · Base">
            <div className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]" data-node-id="I211:1010;2024:4518;65:1262" data-name="Base"/>
          </div>
          <DesignText className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] h-full leading-[22px] min-w-px not-italic relative text-[14px] text-[color:var(--text\/1,#1d2129)] text-left" data-node-id="I211:1010;165:2392">
            68.00
          </DesignText>
        </DesignInput>
      </div>
      <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full" data-node-id="211:1016" data-name="Tipo de cambio (MXN por USD)">
        <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)] w-[576px]" data-node-id="211:1017">
          Tipo de cambio (MXN por USD)
        </DesignText>
        <DesignInput className="content-stretch cursor-pointer flex gap-[10px] h-[44px] items-center px-[14px] py-[10px] relative rounded-[8px] shrink-0 w-full" data-node-id="211:1018" data-name="Input · Interactivo" label="Tipo de cambio (MXN por USD)" initialValue="17.85">
          <div className="absolute inset-0 rounded-[4px]" data-node-id="I211:1018;2024:4518" data-name="Input · DS · Base">
            <div className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]" data-node-id="I211:1018;2024:4518;65:1262" data-name="Base"/>
          </div>
          <DesignText className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] h-full leading-[22px] min-w-px not-italic relative text-[14px] text-[color:var(--text\/1,#1d2129)] text-left" data-node-id="I211:1018;165:2392">
            17.85
          </DesignText>
        </DesignInput>
      </div>
      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)] w-[576px]" data-node-id="211:1024">
        Valor presente de reposición (MXN)
      </DesignText>
      <DesignText className="[word-break:break-word] font-['Poppins:Regular'] leading-[32px] not-italic relative shrink-0 text-[24px] text-[color:var(--text\/1,#1d2129)] w-[576px]" data-node-id="211:1025">
        $1,213.80 MXN
      </DesignText>
      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/2,#4e5969)] w-[576px]" data-node-id="211:1026">
        Precio de compra × tipo de cambio. Se preparará el aviso para Servicios Escolares y Tesorería.
      </DesignText>
      <div className="content-stretch cursor-pointer flex gap-[12px] items-center justify-end overflow-clip relative shrink-0 w-full" data-node-id="211:1027" data-name="Acciones">
        <Buttons buttonText="Cancelar" className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[87px]" type="secondary"/>
        <Buttons buttonText="Registrar y notificar" className="bg-[#00a99b] content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[158px]"/>
      </div>
    </div>);
}
