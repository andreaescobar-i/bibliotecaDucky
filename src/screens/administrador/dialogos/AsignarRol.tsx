/*----
 * Programa: AsignarRol.tsx
 * Objetivo: Implementación del módulo AsignarRol
 */

import { DesignInput, DesignSelect, DesignText, DynamicSlot } from '../../../design-controls';
export default function AsignarRol() {
  return (
    <div
      className="bg-[#4b4b4b] border border-[var(--border\/2,#e5e6eb)] border-solid content-stretch cursor-pointer flex flex-col items-start overflow-clip relative rounded-[10px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.2)] size-full"
      data-node-id="283:1681"
      data-name="Overlay · Asignar rol"
    >
      <button
        className="bg-[#4b4b4b] content-stretch flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full"
        data-node-id="283:1687"
        data-name="Alumno"
      >
        <DesignText
          className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] leading-[18px] min-w-px not-italic relative text-[12px] text-left text-white"
          data-node-id="I283:1687;7:740"
        >
          Alumno
        </DesignText>
      </button>
      <button
        className="bg-[#4b4b4b] content-stretch flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full"
        data-node-id="283:1690"
        data-name="Maestro"
      >
        <DesignText
          className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] leading-[18px] min-w-px not-italic relative text-[12px] text-left text-white"
          data-node-id="I283:1690;7:740"
        >
          Maestro
        </DesignText>
      </button>
      <button
        className="bg-[#4b4b4b] content-stretch flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full"
        data-node-id="283:1693"
        data-name="Colaborador"
      >
        <DesignText
          className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] leading-[18px] min-w-px not-italic relative text-[12px] text-left text-white"
          data-node-id="I283:1693;7:740"
        >
          Colaborador
        </DesignText>
      </button>
      <button
        className="bg-[#4b4b4b] content-stretch flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full"
        data-node-id="283:1696"
        data-name="Bibliotecario"
      >
        <DesignText
          className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] leading-[18px] min-w-px not-italic relative text-[12px] text-left text-white"
          data-node-id="I283:1696;7:740"
        >
          Bibliotecario
        </DesignText>
      </button>
      <button
        className="bg-[#4b4b4b] content-stretch flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full"
        data-node-id="283:1699"
        data-name="Administrador"
      >
        <DesignText
          className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] leading-[18px] min-w-px not-italic relative text-[12px] text-left text-white"
          data-node-id="I283:1699;7:740"
        >
          Administrador
        </DesignText>
      </button>
      <button
        className="bg-[#4b4b4b] content-stretch flex items-center justify-center overflow-clip px-[10px] py-[5px] relative shrink-0 w-full"
        data-node-id="283:1702"
        data-name="Comprador de libros"
      >
        <DesignText
          className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] leading-[18px] min-w-px not-italic relative text-[12px] text-left text-white"
          data-node-id="I283:1702;7:740"
        >
          Comprador de libros
        </DesignText>
      </button>
      <button
        className="content-stretch flex h-[40px] items-center justify-end px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[175px]"
        data-node-id="283:1705"
        data-name="Cerrar"
      >
        <DesignText
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#25d3c2] text-[12px] text-left whitespace-nowrap"
          data-node-id="I283:1705;27:256"
        >
          Cerrar
        </DesignText>
      </button>
    </div>
  );
}
