export class Permission {
    key?: string; //Unqiuer key
    creatoruid: string;  //uid des Ersteller dieser Permission
    uid: string; //uid der Person welche Zugriff erhält
    noteid: string; //ID der Notiz zu welcher Zugriff erteilt wird
    write: boolean; //Ob Person Schreibrechte hat
    read: boolean; //Ob Person leserechte hat
    execute: boolean; //Ob Person Operationen ausführen darf
}
