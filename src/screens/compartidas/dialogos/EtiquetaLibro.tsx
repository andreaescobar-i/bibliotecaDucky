import { DesignInput, DesignSelect, DesignText, DynamicSlot } from '../../../design-controls';
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
export default function EtiquetaLibro() {
  return (
    <div
      className="bg-[var(--bg\/5,white)] border border-[var(--border\/2,#e5e6eb)] border-solid content-stretch flex flex-col gap-[20px] items-start overflow-clip p-[28px] relative rounded-[10px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.2)] size-full"
      data-node-id="211:1135"
      data-name="Overlay · Etiqueta del libro"
    >
      <DesignText
        className="[word-break:break-word] font-['Poppins:Regular'] leading-[28px] not-italic relative shrink-0 text-[20px] text-[color:var(--text\/1,#1d2129)] w-[397px]"
        data-node-id="211:1136"
      >
        Etiqueta del ejemplar
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#8e8e8e] text-[14px] w-[540px]"
        data-node-id="211:1137"
      >
        Cien años de soledad
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#8e8e8e] text-[14px] w-[540px]"
        data-node-id="211:1138"
      >
        Gabriel García Márquez
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#8e8e8e] text-[14px] w-[540px]"
        data-node-id="211:1139"
      >
        LIT-863.64-GAR
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#8e8e8e] text-[14px] w-[540px]"
        data-node-id="211:1140"
      >
        Préstamo externo
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] w-[540px]"
        data-node-id="211:1141"
      >
        Ejemplar: EJ-01083 · Biblioteca Universidad Ducky
      </DesignText>
      <div
        className="content-stretch flex items-center justify-end overflow-clip relative shrink-0 w-full"
        data-node-id="211:1142"
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
