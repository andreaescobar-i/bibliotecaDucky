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
export default function EnviosCatalogo() {
  return (
    <div
      className="bg-[var(--bg\/white,white)] content-stretch flex flex-col gap-[20px] items-start overflow-clip pb-[24px] pt-[28px] px-[28px] relative rounded-[16px] size-full"
      data-node-id="2189:2119"
      data-name="Overlay · Enviados al catálogo"
    >
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[32px] not-italic relative shrink-0 text-[24px] text-[color:var(--text\/1,#1d2129)] w-[864px]"
        data-node-id="2189:2120"
      >
        Enviados al catálogo
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Regular'] leading-[22px] not-italic relative shrink-0 text-[14px] text-[color:var(--text\/1,#1d2129)] w-[864px]"
        data-node-id="2189:2121"
      >
        Consulta los libros entregados al encargado del catálogo y su avance de registro.
      </DesignText>
      <div
        className="[word-break:break-word] content-stretch flex font-['Poppins:Medium'] gap-[16px] items-start leading-[18px] not-italic overflow-clip relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)]"
        data-node-id="2189:2122"
        data-name="Encabezados de entregas"
      >
        <DesignText className="relative shrink-0 w-[344px]" data-node-id="2189:2123">
          Libro y solicitud
        </DesignText>
        <DesignText className="relative shrink-0 w-[210px]" data-node-id="2189:2124">
          Lote recibido
        </DesignText>
        <DesignText className="relative shrink-0 w-[278px]" data-node-id="2189:2125">
          Registro en catálogo
        </DesignText>
      </div>
      <div
        className="content-stretch flex flex-col h-[380px] items-start overflow-x-clip overflow-y-auto relative shrink-0 w-[864px]"
        data-node-id="2189:2126"
        data-name="Lista de libros entregados"
      >
        <DesignText
          className="[word-break:break-word] font-['Poppins:Regular'] leading-[22px] not-italic relative shrink-0 text-[14px] text-[color:var(--text\/1,#1d2129)] w-[840px]"
          data-node-id="2189:2127"
        >
          Aún no hay libros entregados al encargado del catálogo. Las entregas confirmadas
          aparecerán aquí.
        </DesignText>
      </div>
      <Buttons
        buttonText="Cerrar"
        className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
      />
    </div>
  );
}
