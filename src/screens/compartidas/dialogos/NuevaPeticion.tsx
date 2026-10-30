/*----
 * Programa: NuevaPeticion.tsx
 * Objetivo: Implementación del módulo NuevaPeticion
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
export default function NuevaPeticion() {
  return (
    <div
      className="bg-[var(--bg\/5,white)] border border-[var(--border\/2,#e5e6eb)] border-solid content-stretch flex flex-col gap-[20px] items-start overflow-clip p-[28px] relative rounded-[10px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.2)] size-full"
      data-node-id="211:1204"
      data-name="Overlay · Nueva petición"
    >
      <DesignText
        className="[word-break:break-word] font-['Poppins:Regular'] leading-[28px] not-italic relative shrink-0 text-[20px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
        data-node-id="211:1205"
      >
        Nueva petición de libro
      </DesignText>
      <div
        className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full"
        data-node-id="211:1206"
        data-name="Título solicitado"
      >
        <DesignText
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
          data-node-id="211:1207"
        >
          Título solicitado
        </DesignText>
        <DesignInput
          className="content-stretch cursor-pointer flex gap-[10px] h-[44px] items-center px-[14px] py-[10px] relative rounded-[8px] shrink-0 w-full"
          data-node-id="211:1208"
          data-name="Input · Interactivo"
          label="Título solicitado"
          initialValue=""
        >
          <div
            className="absolute inset-0 rounded-[4px]"
            data-node-id="I211:1208;2024:4518"
            data-name="Input · DS · Base"
          >
            <div
              className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
              data-node-id="I211:1208;2024:4518;65:1262"
              data-name="Base"
            />
          </div>
          <DesignText
            className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] h-full leading-[22px] min-w-px not-italic relative text-[14px] text-[color:var(--text\/1,#1d2129)] text-left"
            data-node-id="I211:1208;165:2392"
          >
            ​
          </DesignText>
        </DesignInput>
      </div>
      <div
        className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full"
        data-node-id="211:1214"
        data-name="Solicitante o facultad"
      >
        <DesignText
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
          data-node-id="211:1215"
        >
          Solicitante o facultad
        </DesignText>
        <DesignInput
          className="content-stretch cursor-pointer flex gap-[10px] h-[44px] items-center px-[14px] py-[10px] relative rounded-[8px] shrink-0 w-full"
          data-node-id="211:1216"
          data-name="Input · Interactivo"
          label="Solicitante o facultad"
          initialValue=""
        >
          <div
            className="absolute inset-0 rounded-[4px]"
            data-node-id="I211:1216;2024:4518"
            data-name="Input · DS · Base"
          >
            <div
              className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
              data-node-id="I211:1216;2024:4518;65:1262"
              data-name="Base"
            />
          </div>
          <DesignText
            className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] h-full leading-[22px] min-w-px not-italic relative text-[14px] text-[color:var(--text\/1,#1d2129)] text-left"
            data-node-id="I211:1216;165:2392"
          >
            ​
          </DesignText>
        </DesignInput>
      </div>
      <div
        className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full"
        data-node-id="2081:3408"
        data-name="Cantidad solicitada"
      >
        <DesignText
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
          data-node-id="2081:3409"
        >
          Cantidad de ejemplares solicitados
        </DesignText>
        <DesignInput
          className="content-stretch cursor-pointer flex gap-[10px] h-[44px] items-center px-[14px] py-[10px] relative rounded-[8px] shrink-0 w-full"
          data-node-id="2081:3410"
          data-name="Input · Interactivo"
          label="Cantidad de ejemplares solicitados"
          initialValue="1"
        >
          <div
            className="absolute inset-0 rounded-[4px]"
            data-node-id="I2081:3410;2024:4518"
            data-name="Input · DS · Base"
          >
            <div
              className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
              data-node-id="I2081:3410;2024:4518;65:1262"
              data-name="Base"
            />
          </div>
          <DesignText
            className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] h-full leading-[22px] min-w-px not-italic relative text-[14px] text-[color:var(--text\/1,#1d2129)] text-left"
            data-node-id="I2081:3410;165:2392"
          >
            1
          </DesignText>
        </DesignInput>
      </div>
      <div
        className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full"
        data-node-id="211:1222"
        data-name="Costo estimado (MXN)"
      >
        <DesignText
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
          data-node-id="211:1223"
        >
          Costo total estimado del lote (MXN)
        </DesignText>
        <DesignInput
          className="content-stretch cursor-pointer flex gap-[10px] h-[44px] items-center px-[14px] py-[10px] relative rounded-[8px] shrink-0 w-full"
          data-node-id="211:1224"
          data-name="Input · Interactivo"
          label="Costo total estimado del lote (MXN)"
          initialValue=""
        >
          <div
            className="absolute inset-0 rounded-[4px]"
            data-node-id="I211:1224;2024:4518"
            data-name="Input · DS · Base"
          >
            <div
              className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
              data-node-id="I211:1224;2024:4518;65:1262"
              data-name="Base"
            />
          </div>
          <DesignText
            className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] h-full leading-[22px] min-w-px not-italic relative text-[14px] text-[color:var(--text\/1,#1d2129)] text-left"
            data-node-id="I211:1224;165:2392"
          >
            ​
          </DesignText>
        </DesignInput>
      </div>
      <div
        className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full"
        data-node-id="211:1230"
        data-name="Justificación"
      >
        <DesignText
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
          data-node-id="211:1231"
        >
          Justificación
        </DesignText>
        <DesignInput
          className="content-stretch cursor-pointer flex gap-[10px] h-[44px] items-center px-[14px] py-[10px] relative rounded-[8px] shrink-0 w-full"
          data-node-id="211:1232"
          data-name="Input · Interactivo"
          label="Justificación"
          initialValue=""
        >
          <div
            className="absolute inset-0 rounded-[4px]"
            data-node-id="I211:1232;2024:4518"
            data-name="Input · DS · Base"
          >
            <div
              className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
              data-node-id="I211:1232;2024:4518;65:1262"
              data-name="Base"
            />
          </div>
          <DesignText
            className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] h-full leading-[22px] min-w-px not-italic relative text-[14px] text-[color:var(--text\/1,#1d2129)] text-left"
            data-node-id="I211:1232;165:2392"
          >
            ​
          </DesignText>
        </DesignInput>
      </div>
      <div
        className="content-stretch cursor-pointer flex gap-[12px] items-center justify-end overflow-clip relative shrink-0 w-full"
        data-node-id="211:1238"
        data-name="Acciones"
      >
        <Buttons
          buttonText="Cancelar"
          className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[87px]"
          type="secondary"
        />
        <Buttons
          buttonText="Registrar petición"
          className="bg-[#00a99b] content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[145px]"
        />
      </div>
    </div>
  );
}
