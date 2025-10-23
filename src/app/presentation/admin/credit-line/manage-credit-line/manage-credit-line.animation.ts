import { animate, style, transition, trigger } from "@angular/animations";


export const creditLineAnimation = trigger('creditLineAnimation',
    [
        transition(':enter', [
            style({ transform: 'translateX(0%)', opacity: 0 }),
            animate('400ms', style({ opacity: 1 }))
        ])
    ]
);