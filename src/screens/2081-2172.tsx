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
export default function OverlaySeguimientoDeAdquisicion() {
    return (<div className="bg-[var(--bg\/white,white)] content-stretch flex flex-col gap-[20px] items-start overflow-clip pb-[24px] pt-[28px] px-[32px] relative rounded-[16px] size-full" data-node-id="2081:2172" data-name="Overlay · Seguimiento de adquisición">
      <div className="[word-break:break-word] content-stretch flex flex-col font-['Poppins:Medium'] gap-[12px] items-start not-italic overflow-clip relative shrink-0 w-full" data-node-id="2171:2039" data-name="Encabezado · Seguimiento">
        <DesignText className="leading-[32px] relative shrink-0 text-[24px] text-black w-[656px]" data-node-id="2081:2173">
          Seguimiento de adquisición
        </DesignText>
        <DesignText className="leading-[26px] relative shrink-0 text-[18px] text-[color:var(--text\/2,#4e5969)] w-[656px]" data-node-id="2171:2040">
          Diseño de sistemas interactivos
        </DesignText>
      </div>
      <div className="[word-break:break-word] bg-[var(--bg\/2,white)] content-stretch flex gap-[12px] items-center not-italic overflow-clip px-[20px] py-[16px] relative rounded-[10px] shrink-0 w-full" data-node-id="2171:2041" data-name="Solicitud y estado actual">
        <div className="content-stretch flex flex-col gap-[12px] h-[60px] items-start overflow-clip relative shrink-0 w-[280px]" data-node-id="2171:2042" data-name="Folio">
          <DesignText className="font-['Poppins:Regular'] leading-[18px] relative shrink-0 text-[12px] text-[color:var(--text\/2,#4e5969)] w-[280px]" data-node-id="2171:2043">
            Solicitud
          </DesignText>
          <DesignText className="font-['Poppins:Medium'] leading-[26px] relative shrink-0 text-[18px] text-black w-[280px]" data-node-id="2081:2174">
            SOL-2418
          </DesignText>
        </div>
        <div className="content-stretch flex flex-col gap-[12px] h-[60px] items-start overflow-clip relative shrink-0 w-[300px]" data-node-id="2171:2044" data-name="Estado">
          <DesignText className="font-['Poppins:Regular'] leading-[18px] relative shrink-0 text-[12px] text-[color:var(--text\/2,#4e5969)] w-[300px]" data-node-id="2171:2045">
            Estado actual
          </DesignText>
          <DesignText className="font-['Poppins:Medium'] leading-[22px] relative shrink-0 text-[#00a99b] text-[14px] w-[300px]" data-node-id="2081:2175">
            Preparación
          </DesignText>
        </div>
      </div>
      <div className="[word-break:break-word] content-stretch flex gap-[24px] items-start not-italic overflow-clip relative shrink-0 text-[color:var(--text\/2,#4e5969)] w-full" data-node-id="2176:2052" data-name="Solicitante y ejemplares del libro">
        <div className="content-stretch flex flex-col gap-[4px] items-start overflow-clip relative shrink-0 w-[440px]" data-node-id="2176:2053" data-name="Frame">
          <DesignText className="font-['Poppins:Regular'] leading-[18px] relative shrink-0 text-[12px] w-[440px]" data-node-id="2176:2054">
            Solicitante
          </DesignText>
          <DesignText className="font-['Poppins:Medium'] leading-[22px] relative shrink-0 text-[14px] w-[440px]" data-node-id="2176:2055">
            Facultad de Diseño
          </DesignText>
        </div>
        <div className="content-stretch flex flex-col gap-[4px] items-start overflow-clip relative shrink-0 w-[192px]" data-node-id="2176:2056" data-name="Frame">
          <DesignText className="font-['Poppins:Regular'] leading-[18px] relative shrink-0 text-[12px] w-[192px]" data-node-id="2176:2057">
            Ejemplares solicitados
          </DesignText>
          <DesignText className="font-['Poppins:Medium'] leading-[22px] relative shrink-0 text-[14px] w-[192px]" data-node-id="2176:2058">
            1
          </DesignText>
        </div>
      </div>
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[12px] items-start not-italic overflow-clip relative shrink-0 w-full" data-node-id="2171:2046" data-name="Presupuesto informado">
        <DesignText className="font-['Poppins:Medium'] leading-[24px] relative shrink-0 text-[16px] text-[color:var(--text\/1,#1d2129)] w-[656px]" data-node-id="2171:2047">
          Presupuesto del mes
        </DesignText>
        <div className="content-stretch flex gap-[20px] items-start overflow-clip relative shrink-0 w-full" data-node-id="2171:2048" data-name="Resumen presupuestal">
          <div className="content-stretch flex flex-col gap-[4px] h-[50px] items-start overflow-clip relative shrink-0 w-[205px]" data-node-id="2171:2049" data-name="Presupuesto informado">
            <DesignText className="font-['Poppins:Regular'] leading-[18px] relative shrink-0 text-[12px] text-[color:var(--text\/2,#4e5969)] w-[205px]" data-node-id="2171:2050">
              Presupuesto informado
            </DesignText>
            <DesignText className="font-['Poppins:Medium'] leading-[26px] relative shrink-0 text-[18px] text-[color:var(--text\/1,#1d2129)] w-[205px]" data-node-id="2171:2051">
              $120,000 MXN
            </DesignText>
          </div>
          <div className="content-stretch flex flex-col gap-[4px] h-[50px] items-start overflow-clip relative shrink-0 w-[205px]" data-node-id="2171:2052" data-name="Disponible informado">
            <DesignText className="font-['Poppins:Regular'] leading-[18px] relative shrink-0 text-[12px] text-[color:var(--text\/2,#4e5969)] w-[205px]" data-node-id="2171:2053">
              Disponible informado
            </DesignText>
            <DesignText className="font-['Poppins:Medium'] leading-[26px] relative shrink-0 text-[18px] text-[color:var(--text\/1,#1d2129)] w-[205px]" data-node-id="2171:2054">
              $78,450 MXN
            </DesignText>
          </div>
          <div className="content-stretch flex flex-col gap-[4px] h-[50px] items-start overflow-clip relative shrink-0 w-[205px]" data-node-id="2171:2055" data-name="Costo estimado del lote">
            <DesignText className="font-['Poppins:Regular'] leading-[18px] relative shrink-0 text-[12px] text-[color:var(--text\/2,#4e5969)] w-[205px]" data-node-id="2171:2056">
              Costo estimado del lote
            </DesignText>
            <DesignText className="font-['Poppins:Medium'] leading-[26px] relative shrink-0 text-[18px] text-black w-[205px]" data-node-id="2081:3625">
              2340.00
            </DesignText>
          </div>
        </div>
        <DesignText className="font-['Poppins:Regular'] leading-[18px] relative shrink-0 text-[12px] text-[color:var(--text\/2,#4e5969)] w-[656px]" data-node-id="2171:2057">
          El disponible es informativo. Tesorería determina la autorización final.
        </DesignText>
      </div>
      <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-node-id="2171:2058" data-name="Siguiente paso según estado">
        <div className="border border-[var(--border\/2,#e5e6eb)] border-solid content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[20px] relative rounded-[10px] shrink-0 w-full" data-node-id="2171:2059" data-name="Etapa · 1 · Preparar envío">
          <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[24px] not-italic relative shrink-0 text-[16px] text-[color:var(--text\/1,#1d2129)] w-[616px]" data-node-id="2171:2060">
            1 · Preparar envío
          </DesignText>
          <DesignText className="[word-break:break-word] font-['Poppins:Regular'] leading-[22px] not-italic relative shrink-0 text-[14px] text-[color:var(--text\/2,#4e5969)] w-[616px]" data-node-id="2171:2061">
            Compara el costo del lote con el presupuesto disponible. Confirma la revisión antes de remitir la solicitud.
          </DesignText>
          <div className="content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 w-full" data-node-id="2171:2077" data-name="Revisión y envío">
            <Buttons buttonText="Confirmar revisión" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
          </div>
        </div>
      </div>
      <div className="border-[var(--border\/2,#e5e6eb)] border-solid border-t content-stretch cursor-pointer flex items-start justify-between overflow-clip pt-[16px] relative shrink-0 w-full" data-node-id="2171:2082" data-name="Acciones del diálogo">
        <Buttons buttonText="Ver historial" className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
        <Buttons buttonText="Cerrar" className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" type="secondary"/>
      </div>
    </div>);
}
