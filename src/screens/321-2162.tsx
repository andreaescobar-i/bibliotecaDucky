import { DesignInput, DesignSelect, DesignText, DynamicSlot } from "../design-controls";
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
export default function ChatAsistenteDucky() {
    return (<div className="bg-[var(--bg\/5,white)] border border-[var(--border\/2,#e5e6eb)] border-solid content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[24px] relative rounded-[10px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.2)] size-full" data-node-id="321:2162" data-name="Chat · Asistente Ducky">
      <DesignText className="[word-break:break-word] font-['Poppins:Regular'] leading-[28px] not-italic relative shrink-0 text-[20px] text-[color:var(--text\/1,#1d2129)] w-full" data-node-id="321:2167">
        Ducky · Asistente de biblioteca
      </DesignText>
      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[14px] text-[color:var(--text\/2,#4e5969)] w-full" data-node-id="321:2168">
        Resuelve tus dudas sin salir de la pantalla.
      </DesignText>
      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] min-h-[120px] not-italic relative shrink-0 text-[14px] text-[color:var(--text\/2,#4e5969)] w-full" data-node-id="321:2170">
        Hola. Soy Ducky, tu asistente de biblioteca. Escribe tu pregunta o elige uno de los temas de abajo.
      </DesignText>
      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[14px] text-[color:var(--text\/2,#4e5969)] w-full" data-node-id="321:2171">
        Temas frecuentes
      </DesignText>
      <div className="content-stretch cursor-pointer flex gap-[8px] items-start overflow-clip relative shrink-0 w-full" data-node-id="321:2172" data-name="Preguntas frecuentes">
        <Buttons buttonText="Buscar libros" className="border border-[#007566] border-solid content-stretch flex flex-[1_0_0] h-[40px] items-center justify-center min-w-px px-[10px] py-[5px] relative rounded-[8px]"/>
        <Buttons buttonText="Préstamos" className="border border-[#007566] border-solid content-stretch flex flex-[1_0_0] h-[40px] items-center justify-center min-w-px px-[10px] py-[5px] relative rounded-[8px]"/>
      </div>
      <div className="content-stretch cursor-pointer flex gap-[8px] items-start overflow-clip relative shrink-0 w-full" data-node-id="321:2179" data-name="Preguntas frecuentes">
        <Buttons buttonText="Renovaciones" className="border border-[#007566] border-solid content-stretch flex flex-[1_0_0] h-[40px] items-center justify-center min-w-px px-[10px] py-[5px] relative rounded-[8px]"/>
        <Buttons buttonText="Multas y pagos" className="border border-[#007566] border-solid content-stretch flex flex-[1_0_0] h-[40px] items-center justify-center min-w-px px-[10px] py-[5px] relative rounded-[8px]"/>
      </div>
      <div className="content-stretch cursor-pointer flex gap-[8px] items-start overflow-clip relative shrink-0 w-full" data-node-id="321:2186" data-name="Preguntas frecuentes">
        <Buttons buttonText="Mi perfil" className="border border-[#007566] border-solid content-stretch flex flex-[1_0_0] h-[40px] items-center justify-center min-w-px px-[10px] py-[5px] relative rounded-[8px]"/>
        <Buttons buttonText="Mi rol" className="border border-[#007566] border-solid content-stretch flex flex-[1_0_0] h-[40px] items-center justify-center min-w-px px-[10px] py-[5px] relative rounded-[8px]"/>
      </div>
      <DesignText className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[14px] text-[color:var(--text\/2,#4e5969)] w-full" data-node-id="321:2193">
        Escribe tu pregunta
      </DesignText>
      <button className="block cursor-pointer h-[40px] relative rounded-[4px] shrink-0 w-full" data-node-id="321:2194" data-name="Chat · Escribir pregunta">
        <div className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]" data-node-id="I321:2194;65:3042" data-name="Base"/>
        <DesignText className="[word-break:break-word] absolute font-['Poppins:Regular'] leading-[24px] left-[38px] not-italic right-[12px] text-[#cacaca] text-[16px] text-left top-[calc(50%-12px)]" data-node-id="I321:2194;65:3044">
          ​
        </DesignText>
      </button>
      <Buttons buttonText="Enviar" className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-full"/>
      <div className="content-stretch cursor-pointer flex gap-[8px] items-start overflow-clip relative shrink-0 w-full" data-node-id="321:2203" data-name="Controles del chat">
        <Buttons buttonText="Reiniciar" className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"/>
        <Buttons buttonText="Cerrar" className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"/>
      </div>
    </div>);
}
