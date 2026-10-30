/*----
 * Programa: EntregarCatalogo.tsx
 * Objetivo: Implementación del módulo EntregarCatalogo
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
export default function EntregarCatalogo() {
  return (
    <div
      className="bg-white content-stretch flex flex-col gap-[var(--spacing-card,16px)] items-start px-[32px] py-[24px] relative size-full"
      data-node-id="2081:2189"
      data-name="Overlay · Entrega al encargado del catálogo"
    >
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[28px] not-italic relative shrink-0 text-[20px] text-black w-[576px]"
        data-node-id="2081:2190"
      >
        Entrega de libros recibidos
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Regular'] leading-[22px] not-italic relative shrink-0 text-[14px] text-black w-[576px]"
        data-node-id="2081:2191"
      >
        SOL-2418
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[14px] text-[color:var(--text\/2,#4e5969)] w-[576px]"
        data-node-id="2176:2060"
      >
        Diseño de sistemas interactivos
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Regular'] leading-[22px] not-italic relative shrink-0 text-[14px] text-black w-[576px]"
        data-node-id="2081:2192"
      >
        Folio de recepción
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Regular'] leading-[22px] not-italic relative shrink-0 text-[14px] text-black w-[576px]"
        data-node-id="2081:2193"
      >
        ​
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Regular'] leading-[22px] not-italic relative shrink-0 text-[14px] text-black w-[576px]"
        data-node-id="2081:2194"
      >
        Cantidad recibida / entregada
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Regular'] leading-[22px] not-italic relative shrink-0 text-[14px] text-black w-[576px]"
        data-node-id="2081:2195"
      >
        1
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Regular'] leading-[22px] not-italic relative shrink-0 text-[14px] text-black w-[576px]"
        data-node-id="2081:2196"
      >
        Fecha de recepción
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Regular'] leading-[22px] not-italic relative shrink-0 text-[14px] text-black w-[576px]"
        data-node-id="2081:2197"
      >
        12 oct 2025
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Regular'] leading-[22px] not-italic relative shrink-0 text-[14px] text-black w-[576px]"
        data-node-id="2081:2198"
      >
        Destino: encargado del catálogo. Se entrega el lote recibido completo; el alta en catálogo
        la realiza su encargado.
      </DesignText>
      <Buttons
        buttonText="Confirmar entrega a catálogo"
        className="bg-[#00a99b] content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
      />
      <Buttons
        buttonText="Volver"
        className="border border-[#007566] border-solid content-stretch cursor-pointer flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
        type="secondary"
      />
    </div>
  );
}
