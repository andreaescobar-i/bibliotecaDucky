/*----
 * Programa: BajaLibroCompleto.tsx
 * Objetivo: Implementación del módulo BajaLibroCompleto
 */

import { DesignInput, DesignSelect, DesignText, DynamicSlot } from '../../../design-controls';
type ButtonsProps = {
  className?: string;
  buttonText?: string;
  icons?: 'false';
  size?: 'small';
  state?: 'Default';
  type?: 'primary' | 'secondary';
};
function Buttons({
  className,
  buttonText = 'text',
  icons = 'false',
  size = 'small',
  state = 'Default',
  type = 'primary',
}: ButtonsProps) {
  const isSecondary = type === 'secondary';
  return (
    <button
      type="button"
      className={
        className ||
        `content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] ${isSecondary ? 'border border-[#007566] border-solid' : 'bg-[#00a99b]'}`
      }
      id={isSecondary ? 'node-27_255' : 'node-27_182'}
    >
      {type === 'primary' && (
        <p
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap"
          data-node-id="27:180"
        >
          {buttonText}
        </p>
      )}
      {isSecondary && (
        <p
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#007566] text-[12px] whitespace-nowrap"
          data-node-id="27:256"
        >
          {buttonText}
        </p>
      )}
    </button>
  );
}
export default function BajaLibroCompleto() {
  return (
    <div
      className="bg-[var(--bg\/5,white)] border border-[var(--border\/2,#e5e6eb)] border-solid content-stretch flex flex-col gap-[20px] items-start overflow-clip p-[28px] relative rounded-[10px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.2)] size-full"
      data-node-id="2114:2308"
      data-name="Overlay · Dar de baja libro completo"
    >
      <DesignText
        className="[word-break:break-word] font-['Poppins:Regular'] leading-[28px] not-italic relative shrink-0 text-[20px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
        data-node-id="2114:2309"
      >
        Dar de baja el libro completo
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] min-w-full not-italic relative shrink-0 text-[14px] text-[color:var(--text\/1,#1d2129)] w-[min-content]"
        data-node-id="2114:2310"
      >
        Cien años de soledad
      </DesignText>
      <div
        className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full"
        data-node-id="2114:2311"
        data-name="Motivo de baja"
      >
        <DesignText
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
          data-node-id="2114:2312"
        >
          Motivo de baja
        </DesignText>
        <DesignSelect
          className="content-stretch cursor-pointer flex gap-[10px] h-[44px] items-center px-[14px] py-[10px] relative rounded-[8px] shrink-0 w-full"
          data-node-id="2114:2313"
          data-name="Input · Interactivo"
          label="Motivo de baja"
          initialValue="Perdido"
        >
          <div
            className="absolute inset-0 rounded-[4px]"
            data-node-id="I2114:2313;2024:4518"
            data-name="Input · DS · Base"
          >
            <div
              className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
              data-node-id="I2114:2313;2024:4518;65:1262"
              data-name="Base"
            />
          </div>
          <DesignText
            className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] h-full leading-[22px] min-w-px not-italic relative text-[14px] text-[color:var(--text\/1,#1d2129)] text-left"
            data-node-id="I2114:2313;165:2392"
          >
            Perdido
          </DesignText>
        </DesignSelect>
      </div>
      <div
        className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full"
        data-node-id="2114:2314"
        data-name="Observaciones"
      >
        <DesignText
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
          data-node-id="2114:2315"
        >
          Observaciones
        </DesignText>
        <DesignInput
          className="content-stretch cursor-pointer flex gap-[10px] h-[44px] items-center px-[14px] py-[10px] relative rounded-[8px] shrink-0 w-full"
          data-node-id="2114:2316"
          data-name="Input · Interactivo"
          label="Observaciones"
          initialValue=""
        >
          <div
            className="absolute inset-0 rounded-[4px]"
            data-node-id="I2114:2316;2024:4518"
            data-name="Input · DS · Base"
          >
            <div
              className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
              data-node-id="I2114:2316;2024:4518;65:1262"
              data-name="Base"
            />
          </div>
          <DesignText
            className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] h-full leading-[22px] min-w-px not-italic relative text-[14px] text-[color:var(--text\/1,#1d2129)] text-left"
            data-node-id="I2114:2316;165:2392"
          >
            ​
          </DesignText>
        </DesignInput>
      </div>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/2,#4e5969)] w-[576px]"
        data-node-id="2114:2317"
      >
        Se darán de baja el libro y todos sus ejemplares. Se conservarán sus registros e historial.
      </DesignText>
      <div
        className="content-stretch cursor-pointer flex gap-[12px] items-center justify-end overflow-clip relative shrink-0 w-full"
        data-node-id="2114:2318"
        data-name="Acciones"
      >
        <Buttons
          buttonText="Cancelar"
          className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[87px]"
          type="secondary"
        />
        <Buttons
          buttonText="Confirmar baja"
          className="bg-[#00a99b] content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[128px]"
        />
      </div>
    </div>
  );
}
