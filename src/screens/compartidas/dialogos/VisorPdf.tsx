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
export default function VisorPdf() {
  return (
    <div
      className="bg-white content-stretch flex flex-col gap-[20px] items-start overflow-clip pb-[24px] pt-[28px] px-[28px] relative rounded-[16px] size-full"
      data-node-id="2196:2026"
      data-name="Overlay · Visor PDF del libro"
    >
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[32px] not-italic relative shrink-0 text-[#212933] text-[24px] w-[704px]"
        data-node-id="2196:2027"
      >
        Visor PDF
      </DesignText>
      <div
        className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start not-italic overflow-clip relative shrink-0 text-[#212933]"
        data-node-id="2196:2028"
        data-name="Libro seleccionado"
      >
        <DesignText
          className="font-['Poppins:Regular'] leading-[18px] relative shrink-0 text-[12px] w-[704px]"
          data-node-id="2196:2029"
        >
          Libro
        </DesignText>
        <DesignText
          className="font-['Poppins:Medium'] leading-[24px] relative shrink-0 text-[16px] w-[704px]"
          data-node-id="2196:2030"
        >
          Introducción a los algoritmos
        </DesignText>
      </div>
      <div
        className="bg-[#f2f7f7] content-stretch flex flex-col h-[370px] items-center overflow-x-clip overflow-y-auto px-[40px] py-[20px] relative rounded-[10px] shrink-0 w-[704px]"
        data-node-id="2196:2031"
        data-name="Área de lectura PDF"
      >
        <div
          className="[word-break:break-word] bg-white border border-[#d9e3e5] border-solid content-stretch flex flex-col gap-[18px] items-start not-italic overflow-clip p-[32px] relative shrink-0 text-[#212933] w-[624px]"
          data-node-id="2196:2032"
          data-name="Página de muestra · Ficha del libro"
        >
          <DesignText
            className="font-['Poppins:Medium'] leading-[18px] relative shrink-0 text-[12px] w-[560px]"
            data-node-id="2196:2033"
          >
            BIBLIOTECA DUCKY
          </DesignText>
          <DesignText
            className="font-['Poppins:Medium'] leading-[32px] relative shrink-0 text-[24px] w-[560px]"
            data-node-id="2196:2034"
          >
            Introducción a los algoritmos
          </DesignText>
          <DesignText
            className="font-['Poppins:Regular'] leading-[24px] relative shrink-0 text-[16px] w-[560px]"
            data-node-id="2196:2035"
          >
            Thomas H. Cormen
          </DesignText>
          <div
            className="content-stretch flex gap-[8px] items-start leading-[18px] overflow-clip relative shrink-0 text-[12px]"
            data-node-id="2196:2036"
            data-name="ISBN"
          >
            <DesignText
              className="font-['Poppins:Medium'] relative shrink-0 w-[44px]"
              data-node-id="2196:2037"
            >
              ISBN:
            </DesignText>
            <DesignText
              className="font-['Poppins:Regular'] relative shrink-0 w-[508px]"
              data-node-id="2196:2038"
            >
              No registrado
            </DesignText>
          </div>
          <DesignText
            className="font-['Poppins:Medium'] leading-[22px] relative shrink-0 text-[14px] w-[560px]"
            data-node-id="2196:2039"
          >
            Descripción
          </DesignText>
          <DesignText
            className="font-['Poppins:Regular'] leading-[22px] relative shrink-0 text-[14px] w-[560px]"
            data-node-id="2196:2040"
          >
            ​
          </DesignText>
        </div>
      </div>
      <div
        className="[word-break:break-word] content-stretch flex font-['Poppins:Regular'] items-start justify-between leading-[18px] not-italic overflow-clip relative shrink-0 text-[#212933] text-[12px] w-[704px]"
        data-node-id="2196:2041"
        data-name="Estado del visor"
      >
        <DesignText className="relative shrink-0 w-[150px]" data-node-id="2196:2042">
          Página 1 de 1
        </DesignText>
        <DesignText className="relative shrink-0 w-[340px]" data-node-id="2196:2043">
          Vista previa de muestra del prototipo
        </DesignText>
      </div>
      <div
        className="content-stretch cursor-pointer flex gap-[12px] items-start justify-end overflow-clip relative shrink-0 w-[704px]"
        data-node-id="2196:2087"
        data-name="Acciones del visor"
      >
        <Buttons
          buttonText="Cerrar"
          className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
          type="secondary"
        />
        <Buttons
          buttonText="Mandar a imprimir"
          className="bg-[#00a99b] content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
        />
      </div>
    </div>
  );
}
