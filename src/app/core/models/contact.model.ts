export interface ContactModel {

    id?: number;
    status?: boolean;
    id_Client?: number;
    id_Contact?: number;
    type_Parameter?: number;
    area_Parameter?: number;
    full_Name?: string;
    comment?: string;
    creation_Date?: string;
    creation_author?: number;
    modification_Date?: string;
    modification_author?: number;
    start_date?: string;
    end_date?: string;
    area_Contact_Description?: string;
    type_Contact_Description?: string;
    code_Area_Parameter?: string
    user? :string;
    Code_Type_Parameter?: string

}

export interface RegisterContact extends ContactModel {
    phones_Contact: RegisterPhoneContactModel[];
    emails_Contact: RegisterEmailContactModel[];
}

export interface RegisterPhoneContactModel {
    telephone?: string;
    phone?: string;
}

export interface RegisterEmailContactModel {
    email?: string;
}

export interface UpdateContact extends ContactModel {
    phones_Contact: UpdatePhoneContactModel[];
    emails_Contact: UpdateEmailContactModel[];
}

export interface UpdatePhoneContactModel {
    id?: number;
    phone?: string;
}

export interface UpdateEmailContactModel {
    id?: number;
    email?: string;
}
