export function setLengthPhone(event: any) {
    
    return (event.value.toString().startsWith('9')) ? 9 : 20
}

export function phoneValidator(phone: string) {

    return (phone.startsWith('9')) ? 9 : 20
}