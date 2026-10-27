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
export default function OverlayRecuperarAcceso() {
  return (
    <div
      className="bg-[var(--bg\/5,white)] border border-[var(--border\/2,#e5e6eb)] border-solid content-stretch flex flex-col gap-[20px] items-start overflow-clip p-[28px] relative rounded-[10px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.2)] size-full"
      data-node-id="211:1295"
      data-name="Overlay · Recuperar acceso"
    >
      <DesignText
        className="[word-break:break-word] font-['Poppins:Regular'] leading-[28px] not-italic relative shrink-0 text-[20px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
        data-node-id="211:1296"
      >
        Recuperar acceso
      </DesignText>
      <div
        className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full"
        data-node-id="211:1297"
        data-name="Usuario institucional"
      >
        <DesignText
          className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
          data-node-id="211:1298"
        >
          Usuario institucional
        </DesignText>
        <DesignInput
          className="content-stretch cursor-pointer flex gap-[10px] h-[44px] items-center px-[14px] py-[10px] relative rounded-[8px] shrink-0 w-full"
          data-node-id="211:1299"
          data-name="Input · Interactivo"
          label="Usuario institucional"
          initialValue=""
        >
          <div
            className="absolute inset-0 rounded-[4px]"
            data-node-id="I211:1299;2024:4518"
            data-name="Input · DS · Base"
          >
            <div
              className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
              data-node-id="I211:1299;2024:4518;65:1262"
              data-name="Base"
            />
          </div>
          <DesignText
            className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] h-full leading-[22px] min-w-px not-italic relative text-[14px] text-[color:var(--text\/1,#1d2129)] text-left"
            data-node-id="I211:1299;165:2392"
          >
            ​
          </DesignText>
        </DesignInput>
      </div>
      <div
        className="content-stretch flex items-center justify-end overflow-clip relative shrink-0 w-full"
        data-node-id="211:1305"
        data-name="Acciones"
      >
        <Buttons
          buttonText="Continuar"
          className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[91px]"
        />
      </div>
    </div>
  );
}
