export class Note {
    key?: string; //Uniquer Key der Notiz
    uid: string; //Uid des erstellers
    title: string; //Titel der Notiz
    content: any;  //Inhalt der NOtiz
    created: string; //Erstellungs Timestamp ISO String
    modified: string; //Letzes Update Timestamp ISO String
}
