import { DesignInput, DesignSelect, DesignText, DynamicSlot } from '../design-controls';
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
export default function OverlayHistorialDeAdquisiciones() {
  return (
    <div
      className="bg-white content-stretch flex flex-col gap-[var(--spacing-card,16px)] items-start px-[32px] py-[24px] relative size-full"
      data-node-id="2081:2208"
      data-name="Overlay · Historial de adquisiciones"
    >
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[28px] not-italic relative shrink-0 text-[20px] text-black w-[576px]"
        data-node-id="2081:2209"
      >
        Historial de solicitudes y entregas
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Regular'] leading-[22px] not-italic relative shrink-0 text-[14px] text-black w-[576px]"
        data-node-id="2081:2210"
      >
        SOL-2418 · Solicitud preparada · Facultad de Diseño
      </DesignText>
      <Buttons
        buttonText="Cerrar"
        className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
      />
    </div>
  );
}
