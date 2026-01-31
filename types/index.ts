export interface PromocaoRequest {
  unidadeIds: string[]
  valorPromocaos: ValorPromocao[]
}

export interface ValorPromocao {
  nome: string
  descricao?: string
  valor: number
  unidade?: string
  quantidadeMedida?: number
  inicioPromocao?: string
  fimPromocao?: string
  marca?: string
  categoria?: string
}

export interface PromocaoMultiResponse {
  ids: string[]
  total: number
}

export interface PromocaoResponse {
  id: string
  unidadeIds: string[]
  nome: string
  descricao?: string
  valor: number
  unidade?: string
  quantidadeMedida?: number
  inicioPromocao: string
  fimPromocao: string
  marca?: string
  categoria?: string
}

export interface RedeRequest {
  nome: string
  cnpj: string
  urlLogo?: string
}

export interface RedeResponse {
  id: string
  nome: string
  cnpj: string
  urlLogo?: string
}

export interface UnidadeRequest {
  redeId: string
  nomeLoja: string
  logradouro: string
  cidade: string
  estado: string
  longitude: number
  latitude: number
}

export interface UnidadeResponse {
  id: string
  redeId: string
  nomeLoja: string
  logradouro: string
  cidade: string
  estado: string
  longitude: number
  latitude: number
}

export interface UnidadeComRede extends UnidadeResponse {
  rede?: RedeResponse
}

export interface PromocaoComUnidade extends PromocaoResponse {
  unidadeDados?: UnidadeComRede
}

export interface IdResponse {
  id: string
}

// Auth types
export type Role = 'ADMIN' | 'COMMON'

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  role: Role
}

export interface TokenResponse {
  token: string
  type: string
  expiresIn: number
}

export interface User {
  username: string
  role: Role
}
