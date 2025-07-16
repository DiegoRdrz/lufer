/*  Hook diseñado para ser reutilizado
    cuando se quiere comprobar si la página
    actual está en construcción
    (En teoría, solo se usará en NotFoundError) */

import { useLocation } from 'react-router-dom';

export default function useIsPageOnBuilding(pagesOnBuilding: string[]) {
    const location = useLocation();
    const currentPath = decodeURIComponent(location.pathname.toLowerCase());

    return pagesOnBuilding
        .map(page => `/${page.toLowerCase()}`)
        .includes(currentPath);
}