import { PrimeNGConfig } from 'primeng/api';

export function configurePrimeNGTranslation(primengConfig: PrimeNGConfig): () => void {
  return () => {
    primengConfig.setTranslation({
      monthNames: [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ],
      monthNamesShort: [
        'ene', 'feb', 'mar', 'abr', 'may', 'jun',
        'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
      ]
    });
  };
}
