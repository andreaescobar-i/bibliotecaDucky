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
export default function EtiquetaEjemplar() {
  return (
    <div
      className="bg-[var(--bg\/5,white)] border border-[var(--border\/2,#e5e6eb)] border-solid content-stretch flex flex-col gap-[20px] items-start overflow-clip p-[28px] relative rounded-[10px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.2)] size-full"
      data-node-id="247:3645"
      data-name="Overlay · Etiqueta de ejemplar"
    >
      <DesignText
        className="[word-break:break-word] font-['Poppins:Regular'] leading-[28px] not-italic relative shrink-0 text-[20px] text-[color:var(--text\/1,#1d2129)] w-[540px]"
        data-node-id="247:3646"
      >
        Etiqueta del ejemplar
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[14px] text-[color:var(--text\/1,#1d2129)] w-[540px]"
        data-node-id="247:3647"
      >
        Cien años de soledad
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[14px] text-[color:var(--text\/1,#1d2129)] w-[540px]"
        data-node-id="247:3648"
      >
        Gabriel García Márquez
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[14px] text-[color:var(--text\/1,#1d2129)] w-[540px]"
        data-node-id="247:3649"
      >
        LIT-863.64-GAR
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[14px] text-[color:var(--text\/1,#1d2129)] w-[540px]"
        data-node-id="247:3650"
      >
        Préstamo externo
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)] w-[540px]"
        data-node-id="247:3651"
      >
        EJ-01083
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] min-w-full not-italic relative shrink-0 text-[14px] text-[color:var(--text\/1,#1d2129)] w-[min-content]"
        data-node-id="247:3655"
      >
        Estante LIT · A1
      </DesignText>
      <div
        className="content-stretch flex items-center justify-between relative shrink-0 w-[482px]"
        data-node-id="2123:4342"
      >
        <div
          className="content-stretch flex items-center justify-end overflow-clip relative shrink-0 w-[68px]"
          data-node-id="247:3652"
          data-name="Acciones"
        >
          <Buttons
            buttonText="Cerrar"
            className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[68px]"
            type="secondary"
          />
        </div>
        <Buttons
          buttonText="Ver en catálogo"
          className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
        />
      </div>
    </div>
  );
}
