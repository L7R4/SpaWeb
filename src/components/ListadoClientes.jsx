import { db } from '../../credentials';
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore'; // Importa query y where
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';

export function ListadoClientes() {
    const [clientes, setClientes] = useState([]);

    // Función para obtener los usuarios desde Firestore con filtro
    const fetchClientes = async () => {
        try {
            // Creamos la query para filtrar los usuarios cuyo rango es 'Cliente'
            const q = query(collection(db, 'usuarios'), where('rango', '==', 'Cliente'));
            const querySnapshot = await getDocs(q);
            const clientesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setClientes(clientesList);
        } catch (error) {
            console.error('Error fetching usuarios: ', error);
        }
    };



    useEffect(() => {
        fetchClientes();
    }, []);

    return (
        <div className='containerForUserLoged'>
            <Header />
            <div className="usuario-admin">
                <h1>Listado de clientes</h1>
                <table className="usuario-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Nombre Completo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map(usuario => (
                            <tr key={usuario.id}>
                                <td>{usuario.email}</td>
                                <td>{usuario.nombreCompleto}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}