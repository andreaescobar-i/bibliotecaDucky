import { DesignInput, DesignSelect, DesignText, DynamicSlot } from '../design-controls';
type ButtonsProps = {
  className?: string;
  buttonText?: string;
  icons?: 'false';
  size?: 'small';
  state?: 'Default';
  type?: 'secondary';
};
function Buttons({
  className,
  buttonText = 'text',
  icons = 'false',
  size = 'small',
  state = 'Default',
  type = 'secondary',
}: ButtonsProps) {
  return (
    <button
      type="button"
      className={
        className ||
        'border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px]'
      }
      data-node-id="27:255"
    >
      <p
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#007566] text-[12px] whitespace-nowrap"
        data-node-id="27:256"
      >
        {buttonText}
      </p>
    </button>
  );
}
export default function OverlayListaDeSuspendidos() {
  return (
    <div
      className="bg-[var(--bg\/5,white)] border border-[var(--border\/2,#e5e6eb)] border-solid content-stretch flex flex-col gap-[20px] items-start overflow-clip p-[28px] relative rounded-[10px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.2)] size-full"
      data-node-id="211:1194"
      data-name="Overlay · Lista de suspendidos"
    >
      <DesignText
        className="[word-break:break-word] font-['Poppins:Regular'] leading-[28px] not-italic relative shrink-0 text-[20px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
        data-node-id="211:1195"
      >
        Lista de alumnos suspendidos
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/2,#4e5969)] w-[576px]"
        data-node-id="211:1196"
      >
        Corte: 12 oct 2025 · Periodo de exámenes
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[14px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
        data-node-id="211:1197"
      >
        Ana Torres Ruiz · A01678234 · 2 libros · $120.00
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[14px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
        data-node-id="211:1198"
      >
        Diego Sánchez Paz · A01882340 · 1 libro · $0.00
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[14px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
        data-node-id="211:1199"
      >
        Elena Cruz Lara · A01455210 · 0 libros · $240.00
      </DesignText>
      <div
        className="content-stretch flex items-center justify-end overflow-clip relative shrink-0 w-full"
        data-node-id="211:1200"
        data-name="Acciones"
      >
        <Buttons
          buttonText="Cerrar"
          className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[68px]"
        />
      </div>
    </div>
  );
}
