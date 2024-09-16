import { useEffect, useState } from "react";
import { onChangeUser } from '../../credentials';

const useUsuario = () => {
    const [usuario, setUsuario] = useState(undefined);

    useEffect(() => {
        onChangeUser(setUsuario);
    }, [])
    return usuario;
}

export default useUsuario