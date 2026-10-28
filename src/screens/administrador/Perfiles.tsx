import { DesignInput, DesignSelect, DesignText, DynamicSlot } from '../../design-controls';
const imgIdentidadBiblioteca = '/assets/e387d.png';
type ButtonsProps = {
  className?: string;
  buttonText?: string;
  icons?: 'false';
  size?: 'medium';
  state?: 'Default';
  type?: 'secondary';
};
function Buttons({
  className,
  buttonText = 'text',
  icons = 'false',
  size = 'medium',
  state = 'Default',
  type = 'secondary',
}: ButtonsProps) {
  return (
    <button
      type="button"
      className={
        className ||
        'border border-[#007566] border-solid content-stretch flex h-[45px] items-center justify-center p-[10px] relative rounded-[8px]'
      }
      data-node-id="27:257"
    >
      <p
        className="[word-break:break-word] font-['Poppins:Medium'] leading-[22px] not-italic relative shrink-0 text-[#007566] text-[14px] whitespace-nowrap"
        data-node-id="27:258"
      >
        {buttonText}
      </p>
    </button>
  );
}
export default function Perfiles() {
  return (
    <div
      className="bg-[#fafafa] content-stretch flex flex-col items-start relative size-full"
      data-node-id="371:1836"
      data-name="gestión de perfiles - administrador"
    >
      <div
        className="bg-[#fafafa] content-stretch flex flex-col items-start min-h-[422px] min-w-[320px] relative shrink-0 w-full"
        data-node-id="371:1837"
        data-name="AppShell"
      >
        <div
          className="bg-white content-stretch flex flex-col h-[76px] items-start relative shrink-0 w-full"
          data-node-id="371:1838"
          data-name="header"
        >
          <div
            className="absolute backdrop-blur-[12px] bg-[rgba(255,255,255,0)] border-[#d4d4d4] border-b border-solid content-stretch flex gap-[20px] h-[76px] items-center left-0 pl-[48px] pr-[32px] top-0 w-[1280px]"
            data-node-id="I371:1838;62:561"
            data-name="Header"
          >
            <div
              className="border border-[rgba(0,0,0,0)] border-solid content-stretch flex gap-[12px] h-[75px] items-center min-h-[40px] px-[14.4px] py-[8.8px] relative rounded-[6px] shrink-0 w-[182.914px]"
              data-node-id="I371:1838;62:562"
              data-name="Identidad · Biblioteca"
            >
              <img
                alt=""
                className="absolute inset-0 max-w-none object-contain pointer-events-none rounded-[6px] size-full"
                src={imgIdentidadBiblioteca}
              />
            </div>
            <div
              className="content-stretch flex gap-[8px] h-[50px] items-center justify-center px-[24px] relative shrink-0 w-[645px]"
              data-node-id="I371:1838;62:570"
              data-name="Navigation"
            >
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch cursor-pointer flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I371:1838;207:651"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I371:1838;207:651;144:1484"
                >
                  Reportes
                </DesignText>
              </button>
              <button
                className="bg-[#00a99b] border border-[rgba(0,0,0,0)] border-solid content-stretch flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I371:1838;207:652"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap"
                  data-node-id="I371:1838;207:652;144:1469"
                >
                  Usuarios
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch cursor-pointer flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I371:1838;207:653"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] font-medium leading-[18px] relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I371:1838;207:653;144:1484"
                  style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
                >
                  Libros ▾
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch cursor-pointer flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I371:1838;207:654"
                data-name="Operaciones"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] font-medium leading-[18px] relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I371:1838;207:654;144:1484"
                  style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
                >
                  Administración ▾
                </DesignText>
              </button>
              <button
                className="border border-[rgba(0,0,0,0)] border-solid content-stretch cursor-pointer flex flex-col h-[40px] items-center justify-center min-h-[40px] px-[14.4px] py-[8px] relative rounded-[10px] shrink-0"
                data-node-id="I371:1838;207:655"
                data-name="nav"
              >
                <DesignText
                  className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#00a99b] text-[12px] text-center whitespace-nowrap"
                  data-node-id="I371:1838;207:655;144:1484"
                >
                  Operaciones ▾
                </DesignText>
              </button>
            </div>
            <div
              className="content-stretch flex h-[75px] items-center justify-between overflow-clip relative shrink-0 w-[332px]"
              data-node-id="I371:1838;62:576"
              data-name="Container"
            >
              <div
                className="content-stretch flex gap-[9.6px] items-center relative shrink-0"
                data-node-id="I371:1838;62:584"
                data-name="Container"
              >
                <div
                  className="bg-[#262626] grid grid-cols-[_32px] grid-rows-[_32px] relative rounded-[16px] shrink-0 size-[32px]"
                  data-node-id="I371:1838;62:585"
                  data-name="Text"
                >
                  <DesignText
                    className="[word-break:break-word] col-1 font-['Poppins:Regular'] justify-self-center leading-[18px] not-italic relative row-1 self-center shrink-0 text-[12px] text-white whitespace-nowrap"
                    data-node-id="I371:1838;62:586"
                  >
                    AC
                  </DesignText>
                </div>
                <div
                  className="content-stretch cursor-pointer flex flex-col items-start relative shrink-0 w-[89.641px]"
                  data-node-id="I371:1838;62:587"
                  data-name="Container"
                >
                  <button
                    className="content-stretch flex flex-col items-start relative shrink-0"
                    data-node-id="I371:1838;62:588"
                    data-name="Bold Text"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#171717] text-[12px] text-left whitespace-nowrap"
                      data-node-id="I371:1838;62:589"
                    >
                      Alfonso Chapa
                    </DesignText>
                  </button>
                  <button
                    className="content-stretch flex flex-col h-[18px] items-start max-w-[160px] overflow-clip relative shrink-0"
                    data-node-id="I371:1838;62:590"
                    data-name="Small"
                  >
                    <DesignText
                      className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#737373] text-[12px] text-left whitespace-nowrap"
                      data-node-id="I371:1838;62:591"
                    >
                      Admin
                    </DesignText>
                  </button>
                </div>
              </div>
              <div
                className="content-stretch cursor-pointer flex items-center justify-center min-h-[40px] relative rounded-[6px] shrink-0"
                data-node-id="I371:1838;62:592"
                data-name="Button · DS"
              >
                <Buttons
                  buttonText="Cerrar sesión"
                  className="aspect-[74/40] border border-[#007566] border-solid content-stretch flex items-center justify-center p-[10px] relative rounded-[8px] shrink-0"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className="content-stretch flex flex-col items-center px-[27px] relative shrink-0 w-full"
          data-node-id="371:1839"
          data-name="Main Content:margin"
        >
          <div
            className="content-stretch flex flex-col items-start min-h-[278px] pb-[80px] pt-[56px] relative shrink-0 w-full"
            data-node-id="371:1840"
            data-name="Main Content"
          >
            <div
              className="[word-break:break-word] content-stretch flex flex-col gap-[16px] items-start not-italic overflow-clip pb-[40px] relative shrink-0 w-full"
              data-node-id="2148:2156"
              data-name="Roles y permisos del sistema"
            >
              <DesignText
                className="font-['Poppins:Medium'] leading-[32px] relative shrink-0 text-[#1f1f1f] text-[24px] w-[1226px]"
                data-node-id="2148:2157"
              >
                Gestión de perfiles y permisos
              </DesignText>
              <DesignText
                className="font-['Poppins:Regular'] leading-[24px] relative shrink-0 text-[#4b4b4b] text-[16px] w-[1226px]"
                data-node-id="2148:2158"
              >
                Consulta los 6 roles del sistema y las acciones autorizadas para cada uno.
              </DesignText>
              <DynamicSlot
                className="bg-white border border-[#e1e1e1] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[12px] shrink-0 w-full"
                data-node-id="2148:2159"
                data-name="Tabla · Roles, permisos y autorizaciones"
              >
                <div
                  className="border-[#e1e1e1] border-b border-solid content-stretch flex font-['Poppins:Medium'] gap-[24px] items-start leading-[22px] overflow-clip px-[24px] py-[16px] relative shrink-0 text-[14px] w-full"
                  data-node-id="2148:2160"
                  data-name="Encabezado de permisos"
                >
                  <DesignText
                    className="relative shrink-0 text-[#1f1f1f] w-[154px]"
                    data-node-id="2148:2161"
                  >
                    Perfil / rol
                  </DesignText>
                  <DesignText
                    className="relative shrink-0 text-[#1f1f1f] w-[216px]"
                    data-node-id="2148:2162"
                  >
                    Ámbito de acceso
                  </DesignText>
                  <DesignText
                    className="relative shrink-0 text-[#1f1f1f] w-[448px]"
                    data-node-id="2148:2163"
                  >
                    Permisos y acciones
                  </DesignText>
                  <DesignText
                    className="relative shrink-0 text-[#4b4b4b] w-[288px]"
                    data-node-id="2148:2164"
                  >
                    Autorizaciones y condiciones
                  </DesignText>
                </div>
                <div
                  className="border-[#e1e1e1] border-b border-solid content-stretch flex gap-[24px] items-start overflow-clip px-[24px] py-[20px] relative shrink-0 w-full"
                  data-node-id="2148:2165"
                  data-name="Rol · Alumno"
                >
                  <DesignText
                    className="font-['Poppins:Medium'] leading-[24px] relative shrink-0 text-[#1f1f1f] text-[16px] w-[154px]"
                    data-node-id="2148:2166"
                  >
                    Alumno
                  </DesignText>
                  <DesignText
                    className="font-['Poppins:Regular'] leading-[22px] relative shrink-0 text-[#1f1f1f] text-[14px] w-[216px]"
                    data-node-id="2148:2167"
                  >
                    Catálogo y cuenta propia
                  </DesignText>
                  <div
                    className="font-['Poppins:Regular'] leading-[0] relative shrink-0 text-[#1f1f1f] text-[14px] w-[448px]"
                    data-node-id="2148:2168"
                  >
                    <DesignText className="leading-[22px] mb-0">
                      Buscar libros y consultar detalle, disponibilidad, PDF e impresión.
                    </DesignText>
                    <DesignText className="leading-[22px]">
                      Consultar préstamos y adeudos propios; solicitar renovación.
                    </DesignText>
                  </div>
                  <div
                    className="font-['Poppins:Regular'] leading-[0] relative shrink-0 text-[#4b4b4b] text-[14px] w-[288px]"
                    data-node-id="2148:2169"
                  >
                    <DesignText className="leading-[22px] mb-0">
                      Préstamos: 5 días hábiles.
                    </DesignText>
                    <DesignText className="leading-[22px] mb-0">Máximo 2 renovaciones.</DesignText>
                    <DesignText className="leading-[22px]">
                      Sujeto al estado de la cuenta y validación del bibliotecario.
                    </DesignText>
                  </div>
                </div>
                <div
                  className="border-[#e1e1e1] border-b border-solid content-stretch flex gap-[24px] items-start overflow-clip px-[24px] py-[20px] relative shrink-0 w-full"
                  data-node-id="2148:2170"
                  data-name="Rol · Maestro"
                >
                  <DesignText
                    className="font-['Poppins:Medium'] leading-[24px] relative shrink-0 text-[#1f1f1f] text-[16px] w-[154px]"
                    data-node-id="2148:2171"
                  >
                    Maestro
                  </DesignText>
                  <DesignText
                    className="font-['Poppins:Regular'] leading-[22px] relative shrink-0 text-[#1f1f1f] text-[14px] w-[216px]"
                    data-node-id="2148:2172"
                  >
                    Catálogo y cuenta propia
                  </DesignText>
                  <div
                    className="font-['Poppins:Regular'] leading-[0] relative shrink-0 text-[#1f1f1f] text-[14px] w-[448px]"
                    data-node-id="2148:2173"
                  >
                    <DesignText className="leading-[22px] mb-0">
                      Buscar libros y consultar detalle, disponibilidad, PDF e impresión.
                    </DesignText>
                    <DesignText className="leading-[22px]">
                      Consultar préstamos y adeudos propios; solicitar renovación.
                    </DesignText>
                  </div>
                  <div
                    className="font-['Poppins:Regular'] leading-[0] relative shrink-0 text-[#4b4b4b] text-[14px] w-[288px]"
                    data-node-id="2148:2174"
                  >
                    <DesignText className="leading-[22px] mb-0">
                      Préstamos: 10 días hábiles.
                    </DesignText>
                    <DesignText className="leading-[22px] mb-0">Máximo 2 renovaciones.</DesignText>
                    <DesignText className="leading-[22px]">
                      Sujeto al estado de la cuenta y validación del bibliotecario.
                    </DesignText>
                  </div>
                </div>
                <div
                  className="border-[#e1e1e1] border-b border-solid content-stretch flex gap-[24px] items-start overflow-clip px-[24px] py-[20px] relative shrink-0 w-full"
                  data-node-id="2148:2175"
                  data-name="Rol · Colaborador"
                >
                  <DesignText
                    className="font-['Poppins:Medium'] leading-[24px] relative shrink-0 text-[#1f1f1f] text-[16px] w-[154px]"
                    data-node-id="2148:2176"
                  >
                    Colaborador
                  </DesignText>
                  <DesignText
                    className="font-['Poppins:Regular'] leading-[22px] relative shrink-0 text-[#1f1f1f] text-[14px] w-[216px]"
                    data-node-id="2148:2177"
                  >
                    Catálogo y cuenta propia
                  </DesignText>
                  <div
                    className="font-['Poppins:Regular'] leading-[0] relative shrink-0 text-[#1f1f1f] text-[14px] w-[448px]"
                    data-node-id="2148:2178"
                  >
                    <DesignText className="leading-[22px] mb-0">
                      Buscar libros y consultar detalle, disponibilidad, PDF e impresión.
                    </DesignText>
                    <DesignText className="leading-[22px]">
                      Consultar préstamos y adeudos propios; solicitar renovación.
                    </DesignText>
                  </div>
                  <div
                    className="font-['Poppins:Regular'] leading-[0] relative shrink-0 text-[#4b4b4b] text-[14px] w-[288px]"
                    data-node-id="2148:2179"
                  >
                    <DesignText className="leading-[22px] mb-0">
                      Préstamos: 5 días hábiles.
                    </DesignText>
                    <DesignText className="leading-[22px] mb-0">Máximo 2 renovaciones.</DesignText>
                    <DesignText className="leading-[22px]">
                      Sujeto al estado de la cuenta y validación del bibliotecario.
                    </DesignText>
                  </div>
                </div>
                <div
                  className="border-[#e1e1e1] border-b border-solid content-stretch flex gap-[24px] items-start overflow-clip px-[24px] py-[20px] relative shrink-0 w-full"
                  data-node-id="2148:2180"
                  data-name="Rol · Bibliotecario"
                >
                  <DesignText
                    className="font-['Poppins:Medium'] leading-[24px] relative shrink-0 text-[#1f1f1f] text-[16px] w-[154px]"
                    data-node-id="2148:2181"
                  >
                    Bibliotecario
                  </DesignText>
                  <DesignText
                    className="font-['Poppins:Regular'] leading-[22px] relative shrink-0 text-[#1f1f1f] text-[14px] w-[216px]"
                    data-node-id="2148:2182"
                  >
                    Préstamos, atención e inventario
                  </DesignText>
                  <div
                    className="font-['Poppins:Regular'] leading-[0] relative shrink-0 text-[#1f1f1f] text-[14px] w-[448px]"
                    data-node-id="2148:2183"
                  >
                    <DesignText className="leading-[22px] mb-0">
                      Validar usuarios y libros; registrar préstamos, devoluciones y renovaciones.
                      Gestionar multas y pagos; consultar suspendidos.
                    </DesignText>
                    <DesignText className="leading-[22px]">
                      Registrar y editar libros; clasificar, etiquetar y dar de baja ejemplares o
                      libros, con historial.
                    </DesignText>
                  </div>
                  <div
                    className="font-['Poppins:Regular'] leading-[0] relative shrink-0 text-[#4b4b4b] text-[14px] w-[288px]"
                    data-node-id="2148:2184"
                  >
                    <DesignText className="leading-[22px] mb-0">
                      Validar cuenta y disponibilidad antes del préstamo.
                    </DesignText>
                    <DesignText className="leading-[22px] mb-0">
                      Registrar motivo e historial en las bajas.
                    </DesignText>
                    <DesignText className="leading-[22px]">
                      Sin administración de perfiles ni autorización de compras.
                    </DesignText>
                  </div>
                </div>
                <div
                  className="border-[#e1e1e1] border-b border-solid content-stretch flex gap-[24px] items-start overflow-clip px-[24px] py-[20px] relative shrink-0 w-full"
                  data-node-id="2148:2185"
                  data-name="Rol · Administrador"
                >
                  <DesignText
                    className="font-['Poppins:Medium'] leading-[24px] relative shrink-0 text-[#1f1f1f] text-[16px] w-[154px]"
                    data-node-id="2148:2186"
                  >
                    Administrador
                  </DesignText>
                  <DesignText
                    className="font-['Poppins:Regular'] leading-[22px] relative shrink-0 text-[#1f1f1f] text-[14px] w-[216px]"
                    data-node-id="2148:2187"
                  >
                    Administración del sistema
                  </DesignText>
                  <div
                    className="font-['Poppins:Regular'] leading-[0] relative shrink-0 text-[#1f1f1f] text-[14px] w-[448px]"
                    data-node-id="2148:2188"
                  >
                    <DesignText className="leading-[22px] mb-0">
                      Gestionar usuarios, asignar roles y administrar perfiles.
                    </DesignText>
                    <DesignText className="leading-[22px] mb-0">
                      Gestionar catálogo, libros, ejemplares, etiquetas y bajas. Consultar reportes
                      e inventario.
                    </DesignText>
                    <DesignText className="leading-[22px]">
                      Solicitar libros y actualizar la lista de solicitudes.
                    </DesignText>
                  </div>
                  <div
                    className="font-['Poppins:Regular'] leading-[0] relative shrink-0 text-[#4b4b4b] text-[14px] w-[288px]"
                    data-node-id="2148:2189"
                  >
                    <DesignText className="leading-[22px] mb-0">
                      Desactivar perfiles solo cuando no tengan cuentas activas asociadas.
                    </DesignText>
                    <DesignText className="leading-[22px] mb-0">
                      Las bajas conservan historial.
                    </DesignText>
                    <DesignText className="leading-[22px]">
                      La autorización presupuestal corresponde a Tesorería.
                    </DesignText>
                  </div>
                </div>
                <div
                  className="border-[#e1e1e1] border-b border-solid content-stretch flex gap-[24px] items-start overflow-clip px-[24px] py-[20px] relative shrink-0 w-full"
                  data-node-id="2148:2190"
                  data-name="Rol · Comprador de libros"
                >
                  <DesignText
                    className="font-['Poppins:Medium'] leading-[24px] relative shrink-0 text-[#1f1f1f] text-[16px] w-[154px]"
                    data-node-id="2148:2191"
                  >
                    Comprador de libros
                  </DesignText>
                  <DesignText
                    className="font-['Poppins:Regular'] leading-[22px] relative shrink-0 text-[#1f1f1f] text-[14px] w-[216px]"
                    data-node-id="2148:2192"
                  >
                    Compras y adquisiciones
                  </DesignText>
                  <div
                    className="font-['Poppins:Regular'] leading-[0] relative shrink-0 text-[#1f1f1f] text-[14px] w-[448px]"
                    data-node-id="2148:2193"
                  >
                    <DesignText className="leading-[22px] mb-0">
                      Preparar solicitudes y remitirlas a Tesorería. Consultar estado y actualizar
                      la lista.
                    </DesignText>
                    <DesignText className="leading-[22px]">
                      Registrar entregas recibidas y entregar al encargado del catálogo con
                      cantidades e historial identificables.
                    </DesignText>
                  </div>
                  <div
                    className="font-['Poppins:Regular'] leading-[0] relative shrink-0 text-[#4b4b4b] text-[14px] w-[288px]"
                    data-node-id="2148:2194"
                  >
                    <DesignText className="leading-[22px] mb-0">
                      Considerar el presupuesto mensual informado.
                    </DesignText>
                    <DesignText className="leading-[22px] mb-0">
                      Tesorería autoriza las solicitudes.
                    </DesignText>
                    <DesignText className="leading-[22px]">
                      Registrar cantidades recibidas y entregadas para dar seguimiento.
                    </DesignText>
                  </div>
                </div>
              </DynamicSlot>
              <DesignText
                className="font-['Poppins:Regular'] leading-[18px] relative shrink-0 text-[#4b4b4b] text-[12px] w-[1226px]"
                data-node-id="2148:2195"
              >
                Las acciones se limitan al ámbito de cada rol. Tesorería participa en la
                autorización de adquisiciones y no es un perfil de acceso del sistema.
              </DesignText>
            </div>
          </div>
        </div>
        <div
          className="bg-white border-[#cacaca] border-solid border-t-[0.667px] content-stretch flex h-[65.948px] items-start justify-between px-[32px] py-[24px] relative shrink-0 w-full"
          data-node-id="371:1989"
          data-name="Footer"
        >
          <div
            className="content-stretch flex flex-col h-full items-start relative shrink-0"
            data-node-id="371:1990"
            data-name="Text"
          >
            <DesignText
              className="[word-break:break-word] font-['Poppins:Medium'] leading-[18px] not-italic relative shrink-0 text-[#8e8e8e] text-[12px] whitespace-nowrap"
              data-node-id="371:1991"
            >
              Universidad Ducky · Sistema de Biblioteca
            </DesignText>
          </div>
        </div>
      </div>
    </div>
  );
}
