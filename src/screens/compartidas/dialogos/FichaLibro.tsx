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
export default function FichaLibro() {
  return (
    <div
      className="bg-[var(--bg\/5,white)] border border-[var(--border\/2,#e5e6eb)] border-solid content-stretch flex flex-col gap-[20px] items-start overflow-clip p-[28px] relative rounded-[10px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.2)] size-full"
      data-node-id="211:1034"
      data-name="Overlay · Ficha bibliográfica"
    >
      <DesignText
        className="[word-break:break-word] font-['Poppins:Regular'] leading-[28px] not-italic relative shrink-0 text-[20px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
        data-node-id="211:1035"
      >
        Datos bibliográficos
      </DesignText>
      <div
        className="content-stretch flex flex-col gap-[16px] h-[440px] items-start overflow-x-clip overflow-y-auto relative shrink-0 w-[664px]"
        data-node-id="2127:2263"
        data-name="Campos bibliográficos y recepción"
      >
        <div
          className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full"
          data-node-id="211:1036"
          data-name="Título"
        >
          <DesignText
            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
            data-node-id="211:1037"
          >
            Título
          </DesignText>
          <DesignInput
            className="content-stretch cursor-pointer flex gap-[10px] h-[44px] items-center px-[14px] py-[10px] relative rounded-[8px] shrink-0 w-full"
            data-node-id="211:1038"
            data-name="Input · Interactivo"
            label="Título"
            initialValue="Cien años de soledad"
          >
            <div
              className="absolute inset-0 rounded-[4px]"
              data-node-id="I211:1038;2024:4518"
              data-name="Input · DS · Base"
            >
              <div
                className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
                data-node-id="I211:1038;2024:4518;65:1262"
                data-name="Base"
              />
            </div>
            <DesignText
              className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] h-full leading-[22px] min-w-px not-italic relative text-[14px] text-[color:var(--text\/1,#1d2129)] text-left"
              data-node-id="I211:1038;165:2392"
            >
              Cien años de soledad
            </DesignText>
          </DesignInput>
        </div>
        <div
          className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full"
          data-node-id="211:1044"
          data-name="Autor"
        >
          <DesignText
            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
            data-node-id="211:1045"
          >
            Autor
          </DesignText>
          <DesignInput
            className="content-stretch cursor-pointer flex gap-[10px] h-[44px] items-center px-[14px] py-[10px] relative rounded-[8px] shrink-0 w-full"
            data-node-id="211:1046"
            data-name="Input · Interactivo"
            label="Autor"
            initialValue="Gabriel García Márquez"
          >
            <div
              className="absolute inset-0 rounded-[4px]"
              data-node-id="I211:1046;2024:4518"
              data-name="Input · DS · Base"
            >
              <div
                className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
                data-node-id="I211:1046;2024:4518;65:1262"
                data-name="Base"
              />
            </div>
            <DesignText
              className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] h-full leading-[22px] min-w-px not-italic relative text-[14px] text-[color:var(--text\/1,#1d2129)] text-left"
              data-node-id="I211:1046;165:2392"
            >
              Gabriel García Márquez
            </DesignText>
          </DesignInput>
        </div>
        <div
          className="content-stretch flex items-center justify-between relative shrink-0 w-full"
          data-node-id="308:3082"
        >
          <div
            className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-[320px]"
            data-node-id="211:1052"
            data-name="Editorial"
          >
            <DesignText
              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
              data-node-id="211:1053"
            >
              Editorial
            </DesignText>
            <DesignInput
              className="content-stretch cursor-pointer flex gap-[10px] h-[44px] items-center px-[14px] py-[10px] relative rounded-[8px] shrink-0 w-full"
              data-node-id="211:1054"
              data-name="Input · Interactivo"
              label="Editorial"
              initialValue="Diana"
            >
              <div
                className="absolute inset-0 rounded-[4px]"
                data-node-id="I211:1054;2024:4518"
                data-name="Input · DS · Base"
              >
                <div
                  className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
                  data-node-id="I211:1054;2024:4518;65:1262"
                  data-name="Base"
                />
              </div>
              <DesignText
                className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] h-full leading-[22px] min-w-px not-italic relative text-[14px] text-[color:var(--text\/1,#1d2129)] text-left"
                data-node-id="I211:1054;165:2392"
              >
                Diana
              </DesignText>
            </DesignInput>
          </div>
          <div
            className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-[320px]"
            data-node-id="211:1060"
            data-name="Tema"
          >
            <DesignText
              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
              data-node-id="211:1061"
            >
              Tema
            </DesignText>
            <DesignSelect
              className="content-stretch cursor-pointer flex gap-[10px] h-[44px] items-center px-[14px] py-[10px] relative rounded-[8px] shrink-0 w-full"
              data-node-id="211:1062"
              data-name="Input · Interactivo"
              label="Tema"
              initialValue="Literatura"
            >
              <div
                className="absolute inset-0 rounded-[4px]"
                data-node-id="I211:1062;2024:4518"
                data-name="Input · DS · Base"
              >
                <div
                  className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
                  data-node-id="I211:1062;2024:4518;65:1262"
                  data-name="Base"
                />
              </div>
              <DesignText
                className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] h-full leading-[22px] min-w-px not-italic relative text-[14px] text-[color:var(--text\/1,#1d2129)] text-left"
                data-node-id="I211:1062;165:2392"
              >
                Literatura
              </DesignText>
            </DesignSelect>
          </div>
        </div>
        <div
          className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full"
          data-node-id="211:1089"
          data-name="Clave"
        >
          <DesignText
            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
            data-node-id="211:1090"
          >
            Clave
          </DesignText>
          <DesignInput
            className="content-stretch cursor-pointer flex gap-[10px] h-[44px] items-center px-[14px] py-[10px] relative rounded-[8px] shrink-0 w-full"
            data-node-id="211:1091"
            data-name="Input · Interactivo"
            label="Clave"
            initialValue="LIT-863.64-GAR"
          >
            <div
              className="absolute inset-0 rounded-[4px]"
              data-node-id="I211:1091;2024:4518"
              data-name="Input · DS · Base"
            >
              <div
                className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
                data-node-id="I211:1091;2024:4518;65:1262"
                data-name="Base"
              />
            </div>
            <DesignText
              className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] h-full leading-[22px] min-w-px not-italic relative text-[14px] text-[color:var(--text\/1,#1d2129)] text-left"
              data-node-id="I211:1091;165:2392"
            >
              LIT-863.64-GAR
            </DesignText>
          </DesignInput>
        </div>
        <div
          className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full"
          data-node-id="2135:2272"
          data-name="ISBN"
        >
          <DesignText
            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
            data-node-id="2135:2273"
          >
            ISBN
          </DesignText>
          <DesignInput
            className="content-stretch cursor-pointer flex gap-[10px] h-[44px] items-center px-[14px] py-[10px] relative rounded-[8px] shrink-0 w-full"
            data-node-id="2135:2274"
            data-name="Input · Interactivo"
            label="ISBN"
            initialValue=""
          >
            <div
              className="absolute inset-0 rounded-[4px]"
              data-node-id="I2135:2274;2024:4518"
              data-name="Input · DS · Base"
            >
              <div
                className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
                data-node-id="I2135:2274;2024:4518;65:1262"
                data-name="Base"
              />
            </div>
            <DesignText
              className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] h-full leading-[22px] min-w-px not-italic relative text-[14px] text-[color:var(--text\/1,#1d2129)] text-left"
              data-node-id="I2135:2274;165:2392"
            >
              ​
            </DesignText>
          </DesignInput>
        </div>
        <div
          className="content-stretch flex items-center justify-between relative shrink-0 w-full"
          data-node-id="308:3083"
        >
          <div
            className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-[320px]"
            data-node-id="211:1097"
            data-name="Precio de compra (USD)"
          >
            <DesignText
              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
              data-node-id="211:1098"
            >
              Precio de compra (USD)
            </DesignText>
            <DesignInput
              className="content-stretch cursor-pointer flex gap-[10px] h-[44px] items-center px-[14px] py-[10px] relative rounded-[8px] shrink-0 w-full"
              data-node-id="211:1099"
              data-name="Input · Interactivo"
              label="Precio de compra (USD)"
              initialValue="68.00"
            >
              <div
                className="absolute inset-0 rounded-[4px]"
                data-node-id="I211:1099;2024:4518"
                data-name="Input · DS · Base"
              >
                <div
                  className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
                  data-node-id="I211:1099;2024:4518;65:1262"
                  data-name="Base"
                />
              </div>
              <DesignText
                className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] h-full leading-[22px] min-w-px not-italic relative text-[14px] text-[color:var(--text\/1,#1d2129)] text-left"
                data-node-id="I211:1099;165:2392"
              >
                68.00
              </DesignText>
            </DesignInput>
          </div>
          <div
            className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-[320px]"
            data-node-id="211:1105"
            data-name="Tipo de uso"
          >
            <DesignText
              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
              data-node-id="211:1106"
            >
              Tipo de uso
            </DesignText>
            <DesignSelect
              className="content-stretch cursor-pointer flex gap-[10px] h-[44px] items-center px-[14px] py-[10px] relative rounded-[8px] shrink-0 w-full"
              data-node-id="211:1107"
              data-name="Input · Interactivo"
              label="Tipo de uso"
              initialValue="Préstamo externo"
            >
              <div
                className="absolute inset-0 rounded-[4px]"
                data-node-id="I211:1107;2024:4518"
                data-name="Input · DS · Base"
              >
                <div
                  className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
                  data-node-id="I211:1107;2024:4518;65:1262"
                  data-name="Base"
                />
              </div>
              <DesignText
                className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] h-full leading-[22px] min-w-px not-italic relative text-[14px] text-[color:var(--text\/1,#1d2129)] text-left"
                data-node-id="I211:1107;165:2392"
              >
                Préstamo externo
              </DesignText>
            </DesignSelect>
          </div>
        </div>
        <div
          className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full"
          data-node-id="2127:2264"
          data-name="Descripción del libro"
        >
          <DesignText
            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
            data-node-id="2127:2265"
          >
            Descripción del libro
          </DesignText>
          <DesignInput
            className="content-stretch cursor-pointer flex gap-[10px] h-[72px] items-center px-[14px] py-[10px] relative rounded-[8px] shrink-0 w-full"
            data-node-id="2127:2266"
            data-name="Input · Interactivo"
            label="Descripción del libro"
            initialValue=""
          >
            <div
              className="absolute inset-0 rounded-[4px]"
              data-node-id="I2127:2266;2024:4518"
              data-name="Input · DS · Base"
            >
              <div
                className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
                data-node-id="I2127:2266;2024:4518;65:1262"
                data-name="Base"
              />
            </div>
            <DesignText
              className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] h-full leading-[22px] min-w-px not-italic relative text-[14px] text-[color:var(--text\/1,#1d2129)] text-left"
              data-node-id="I2127:2266;165:2392"
            >
              ​
            </DesignText>
          </DesignInput>
        </div>
        <div
          className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full"
          data-node-id="2127:2274"
          data-name="Ejemplares que se reciben"
        >
          <DesignText
            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
            data-node-id="2127:2275"
          >
            Ejemplares que se reciben
          </DesignText>
          <DesignInput
            className="content-stretch cursor-pointer flex gap-[10px] h-[44px] items-center px-[14px] py-[10px] relative rounded-[8px] shrink-0 w-full"
            data-node-id="2127:2276"
            data-name="Input · Interactivo"
            label="Ejemplares que se reciben"
            initialValue="3"
          >
            <div
              className="absolute inset-0 rounded-[4px]"
              data-node-id="I2127:2276;2024:4518"
              data-name="Input · DS · Base"
            >
              <div
                className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
                data-node-id="I2127:2276;2024:4518;65:1262"
                data-name="Base"
              />
            </div>
            <DesignText
              className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] h-full leading-[22px] min-w-px not-italic relative text-[14px] text-[color:var(--text\/1,#1d2129)] text-left"
              data-node-id="I2127:2276;165:2392"
            >
              3
            </DesignText>
          </DesignInput>
        </div>
        <div
          className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full"
          data-node-id="2127:2284"
          data-name="Ubicación"
        >
          <DesignText
            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--text\/1,#1d2129)] w-[576px]"
            data-node-id="2127:2285"
          >
            Ubicación
          </DesignText>
          <DesignInput
            className="content-stretch cursor-pointer flex gap-[10px] h-[44px] items-center px-[14px] py-[10px] relative rounded-[8px] shrink-0 w-full"
            data-node-id="2127:2286"
            data-name="Input · Interactivo"
            label="Ubicación"
            initialValue="Ej. LIT · A1"
          >
            <div
              className="absolute inset-0 rounded-[4px]"
              data-node-id="I2127:2286;2024:4518"
              data-name="Input · DS · Base"
            >
              <div
                className="absolute bg-white border border-[#e1e1e1] border-solid inset-0 rounded-[4px]"
                data-node-id="I2127:2286;2024:4518;65:1262"
                data-name="Base"
              />
            </div>
            <DesignText
              className="[word-break:break-word] flex-[1_0_0] font-['Poppins:Regular'] h-full leading-[22px] min-w-px not-italic relative text-[14px] text-[color:var(--text\/1,#1d2129)] text-left"
              data-node-id="I2127:2286;165:2392"
            >
              ​
            </DesignText>
          </DesignInput>
        </div>
      </div>
      <div
        className="content-stretch cursor-pointer flex gap-[12px] items-center justify-end overflow-clip relative shrink-0 w-full"
        data-node-id="211:1128"
        data-name="Acciones"
      >
        <button
          className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[87px]"
          data-node-id="211:1129"
          data-name="Cancelar"
        >
          <DesignText
            className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#007566] text-[12px] text-left whitespace-nowrap"
            data-node-id="I211:1129;27:252"
          >
            Cancelar
          </DesignText>
        </button>
        <Buttons
          buttonText="Guardar borrador"
          className="border border-[#007566] border-solid content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[148px]"
          type="secondary"
        />
        <Buttons
          buttonText="Guardar y generar etiqueta"
          className="bg-[#00a99b] content-stretch flex h-[40px] items-center justify-center px-[10px] py-[5px] relative rounded-[8px] shrink-0 w-[214px]"
        />
      </div>
    </div>
  );
}
