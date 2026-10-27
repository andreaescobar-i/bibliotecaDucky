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
export default function Imprimir() {
  return (
    <div
      className="bg-white content-stretch flex flex-col gap-[20px] items-start overflow-clip pb-[24px] pt-[28px] px-[28px] relative rounded-[16px] size-full"
      data-node-id="2196:2044"
      data-name="Overlay · Imprimir libro"
    >
      <DesignText
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[32px] not-italic relative shrink-0 text-[#212933] text-[24px] w-[544px]"
        data-node-id="2196:2045"
      >
        Imprimir libro
      </DesignText>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Regular'] leading-[22px] not-italic relative shrink-0 text-[#212933] text-[14px] w-[544px]"
        data-node-id="2196:2046"
      >
        Revisa el documento y elige la cantidad de copias.
      </DesignText>
      <div
        className="[word-break:break-word] bg-[#f2f7f7] content-stretch flex flex-col gap-[8px] items-start not-italic overflow-clip p-[16px] relative rounded-[10px] shrink-0 text-[#212933] w-[544px]"
        data-node-id="2196:2047"
        data-name="Documento a imprimir"
      >
        <DesignText
          className="font-['Poppins:Regular'] leading-[18px] relative shrink-0 text-[12px] w-[512px]"
          data-node-id="2196:2048"
        >
          Documento
        </DesignText>
        <DesignText
          className="font-['Poppins:Medium'] leading-[24px] relative shrink-0 text-[16px] w-[512px]"
          data-node-id="2196:2049"
        >
          Introducción a los algoritmos
        </DesignText>
        <DesignText
          className="font-['Poppins:Regular'] leading-[22px] relative shrink-0 text-[14px] w-[512px]"
          data-node-id="2196:2050"
        >
          Thomas H. Cormen
        </DesignText>
      </div>
      <div
        className="content-stretch flex flex-col gap-[16px] items-start overflow-clip relative shrink-0"
        data-node-id="2196:2051"
        data-name="Opciones de impresión"
      >
        <div
          className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start leading-[22px] not-italic overflow-clip relative shrink-0 text-[#212933] text-[14px]"
          data-node-id="2196:2052"
          data-name="Impresora"
        >
          <DesignText
            className="font-['Poppins:Medium'] relative shrink-0 w-[544px]"
            data-node-id="2196:2053"
          >
            Impresora
          </DesignText>
          <DesignText
            className="font-['Poppins:Regular'] relative shrink-0 w-[544px]"
            data-node-id="2196:2054"
          >
            Impresora de la biblioteca
          </DesignText>
        </div>
        <div
          className="[word-break:break-word] content-stretch flex gap-[24px] items-start not-italic overflow-clip relative shrink-0 text-[#212933]"
          data-node-id="2196:2055"
          data-name="Opciones del documento"
        >
          <div
            className="content-stretch flex flex-col gap-[8px] items-start overflow-clip relative shrink-0"
            data-node-id="2196:2056"
            data-name="Papel"
          >
            <DesignText
              className="font-['Poppins:Medium'] leading-[18px] relative shrink-0 text-[12px] w-[240px]"
              data-node-id="2196:2057"
            >
              Tamaño de papel
            </DesignText>
            <DesignText
              className="font-['Poppins:Regular'] leading-[22px] relative shrink-0 text-[14px] w-[240px]"
              data-node-id="2196:2058"
            >
              A4 · Vertical
            </DesignText>
          </div>
          <div
            className="content-stretch flex flex-col gap-[8px] items-start overflow-clip relative shrink-0"
            data-node-id="2196:2059"
            data-name="Páginas"
          >
            <DesignText
              className="font-['Poppins:Medium'] leading-[18px] relative shrink-0 text-[12px] w-[280px]"
              data-node-id="2196:2060"
            >
              Páginas
            </DesignText>
            <DesignText
              className="font-['Poppins:Regular'] leading-[22px] relative shrink-0 text-[14px] w-[280px]"
              data-node-id="2196:2061"
            >
              Todas · 1 página de muestra
            </DesignText>
          </div>
        </div>
        <div
          className="content-stretch flex gap-[16px] items-center overflow-clip relative shrink-0"
          data-node-id="2196:2062"
          data-name="Cantidad de copias"
        >
          <DesignText
            className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#212933] text-[14px] w-[100px]"
            data-node-id="2196:2063"
          >
            Copias
          </DesignText>
          <DesignText
            className="[word-break:break-word] font-['Poppins:Medium'] leading-[26px] not-italic relative shrink-0 text-[#212933] text-[18px] w-[48px]"
            data-node-id="2196:2064"
          >
            1
          </DesignText>
          <div
            className="content-stretch cursor-pointer flex gap-[8px] items-start overflow-clip relative shrink-0"
            data-node-id="2196:2065"
            data-name="Seleccionar copias"
          >
            <Buttons
              buttonText="1"
              className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
              type="secondary"
            />
            <Buttons
              buttonText="2"
              className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
              type="secondary"
            />
            <Buttons
              buttonText="3"
              className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
              type="secondary"
            />
          </div>
        </div>
      </div>
      <DesignText
        className="[word-break:break-word] font-['Poppins:Regular'] leading-[18px] not-italic relative shrink-0 text-[#212933] text-[12px] w-[544px]"
        data-node-id="2196:2075"
      >
        Demostración del flujo de impresión del prototipo.
      </DesignText>
      <div
        className="content-stretch cursor-pointer flex gap-[12px] items-start justify-end overflow-clip relative shrink-0 w-[544px]"
        data-node-id="2196:2094"
        data-name="Acciones de impresión"
      >
        <Buttons
          buttonText="Cancelar"
          className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
          type="secondary"
        />
        <Buttons
          buttonText="Imprimir"
          className="bg-[#00a99b] content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0"
        />
      </div>
    </div>
  );
}
