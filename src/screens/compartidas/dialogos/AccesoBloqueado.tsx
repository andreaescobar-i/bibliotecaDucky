/*----
 * Programa: AccesoBloqueado.tsx
 * Objetivo: Implementación del módulo AccesoBloqueado
 */

import { DesignInput, DesignSelect, DesignText, DynamicSlot } from '../../../design-controls';
type ButtonsProps = {
  className?: string;
  buttonText?: string;
  icons?: 'false';
  size?: 'small';
  state?: 'Default';
  type?: 'primary';
};
function Buttons({
  className,
  buttonText = 'text',
  icons = 'false',
  size = 'small',
  state = 'Default',
  type = 'primary',
}: ButtonsProps) {
  return (
    <button
      type="button"
      className={
        className ||
        'bg-[#00a99b] content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px]'
      }
      data-node-id="27:182"
    >
      <p
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap"
        data-node-id="27:180"
      >
        {buttonText}
      </p>
    </button>
  );
}
export default function AccesoBloqueado() {
  return (
    <div
      className="bg-[var(--bg\/5,white)] border border-[var(--border\/2,#e5e6eb)] border-solid content-stretch flex flex-col gap-[20px] items-start overflow-clip p-[28px] relative rounded-[10px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.2)] size-full"
      data-node-id="342:1840"
      data-name="Acceso bloqueado · Estatus escolar"
    >
      <DesignText
        className="[word-break:break-word] font-['Poppins:Regular'] leading-[28px] not-italic relative shrink-0 text-[20px] text-[color:var(--text\/1,#1d2129)] w-full"
        data-node-id="342:1841"
      >
        Acceso no disponible
      </DesignText>
      <DynamicSlot
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[0] not-italic relative shrink-0 text-[14px] text-[color:var(--text\/2,#4e5969)] w-full whitespace-pre-wrap"
        data-node-id="342:1842"
      >
        <DesignText className="leading-[22px] mb-0">Estatus escolar: Baja definitiva.</DesignText>
        <DesignText className="leading-[22px] mb-0">​</DesignText>
        <DesignText className="leading-[22px] mb-0">
          El servicio escolar indica que tienes baja definitiva. No puedes acceder a los servicios
          de biblioteca.
        </DesignText>
        <DesignText className="leading-[22px] mb-0">​</DesignText>
        <DesignText className="leading-[22px]">
          Contacta a Servicios Escolares para revisar tu situación.
        </DesignText>
      </DynamicSlot>
      <div
        className="content-stretch flex items-center justify-end overflow-clip relative shrink-0 w-full"
        data-node-id="342:1843"
        data-name="Acciones"
      >
        <Buttons
          buttonText="Volver al inicio de sesión"
          className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[194px]"
        />
      </div>
    </div>
  );
}
