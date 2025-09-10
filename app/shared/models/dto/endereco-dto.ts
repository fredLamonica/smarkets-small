import { Endereco } from "../endereco";
import { TipoEndereco } from "../enums/tipo-endereco";

export class EnderecoDto{
    public enderecobase: Endereco;
    public tipos: Array<TipoEndereco>;
}