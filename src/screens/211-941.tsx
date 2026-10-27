import { DesignInput, DesignSelect, DesignText, DynamicSlot } from '../design-controls';
export default function OverlayCambiarRol() {
  return (
    <div
      className="bg-[#4b4b4b] border border-[var(--border\/2,#e5e6eb)] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[10px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.2)] size-full"
      data-node-id="211:941"
      data-name="Overlay · Cambiar rol"
    >
      <button
        className="bg-[#4b4b4b] content-stretch cursor-pointer flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full"
        data-node-id="211:943"
        data-name="Alumno"
      >
        <DesignText
          className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] leading-[18px] min-w-px not-italic relative text-[12px] text-left text-white"
          data-node-id="I211:943;7:740"
        >
          Alumno
        </DesignText>
      </button>
      <button
        className="bg-[#4b4b4b] content-stretch cursor-pointer flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full"
        data-node-id="264:1919"
        data-name="Maestro"
      >
        <DesignText
          className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] leading-[18px] min-w-px not-italic relative text-[12px] text-left text-white"
          data-node-id="I264:1919;7:740"
        >
          Maestro
        </DesignText>
      </button>
      <button
        className="bg-[#4b4b4b] content-stretch cursor-pointer flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full"
        data-node-id="264:1922"
        data-name="Colaborador"
      >
        <DesignText
          className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] leading-[18px] min-w-px not-italic relative text-[12px] text-left text-white"
          data-node-id="I264:1922;7:740"
        >
          Colaborador
        </DesignText>
      </button>
      <button
        className="bg-[#4b4b4b] content-stretch cursor-pointer flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full"
        data-node-id="211:946"
        data-name="Bibliotecario"
      >
        <DesignText
          className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] leading-[18px] min-w-px not-italic relative text-[12px] text-left text-white"
          data-node-id="I211:946;7:740"
        >
          Bibliotecario
        </DesignText>
      </button>
      <button
        className="bg-[#4b4b4b] content-stretch cursor-pointer flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full"
        data-node-id="211:952"
        data-name="Administrador"
      >
        <DesignText
          className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Medium'] leading-[18px] min-w-px not-italic relative text-[12px] text-left text-white"
          data-node-id="I211:952;7:740"
        >
          Administrador
        </DesignText>
      </button>
      <button
        className="bg-[#4b4b4b] content-stretch cursor-pointer flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full"
        data-node-id="211:955"
        data-name="Comprador de libros"
      >
        <DesignText
          className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] leading-[18px] min-w-px not-italic relative text-[12px] text-left text-white"
          data-node-id="I211:955;7:740"
        >
          Comprador de libros
        </DesignText>
      </button>
      <div
        className="content-stretch flex items-center justify-end overflow-clip relative shrink-0 w-full"
        data-node-id="211:958"
        data-name="Acciones"
      >
        <button
          className="content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[76px]"
          data-node-id="211:959"
          data-name="Cancelar"
        >
          <DesignText
            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#25d3c2] text-[12px] text-left whitespace-nowrap"
            data-node-id="I211:959;27:256"
          >
            Cancelar
          </DesignText>
        </button>
      </div>
    </div>
  );
}
