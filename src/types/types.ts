import { RegistroFormData } from "@/components/Formularios/RegistrarUsuarioForm/RegistrarUsuarioForm";
import { DivIcon, LatLng, LatLngExpression, PathOptions, Routing } from "leaflet";
import { SubmitHandler } from "react-hook-form";

// ---------- User, Authentication, and Session Interfaces ----------

export interface AutenticaUsuario {
  emailUsuario: string;
  senhaUsuario: string;
}

export interface usuarioBody {
  idUsuario: string;
  dataCriacao: string;
  nomeUsuario: string;
  tipoUsuario: string;
  autenticaUsuario: AutenticaUsuario;
  telefoneContato: string;
  idCidade: string;
  emailUsuario: string;
}

export interface CreateUsuario {
  nomeUsuario: string;
  tipoUsuario: string;
  autenticaUsuario: AutenticaUsuario;
  telefoneContato: string;
  idCidade: string;
}

export interface loginBody {
  emailUsuario: string;
  senhaUsuario: string;
}

export interface sessaoBody {
  tokenSessao: string;
  statusSessao: string;
  dataLogin: string;
  responseUsuarioDto: usuarioBody;
}

// ---------- Core Geographic and Entity Interfaces ----------

export interface Cidade {
  idCidade: string;
  deleted: boolean;
  dataCriacao: string;
  nomeCidade: string;
  cepCidade: string;
  quantidadeOcorrencias: number;
  quantidadeAbrigos: number;
  lat: number;
  lon: number;
  zoomPadrao?: number;
}

export interface Abrigo {
  idAbrigo: string;
  nomeAbrigo: string;
  enderecoAbrigo: string;
  cep: string;
  capacidadeMaxima: number;
  telefoneContato: string;
  statusFuncionamento: string;
  nivelSegurancaAtual: string;
  deleted?: boolean;
  lat: number;
  lon: number;
}

export interface Ocorrencia {
  idOcorrencia: string;
  deleted: boolean;
  dataCriacao: string;
  cep: string;
  lat: number;
  lon: number;
  tipoOcorrencia: string;
  nivelGravidade: string;
  idCidade: number;
}

export interface Alerta {
  id: string;
  tipo: "risco_enchente" | "enchente_confirmada" | "risco_alagamento" | "alagamento_confirmado" | "risco_queimada" | "queimada_confirmada";
  coordenadas: [number, number];
  descricao: string;
  nivelPerigo?: "baixo" | "moderado" | "alto" | "crítico";
  dataHora?: string;
}

// ---------- Map Component and Leaflet-Specific Interfaces ----------

export interface LeafletMapProps {
  center: LatLngExpression;
  nomeCentro: string;
  zoom: number;
  abrigos?: Abrigo[];
  ocorrencias?: Ocorrencia[];
  onRouteInstructionsUpdate?: (instructions: Routing.IInstruction[] | null) => void;
}

export interface MapaProps {
  coordX: number;
  coordY: number;
  nomeCentro: string;
  zoom: number;
  abrigos?: Abrigo[];
  ocorrencias?: Ocorrencia[];
  onRouteInstructionsUpdate?: (instructions: Routing.IInstruction[] | null) => void;
}

export interface BotoesMapaProps {
  nomeCentro: string;
  handleRouteToNearestShelter: () => void;
  userLocation: LatLng | null;
  routeDestination: LatLngExpression | null;
  clearRouteHandler: () => void;
}

export interface RoutingMachineProps {
  start: LatLng | null;
  end: LatLngExpression | null;
  onInstructionsChange: (instructions: Routing.IInstruction[] | null) => void;
  showAlert: (message: string, title?: string) => void;
  ocorrencias: Ocorrencia[];
}

export interface CircleStyle {
  radius: number;
  pathOptions: PathOptions;
}

export interface CustomRoutingResultEvent extends L.LeafletEvent {
  routes: Array<{
    instructions: Routing.IInstruction[];
    coordinates: L.LatLng[];
  }>;
}

export interface CustomRoutingErrorEvent extends L.LeafletEvent {
  error: Error;
}

export interface EstiloCirculo {
  radius: number;
  pathOptions: PathOptions;
}

// ---------- Form Data Interfaces ----------

export interface NovaCidadeFormData {
  cep: string;
  nomeCidade?: string;
}

export interface NovoAbrigoFormData {
  idCidade: string;
  nomeAbrigo: string;
  cep: string;
  capacidadeMaxima: string;
  enderecoAbrigo: string;
  telefoneContato: string;
  statusFuncionamento: string;
  nivelSegurancaAtual: string;
}

export interface NovaOcorrenciaFormData {
    tipoOcorrencia: string;
    nivelGravidade: string;
    idCidade: string;
    cep: string;
}

export interface EmailFormData {
  novoEmail: string;
}

export interface SenhaFormData {
  novaSenha: string;
  confirmarNovaSenha: string;
}

export interface TelefoneFormData {
  novoTelefone: string;
}

export type CepFormData = {
    novoCep: string;
};

export interface NovaOcorrenciaFormData {
    cep: string;
    tipoOcorrencia: "ENCHENTE" | "ALAGAMENTO" | "DESLIZAMENTO" | "QUEIMADA" | string;
    nivelGravidade: "BAIXO" | "MÉDIO" | "ALTO" | string;
    idCidade: string;
}

