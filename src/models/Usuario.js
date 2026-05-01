export class Usuario{
    constructor(nombreUsuario,password){
        this.nombreUsuario = nombreUsuario;
        this.password = password;
        this.notificaciones = []; // aca se guardan las notificaciones
    }
}