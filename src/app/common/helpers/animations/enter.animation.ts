import { animate, style, transition, trigger } from "@angular/animations";

export const enter = trigger('enter',
    [
        transition(':enter', [
            style({ transform: 'translateX(0%)', opacity: 0 }),
            animate('200ms', style({ opacity: 1 }))
        ])
    ]
);