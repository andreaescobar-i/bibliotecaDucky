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
export default function OverlayConfirmacionDeImpresion() {
  return (
    <div
      className="bg-white content-stretch flex flex-col gap-[20px] items-start overflow-clip pb-[24px] pt-[28px] px-[28px] relative rounded-[16px] size-full"
      data-node-id="2196:2076"
      data-name="Overlay · Confirmación de impresión"
    >
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[32px] not-italic relative shrink-0 text-[#212933] text-[24px] w-[504px]"
        data-node-id="2196:2077"
      >
        Impresión preparada
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Regular'] leading-[22px] not-italic relative shrink-0 text-[#212933] text-[14px] w-[504px]"
        data-node-id="2196:2078"
      >
        La configuración se ha confirmado para este libro.
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[26px] not-italic relative shrink-0 text-[#212933] text-[18px] w-[504px]"
        data-node-id="2196:2079"
      >
        Introducción a los algoritmos
      </DesignText>
      <div
        className="[word-break:break-word] content-stretch flex gap-[8px] items-start leading-[22px] not-italic overflow-clip relative shrink-0 text-[#212933] text-[14px]"
        data-node-id="2196:2080"
        data-name="Copias preparadas"
      >
        <DesignText
          className="font-['Poppins:Medium'] relative shrink-0 w-[60px]"
          data-node-id="2196:2081"
        >
          Copias:
        </DesignText>
        <DesignText
          className="font-['Poppins:Regular'] relative shrink-0 w-[100px]"
          data-node-id="2196:2082"
        >
          1
        </DesignText>
      </div>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Regular'] leading-[18px] not-italic relative shrink-0 text-[#212933] text-[12px] w-[504px]"
        data-node-id="2196:2083"
      >
        Esta confirmación simula el envío a la impresora.
      </DesignText>
      <Buttons
        buttonText="Entendido"
        className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
      />
    </div>
  );
}