// ---------- UI Component and Prop Interfaces ----------

export interface CaixaCidadeProps {
  cidade: Cidade;
  idCidadeSendoExcluida: string | null;
  onExcluir?: (idCidade: string) => void;
}

export interface MarcadoresAbrigosProps {
    abrigos: Abrigo[];
    criarIconeAbrigo: () => DivIcon;
    handleDirectRouteToShelter: (abrigo: Abrigo) => void;
}

export interface CustomAlertProps {
    isOpen: boolean;
    message: string;
    title?: string;
    onClose: () => void;
    onConfirm?: () => void;
    confirmButtonText?: string;
    cancelButtonText?: string;
    hideCloseButton?: boolean;
}

export interface DetalhesCidadeSelecionadaProps {
    cidadeSelecionada: Cidade | null;
    rotaInstrucoes: Routing.IInstruction[] | null;
    ocorrenciasAtuais: Ocorrencia[];
    abrigosAtuais: Abrigo[];
}

export interface CaixaAbrigoProps {
  abrigo: Abrigo;
  idAbrigoSendoExcluido: string | null;
  onExcluir?: (idAbrigo: string) => void;
}

export interface CaixaOcorrenciaProps {
  ocorrencia: Ocorrencia;
  idOcorrenciaSendoExcluida: string | null;
  onExcluir?: (idOcorrenciaString: string) => void;
}

export interface AlertPopupProps {
  message: string;
  type: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export interface CustomAlertProps {
  isOpen: boolean;
  message: string;
  title?: string;
  onClose: () => void;
}

export interface EditarEmailFormProps {
  onSubmit: SubmitHandler<EmailFormData>;
  onCancel: () => void;
  isSubmitting: boolean;
  initialNovoEmail?: string;
  inputClasses?: string;
  errorTextClasses?: string;
  botaoSalvarClasses?: string;
  botaoCancelarClasses?: string;
}

export interface EditarSenhaFormProps {
  onSubmit: SubmitHandler<SenhaFormData>;
  onCancel: () => void;
  isSubmitting: boolean;
  inputClasses?: string;
  errorTextClasses?: string;
  botaoSalvarClasses?: string;
  botaoCancelarClasses?: string;
}

export interface EditarTelefoneFormProps {
  onSubmit: SubmitHandler<TelefoneFormData>;
  onCancel: () => void;
  isSubmitting: boolean;
  initialTelefone?: string;
  inputClasses?: string;
  errorTextClasses?: string;
  botaoSalvarClasses?: string;
  botaoCancelarClasses?: string;
}

export interface EditarCepFormProps {
    onSubmit: SubmitHandler<CepFormData>;
    onCancel: () => void;
    isSubmitting: boolean;
    initialNovoCep?: string;
    inputClasses?: string;
    errorTextClasses?: string;
    botaoSalvarClasses?: string;
    botaoCancelarClasses?: string;
}

export interface LoginFormProps {
    onSubmit: SubmitHandler<loginBody>;
    isSubmitting: boolean;
    inputBaseClasses: string;
    inputErrorClasses: string;
    inputValidClasses: string;
    errorTextClasses: string;
    buttonClasses: string;
    formSpacingClasses?: string;
}

export interface RegistrarCidadeFormProps {
    onFormSubmit: SubmitHandler<NovaCidadeFormData>;
    isSubmitting: boolean;
    className?: string;
}

export interface RegistroFormProps {
    onSubmit: SubmitHandler<RegistroFormData>;
    isSubmitting: boolean;
    listaCidades: Cidade[];
    inputBaseClasses: string;
    inputErrorClasses: string;
    inputValidClasses: string;
    errorTextClasses: string;
    buttonClasses: string;
    formSpacingClasses?: string;
}

export interface ActionLinkProps {
    href: string;
    iconClassName?: string;
    title: string;
    description?: string;
}

export interface LinkProps {
    href: string;
    iconName: string;
    children: React.ReactNode;
    toggleMenu?: () => void;
};

export interface ListaAbrigosCadastradosProps {
    abrigos: Abrigo[];
    isDeletingAbrigo: string | null;
    onExcluirAbrigo?: (idAbrigo: string) => void;
    isLoadingAbrigos: boolean;
    selectedCidadeId: string | null;
    className?: string;
}

export interface ListaCidadesCadastradasProps {
    cidades: Cidade[];
    isDeleting: string | null;
    onExcluirCidade?: (idCidade: string) => void;
    onEditarCidade?: (idCidade: string) => void;
    onVerDetalhesCidade?: (idCidade: string) => void;
    className?: string;
    error?: string | null;
}

export interface ListaOcorrenciasRegistradasProps {
    ocorrencias: Ocorrencia[];
    isDeletingOcorrenciaId: string | null;
    onExcluirOcorrencia?: (idOcorrencia: string) => void;
    isLoadingOcorrencias: boolean;
    selectedCidadeId: string | null;
    className?: string;
}

export interface SelectorCidadeProps {
    cidades: Cidade[];
    cidadeSelecionada: Cidade | null;
    handleCidadeSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    isLoading: boolean;
}

// ---------- General and Utility Interfaces ----------

export interface ErrorPageProps {
  error: string;
}